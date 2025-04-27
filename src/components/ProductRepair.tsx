"use client";

import SaleTable from "./SaleTable";
import { TableRow } from "./TableRow";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Product } from "@/models/product";
import {
  ProductIdAndRowId,
  SelectedProductProps,
  ProductOfSaleRowIdProps,
  SelectedProductRegisterProps,
  TotalValuesProps,
} from "@/app/(pages)/venda/cadastro/page";
import { alertMessage } from "@/models/toast";
import { formatToBRL } from "@/models/currencyFormatters";
import imgRemoveRow from "@/images/icons8-delete-row-100.png";
import imgAddRow from "@/images/icons8-insert-row-48.png";
import Image from "next/image";
import { selectionOptions } from "@/models/selectionOptions";

interface ProductRepairProps {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  allProducts: Product[];
  selectedProducts: SelectedProductProps[];
  setSelectedProducts: Dispatch<SetStateAction<SelectedProductProps[]>>;
  selectedProductIdAndRowId: ProductIdAndRowId[];
  setSelectedProductIdAndRowId: Dispatch<SetStateAction<ProductIdAndRowId[]>>;
  rowQuantity: number[];
  setRowQuantity: Dispatch<SetStateAction<number[]>>;
  totalValues: TotalValuesProps[];
  setTotalValues: Dispatch<SetStateAction<TotalValuesProps[]>>;
  setProductOfSaleRowId: Dispatch<SetStateAction<ProductOfSaleRowIdProps[]>>;
  productOfSaleRowId: ProductOfSaleRowIdProps[];
  repairPrice: number;
  setRepairPrice: Dispatch<SetStateAction<number>>;
  interestRate: number;
  setInterestRate: Dispatch<SetStateAction<number>>;
  selectedPaymentMethodOption: selectionOptions;
  setSelectedPaymentMethodOption: (
    value: SetStateAction<selectionOptions>
  ) => void;
}

export default function ProductRepair(props: ProductRepairProps) {
  const [productOfSaleRegisters, setProductOfSaleRegisters] = useState<SelectedProductRegisterProps[]>([]);
  const [totalRepairValue, setTotalRepairValue] = useState<number>(0);
  const [machineCardTonDiscountInReais, setMachineCardTonDiscountInReais] = useState<number>(0);
  const [liquidValue, setLiquidValue] = useState<number>(0);

  const updateElement = (
    index: number,
    productId: number,
    rowId: number
  ) => {
    props.setSelectedProductIdAndRowId((prevState) => {
      const newList = [...prevState];
      if (index >= 0 && index < newList.length) {
        newList[index] = { productId: productId, rowId: rowId };
      }
      return newList;
    });
  };

  const updateSelectedProductIdAndRowId = (
    productId: number,
    currentRowId: number
  ) => {
    const productIdAndRowIdIndex = props.selectedProductIdAndRowId.findIndex(
      (productIdAndRowId) => productIdAndRowId.rowId === currentRowId
    );

    if (props.selectedProductIdAndRowId[productIdAndRowIdIndex]?.rowId) {
      updateElement(productIdAndRowIdIndex, productId, currentRowId);
    } else {
      props.setSelectedProductIdAndRowId([
        ...props.selectedProductIdAndRowId,
        { productId: productId, rowId: currentRowId },
      ]);
    }
  };

  const addRow = () => {
    const activeProducts = props.allProducts.filter(
      (p) => p.productStatus === "ACTIVE"
    );
    if (props.rowQuantity.length < activeProducts.length) {
      const newId = Math.floor(Math.random() * 1000000);
      props.setRowQuantity([...props.rowQuantity, newId]);
    } else if (props.rowQuantity.length === activeProducts.length) {
      alertMessage(generateActiveProductsAlertMessage(activeProducts));
    }
  };

  const removeRow = () => {
    const newRows = [...props.rowQuantity];
    if (props.rowQuantity.length > 1) {
      newRows.pop();
      if (props.rowQuantity.length === props.selectedProductIdAndRowId.length) {
        const deletedProduct = props.selectedProductIdAndRowId.pop();
        if (deletedProduct) {
          const deletedProductInPopFunction = props.selectedProducts.filter(
            (product) => product.product.id === deletedProduct.productId
          )[0].product;

          const newTotalValues = props.totalValues.filter(
            (valor) => valor.rowId !== deletedProduct.rowId
          );
          props.setTotalValues(newTotalValues);

          const indexToRemove = props.productOfSaleRowId.findIndex(
            (item) => item.productOfSale.product.id === deletedProduct.productId
          );
          if (indexToRemove >= 0) {
            props.productOfSaleRowId.splice(indexToRemove, 1);
          }

          props.setProducts([...props.products, deletedProductInPopFunction]);
        }
      }
    }
    props.setRowQuantity(newRows);
  };

  const generateActiveProductsAlertMessage = (activeProducts: Product[]) => {
    let message = "";

    if (props.allProducts.length > 1 && activeProducts.length > 1) {
      message = `Não é possível adicionar mais linhas, pois existem  
          ${props.allProducts.length} produtos no total`;
    } else if (props.allProducts.length > 1 && activeProducts.length === 1) {
      message = `Não é possível adicionar mais linhas, pois existem  
          ${props.allProducts.length} produtos no total`;
    } else if (props.allProducts.length === 1) {
      message = `Não é possível adicionar mais linhas, pois existe  
          ${props.allProducts.length} produto no total, e ${activeProducts.length} ativo.`;
    }

    if (
      activeProducts.length < props.allProducts.length &&
      activeProducts.length > 1
    ) {
      message += `, mas apenas ${activeProducts.length} estão ativos.`;
    } else if (
      activeProducts.length < props.allProducts.length &&
      activeProducts.length == 1 &&
      props.allProducts.length > 1
    ) {
      message += `, mas apenas ${activeProducts.length} ativo.`;
    }

    return message;
  };

  useEffect(() => {
    const repairTotal = props.totalValues.reduce(
        (accumulator, value) => accumulator + value.totalValue,
        0
      ) + props.repairPrice;
    setTotalRepairValue(repairTotal);
  }, [props.totalValues, props.repairPrice]);

  useEffect(() => {
    setMachineCardTonDiscountInReais((props.interestRate / 100) * totalRepairValue);
    setLiquidValue(totalRepairValue - machineCardTonDiscountInReais);
  }, [totalRepairValue, props.interestRate, machineCardTonDiscountInReais]);

  return (
    <div className="div-form-container">
      <SaleTable>
        {props.rowQuantity.map((rowId) => {
          return (
            <TableRow
              key={rowId}
              rowId={rowId}
              products={props.products}
              rowQuantity={props.rowQuantity}
              saleProductRowId={props.productOfSaleRowId}
              setSaleProductRowId={props.setProductOfSaleRowId}
              updateSelectedProductIdAndRowId={
                updateSelectedProductIdAndRowId
              }
              totalValues={props.totalValues}
              setTotalValues={props.setTotalValues}
              setProducts={props.setProducts}
              selectedProducts={props.selectedProducts}
              setSelectedProducts={props.setSelectedProducts}
              saleProductsRegisters={productOfSaleRegisters}
              setSaleProductsRegisters={setProductOfSaleRegisters}
            />
          );
        })}
      </SaleTable>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "50vw",
        }}
      >
        <div id="valor-total-venda">
          <span>Valor Bruto</span>
          <span>{formatToBRL(totalRepairValue)}</span>
        </div>
        {props.selectedPaymentMethodOption.value ===
          "Cartão de Crédito" && (
          <>
            <div id="valor-total-venda">
              <span style={{ color: "red" }}>Desconto Ton</span>
              <span style={{ color: "red" }}>
                {formatToBRL(machineCardTonDiscountInReais)}
              </span>
            </div>
            <div id="valor-total-venda">
              <span>Valor Líquido</span>
              <span>{formatToBRL(liquidValue)}</span>
            </div>
          </>
        )}
      </div>
      <div className="div-botoes-line">
        <button onClick={addRow} className="botao-add-line">
          <Image src={imgAddRow} width={40} height={40} alt={""} />
        </button>
        <button onClick={removeRow} className="botao-remove-line">
          <Image src={imgRemoveRow} width={40} height={40} alt={""} />
        </button>
      </div>
    </div>
  );
}
