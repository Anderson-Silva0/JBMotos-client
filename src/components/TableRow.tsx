import {
  SelectedProductProps,
  ProductOfSaleRowIdProps,
  SelectedProductRegisterProps,
  TotalValuesProps,
} from "@/app/(pages)/venda/cadastro/page";
import { ProductOfSale, productOfSaleInitialState} from "@/models/productOfSale";
import { Stock, stockInitialState } from "@/models/stock";
import { formatToBRL } from "@/models/currencyFormatters";
import { Product, productInitialState } from "@/models/product";
import { selectStylesSale } from "@/models/selectStyles";
import { alertMessage } from "@/models/toast";
import { StockService } from "@/services/stockService";
import "@/styles/saleTable.css";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import Select from "react-select";
import { removeProductFromBudget } from "./PDFGenerator";

interface TableRowProps {
  rowId: number;
  products: Product[];
  rowQuantity: number[];
  totalValues: TotalValuesProps[];
  setTotalValues: Dispatch<SetStateAction<TotalValuesProps[]>>;
  updateSelectedProductIdAndRowId: (
    productId: number,
    currentRowId: number
  ) => void;
  setProducts: Dispatch<SetStateAction<Product[]>>;
  selectedProducts: SelectedProductProps[];
  setSelectedProducts: Dispatch<SetStateAction<SelectedProductProps[]>>;
  saleProductsRegisters: SelectedProductRegisterProps[];
  setSaleProductsRegisters: Dispatch<
    SetStateAction<SelectedProductRegisterProps[]>
  >;
  setSaleProductRowId: Dispatch<SetStateAction<ProductOfSaleRowIdProps[]>>;
  saleProductRowId: ProductOfSaleRowIdProps[];
}

interface SelectedOptionProps {
  label: string;
  product: Product;
}

const selectedOptionInitialState: SelectedOptionProps = {
  label: "Selecione...",
  product: productInitialState,
};

export function TableRow(props: TableRowProps) {
  const { findStockById } = StockService();

  const [previousProduct, setPreviousProduct] = useState<SelectedProductProps>({
    tableRowId: 0,
    product: productInitialState,
  });
  const [totalValue, setTotalValue] = useState<number>(0);
  const [productOfSale, setProductOfSale] = useState<ProductOfSale>(
    productOfSaleInitialState
  );
  const [selectedOption, setSelectedOption] = useState<SelectedOptionProps>(selectedOptionInitialState);
  const [selectedProductStock, setSelectedProductStock] = useState<Stock>(stockInitialState);
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (props.selectedProducts.length === 0) {
      setSelectedOption(selectedOptionInitialState);
      setProductOfSale(productOfSaleInitialState);
      setSelectedProductStock(stockInitialState);
      setActiveProducts([]);
    }
  }, [props.selectedProducts]);

  useEffect(() => {
    const fetchActiveProducts = () => {
      setActiveProducts(
        props.products.filter((p) => p.productStatus === "ACTIVE")
      );
    };
    if (props.products) {
      fetchActiveProducts();
    }
  }, [props.products]);

  useEffect(() => {
    const updateSelectedProducts = () => {
      if (props.selectedProducts.length) {
        props.selectedProducts.map((selectedProduct) => {
          if (selectedProduct.tableRowId === props.rowId) {
            if (previousProduct.product.id !== selectedOption.product.id) {
              let index = props.selectedProducts.findIndex(
                (product) =>
                  product.tableRowId === selectedProduct.tableRowId
              );
              const productToReturn = props.selectedProducts[index].product;
              if (!props.products.includes(productToReturn)) {
                props.setProducts([...props.products, productToReturn]);
              }
              const deletedProduct = props.selectedProducts.splice(index, 1)[0].product;
              removeProductFromBudget(
                props.saleProductsRegisters,
                deletedProduct
              );
            }
          }
        });
      }

      if (
        previousProduct.product === productInitialState ||
        previousProduct.product !== selectedOption.product
      ) {
        const selectedProduct: SelectedProductProps = {
          tableRowId: props.rowId,
          product: selectedOption.product,
        };

        if (!props.selectedProducts.includes(selectedProduct)) {
          props.setSelectedProducts([
            ...props.selectedProducts,
            selectedProduct,
          ]);
          setPreviousProduct(selectedProduct);
        }
      }
    };

    if (selectedOption.product.id) {
      updateSelectedProducts();
    }
  }, [props.products]);

  useEffect(() => {
    const removeSelectedProduct = () => {
      const updatedProducts = props.products.filter(
        (product) => product.id !== selectedOption.product.id
      );
      props.setProducts(updatedProducts);
    };

    if (selectedOption.product.id) {
      removeSelectedProduct();
    }
  }, [selectedOption]);

  useEffect(() => {
    if (selectedOption.product.id) {
      props.updateSelectedProductIdAndRowId(
        selectedOption.product.id,
        props.rowId
      );
    }
    const checkStock = async () => {
      const stockId = selectedOption.product.stockId;
      if (stockId) {
        const stockResponse = await findStockById(stockId);
        setSelectedProductStock(stockResponse.data);
      }
    };
    if (selectedOption.product.id) {
      checkStock();
    }
  }, [selectedOption.product.id]);

  useEffect(() => {
    const setInitialQuantity = () => {
      if (selectedOption.product.id !== 0 &&
        selectedProductStock.status !== "UNAVAILABLE") {

        setProductOfSale((prevState) => ({
          ...prevState,
          quantity: 1,
        }));
      } else {
        setProductOfSale((prevState) => ({
          ...prevState,
          quantity: 0,
        }));
        if (selectedOption.label !== "Selecione...") {
          alertMessage(`${selectedOption.label} indisponível no estoque.`);
        }
      }
    };
    setInitialQuantity();
  }, [selectedProductStock]);

  const updateTotalValue = (total: number) => {
    const newArray = props.totalValues.map((value) => {
      if (value.rowId === props.rowId) {
        return {
          ...value,
          totalValue: total,
        };
      }
      return value;
    });
    return newArray;
  };

  useEffect(() => {
    const calculation = () => {
      const total = Number(selectedOption?.product.salePrice) * productOfSale.quantity;
      setTotalValue(total);
      if (total !== 0) {
        if (props.totalValues.some((value) => value.rowId === props.rowId)) {
          const newArray = updateTotalValue(total);
          props.setTotalValues(newArray);
        } else {
          props.setTotalValues([
            ...props.totalValues,
            { totalValue: total, rowId: props.rowId },
          ]);
        }
      }
    };
    calculation();
  }, [productOfSale.quantity, selectedOption?.product.salePrice]);

  const setQuantityProp = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value);
    if (
      newValue > Number(selectedProductStock.quantity) &&
      selectedProductStock.status !== "UNAVAILABLE"
    ) {
      newValue = Number(selectedProductStock.quantity);
      if (selectedOption.label !== "Selecione...") {
        alertMessage(`Limite de estoque atingido. Máximo de ${selectedProductStock.quantity}
       unidades disponíveis para ${selectedOption.label}.`);
      }
    }
    if (selectedOption.product.id) {
      if (selectedProductStock.status !== "UNAVAILABLE") {
        setProductOfSale({
          ...productOfSale,
          quantity: newValue < 1 ? 1 : newValue,
        });
      } else {
        setProductOfSale({ ...productOfSale, quantity: 0 });
      }
    } else {
      setProductOfSale({
        ...productOfSale,
        quantity: newValue < 0 ? 0 : newValue,
      });
    }
  };

  useEffect(() => {
    const addProductsToSaleList = () => {
      const { rowId, saleProductRowId } = props;
  
      const newProductOfSale = {
        ...productOfSale,
        product: { ...productOfSale.product }
      };
  
      if (!newProductOfSale.product.id ||
        (newProductOfSale.product.id !== selectedOption.product.id)) {

        newProductOfSale.product.id = selectedOption.product.id;
        newProductOfSale.unitValue = selectedOption.product.salePrice;
        console.log("selectedOption.product.id: ", selectedOption.product.id);
      }
  
      const productIndex = saleProductRowId.findIndex(
        (item) => item.rowId === rowId
      );
  
      const newProductOfSaleRowId = [...saleProductRowId];
  
      if (productIndex !== -1) {
        newProductOfSaleRowId.splice(productIndex, 1, {
          productOfSale: newProductOfSale,
          rowId,
        });
      } else {
        if (newProductOfSale.quantity > 0) {
          newProductOfSaleRowId.push({
            productOfSale: newProductOfSale,
            rowId,
          });
        }
      }
  
      console.log("Lista atualizada: ", newProductOfSaleRowId);
      props.setSaleProductRowId(newProductOfSaleRowId);
    };
  
    addProductsToSaleList();
  }, [productOfSale, selectedOption]);

  useEffect(() => {
    props.saleProductsRegisters.forEach((productOfSale) => {
      if (selectedOption.product.id === productOfSale.productId) {
        const index = props.saleProductsRegisters.findIndex(
          (object) => object.productId === productOfSale.productId
        );
        props.saleProductsRegisters.splice(index, 1);
      }
    });

    if (selectedOption.product.id !== 0) {
      props.setSaleProductsRegisters([
        ...props.saleProductsRegisters,
        {
          productId: selectedOption.product.id,
          productName: selectedOption.label,
          quantity: productOfSale.quantity,
          unitValue: formatToBRL(selectedOption.product.salePrice),
          totalValue: formatToBRL(totalValue),
        },
      ]);
    }
  }, [totalValue]);

  return (
    <tr>
      <td id="col-NomeProduto">
        {
          <Select
            styles={selectStylesSale}
            placeholder="Selecione..."
            value={selectedOption}
            onChange={(option: any) => setSelectedOption(option)}
            options={activeProducts.map((product) => ({
                  label: product.name,
                  product: product,
                } as SelectedOptionProps)
            )}
            instanceId="select-idProduto"
            id="select-idProduto"
          />
        }
      </td>
      <td>
        <input
          value={productOfSale.quantity}
          onChange={(e) => setQuantityProp(e)}
          type="number"
          name="quantidade"
          id="input-number-tabela"
          onWheel={(e) => e.currentTarget.blur()}
        />
      </td>
      <td>{formatToBRL(Number(selectedOption.product.salePrice))}</td>
      <td>{formatToBRL(totalValue)}</td>
    </tr>
  );
}
