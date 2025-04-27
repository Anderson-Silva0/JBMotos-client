"use client";

import { Card } from "@/components/Card";
import { ConfirmDecision } from "@/components/ConfirmDecision";
import { DisplayError } from "@/components/DisplayError";
import { FormGroup } from "@/components/FormGroup";
import {
  PDFGenerator,
  ReceiptType,
  removeProductFromBudget,
} from "@/components/PDFGenerator";
import { TableRow } from "@/components/TableRow";
import LoadingLogo from "@/components/LoadingLogo";
import { CreditPayment } from "@/components/CreditPayment";
import SaleTable from "@/components/SaleTable";
import imgRemoverLinha from "@/images/icons8-delete-row-100.png";
import imgAdicionarLinha from "@/images/icons8-insert-row-48.png";
import { DecodedToken } from "@/middleware";
import { ProductOfSale } from "@/models/productOfSale";
import {
  selectionOptions,
  selectionOptionsInitialState,
} from "@/models/selectionOptions";
import { Customer } from "@/models/customer";
import { Errors, saveErrors } from "@/models/errors";
import { paymentMethods } from "@/models/paymentMethods";
import { formatToBRL } from "@/models/currencyFormatters";
import {
  CardPayment,
  cardPaymentInitialState,
} from "@/models/cardPayment";
import { Product } from "@/models/product";
import { selectStyles } from "@/models/selectStyles";
import { alertMessage, errorMessage, successMessage } from "@/models/toast";
import { Sale, SaleInitialState } from "@/models/sale";
import { SaleService } from "@/services/saleService";
import { CustomerService } from "@/services/customerService";
import { ProductService } from "@/services/productService";
import Cookies from "js-cookie";
import { decode } from "jsonwebtoken";
import { Save } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Select from "react-select";

export interface SelectedProductRegisterProps {
  productId: number;
  productName: string;
  quantity: number;
  unitValue: string;
  totalValue: string;
}

export interface SelectedProductProps {
  tableRowId: number;
  product: Product;
}

export interface ProductIdAndRowId {
  productId: number;
  rowId: number;
}

export interface TotalValuesProps {
  totalValue: number;
  rowId: number;
}

export interface ProductOfSaleRowIdProps {
  productOfSale: ProductOfSale;
  rowId: number;
}

export default function RegisterSale() {
  const { findAllCustomer } = CustomerService();
  const { findAllProduct } = ProductService();
  const { saveSale } = SaleService();

  const [userName, setUserName] = useState<string>("");
  const [userCpf, setUserCpf] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("login-token");
    if (token) {
      const decodedToken = decode(token) as DecodedToken;
      setUserName(decodedToken.userName);
      setUserCpf(decodedToken.userCpf);
    }
  }, []);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [productsOfSaleRegisters, setProductsOfSaleRegisters] = useState<SelectedProductRegisterProps[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProductProps[]>([]);
  const [errors, setErrors] = useState<Errors[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [sale, setSale] = useState<Sale>(SaleInitialState);
  const [rowQuantity, setRowQuantity] = useState<number[]>([1]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalValues, setTotalValues] = useState<TotalValuesProps[]>([]);
  const [selectedProductIdRowId, setSelectedProductIdRowId] = useState<ProductIdAndRowId[]>([]);
  const [cardPayment, setCardPayment] = useState<CardPayment>(cardPaymentInitialState);
  const [selectedInstallmentOption, setSelectedInstallmentOption] = useState<selectionOptions>(selectionOptionsInitialState);
  const [selectedCardFlagOption, setSelectedCardFlagOption] = useState<selectionOptions>(selectionOptionsInitialState);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [machineCardTonDiscountInReais, setMachineCardTonDiscountInReais] = useState<number | string>(0);
  const [liquidValue, setLiquidValue] = useState<number | string>(0);
  const [productsOfSaleRowId, setProductsOfSaleRowId] = useState<ProductOfSaleRowIdProps[]>([]);
  const [totalSaleValue, setTotalSaleValue] = useState<number>(0);

  const [selectedCustomerOption, setSelectedCustomerOption] = useState<selectionOptions>(selectionOptionsInitialState);

  const [
    selectedPaymentMethodOption,
    setSelectedPaymentMethodOption,
  ] = useState<selectionOptions>(selectionOptionsInitialState);

  const setSaleSelectionInitialState = () => {
    setSelectedCustomerOption(selectionOptionsInitialState);
    setSelectedPaymentMethodOption(selectionOptionsInitialState);
    setSale({ ...sale, observation: "" });
  };

  const findAll = async () => {
    try {
      const allCustomersResponse = await findAllCustomer();
      const allCustomers = allCustomersResponse.data;
      const activeCustomers = allCustomers.filter(
        (c: Customer) => c.customerStatus === "ACTIVE"
      );
      setCustomers(activeCustomers);

      const allProductsResponse = await findAllProduct();
      setProducts(allProductsResponse.data);
      setAllProducts(allProductsResponse.data);
    } catch (erro: any) {
      errorMessage(erro.response.data);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    findAll();
  }, []);

  useEffect(() => {
    setSale({
      ...sale,
      customer: {
        ...sale.customer,
        cpf: String(selectedCustomerOption?.value),
      },
      employee: { ...sale.employee, cpf: userCpf },
      paymentMethod: String(selectedPaymentMethodOption?.value),
    });
    setErrors([]);
  }, [selectedCustomerOption, selectedPaymentMethodOption]);

  const setCardPaymentInitialState = () => {
    setCardPayment(cardPaymentInitialState);
    setSelectedInstallmentOption(selectionOptionsInitialState);
    setSelectedCardFlagOption(selectionOptionsInitialState);
    setInterestRate(0);
  };

  const clearAllAfterSale = () => {
    setCardPaymentInitialState();
    setSelectedProductIdRowId([]);
    setSaleSelectionInitialState();
    setSale(SaleInitialState);
    setSelectedProducts([]);
    setTotalValues([]);
    setRowQuantity([1]);
    setProductsOfSaleRowId([]);
    findAll();
    setErrors([]);
  };

  const submit = async () => {
    if (selectedProducts.length) {
      try {
        const productsOfSale = productsOfSaleRowId.map((item) => {
          const saleProducts = { ...item.productOfSale };
          saleProducts.product = { ...saleProducts.product };
          saleProducts.product.id = saleProducts.product.id;

          return saleProducts;
        });

        if (selectedPaymentMethodOption.value === "Cartão de Crédito") {
          await saveSale({ ...sale, productsOfSale: productsOfSale, cardPayment: cardPayment });
        } else {
          await saveSale({ ...sale, productsOfSale: productsOfSale });
        }

        successMessage("Venda realizada com sucesso!");
        clearAllAfterSale();
      } catch (error: any) {
        saveErrors(error, errors, setErrors);
        errorMessage("Erro no preenchimento dos campos.");
      }
    } else {
      alertMessage("Selecione algum produto.");
    }
  };

  useEffect(() => {
    const setCardPaymentMethod = () => {
      if (selectedPaymentMethodOption.label === "Cartão de Crédito") {
        if (selectedInstallmentOption.value || selectedCardFlagOption.value || interestRate) {
          setCardPayment({
            installment: selectedInstallmentOption.value,
            flag: selectedCardFlagOption.value,
            interestRate: interestRate,
            saleId: 0,
          });
        }
      } else {
        setCardPayment(cardPaymentInitialState);
        setSelectedInstallmentOption(selectionOptionsInitialState);
        setSelectedCardFlagOption(selectionOptionsInitialState);
        setInterestRate(0);
      }

      setErrors([]);
    };

    setCardPaymentMethod();
  }, [
    selectedInstallmentOption,
    selectedCardFlagOption,
    interestRate,
    selectedPaymentMethodOption,
  ]);

  const handlePerformSale = () => {
    ConfirmDecision(
      "Confirmação de Venda",
      "Tem certeza de que deseja realizar esta venda?",
      submit
    );
  };

  const generateActiveProductsAlertMessage = (activeProducts: Product[]) => {
    let message = "";

    if (allProducts.length > 1 && activeProducts.length > 1) {
      message = `Não é possível adicionar mais linhas, pois existem  
          ${allProducts.length} produtos no total`;
    } else if (allProducts.length > 1 && activeProducts.length === 1) {
      message = `Não é possível adicionar mais linhas, pois existem  
          ${allProducts.length} produtos no total`;
    } else if (allProducts.length === 1) {
      message = `Não é possível adicionar mais linhas, pois existe  
          ${allProducts.length} produto no total, e ${activeProducts.length} ativo.`;
    }

    if (
      activeProducts.length < allProducts.length &&
      activeProducts.length > 1
    ) {
      message += `, mas apenas ${activeProducts.length} estão ativos.`;
    } else if (
      activeProducts.length < allProducts.length &&
      activeProducts.length == 1 &&
      allProducts.length > 1
    ) {
      message += `, mas apenas ${activeProducts.length} ativo.`;
    }

    return message;
  };

  const addRow = () => {
    const activeProducts = allProducts.filter(
      (p) => p.productStatus === "ACTIVE"
    );
    if (rowQuantity.length < activeProducts.length) {
      const newId = Math.floor(Math.random() * 1000000);
      setRowQuantity([...rowQuantity, newId]);
    } else if (rowQuantity.length === activeProducts.length) {
      alertMessage(generateActiveProductsAlertMessage(activeProducts));
    }
  };

  const removeRow = () => {
    const newRows = [...rowQuantity];
    if (rowQuantity.length > 1) {
      newRows.pop();
      if (rowQuantity.length === selectedProductIdRowId.length) {
        const deletedProduct = selectedProductIdRowId.pop();
        if (deletedProduct) {
          const deletedProductInPopFunction = selectedProducts.filter(
            (produto) => produto.product.id === deletedProduct.productId
          )[0].product;

          const newTotalValues = totalValues.filter(
            (valor) => valor.rowId !== deletedProduct.rowId
          );
          setTotalValues(newTotalValues);

          const indexToRemove = productsOfSaleRowId.findIndex(
            (item) => item.productOfSale.product.id === deletedProduct.productId
          );
          if (indexToRemove >= 0) {
            productsOfSaleRowId.splice(indexToRemove, 1);
          }

          setProducts([...products, deletedProductInPopFunction]);
        }
      }
    }
    setRowQuantity(newRows);
  };

  const updateElement = (
    index: number,
    productId: number,
    rowId: number
  ) => {
    setSelectedProductIdRowId((prevState) => {
      const newList = [...prevState];
      if (index >= 0 && index < newList.length) {
        newList[index] = { productId: productId, rowId: rowId };
      }
      return newList;
    });
  };

  const updateSelectedProductIdRowId = (
    productId: number,
    currentRowId: number
  ) => {
    const productIdRowIdIndex = selectedProductIdRowId.findIndex(
      (productIdRowId) => productIdRowId.rowId === currentRowId
    );

    if (selectedProductIdRowId[productIdRowIdIndex]?.rowId) {
      updateElement(productIdRowIdIndex, productId, currentRowId);
    } else {
      setSelectedProductIdRowId([
        ...selectedProductIdRowId,
        { productId: productId, rowId: currentRowId },
      ]);
    }
  };

  useEffect(() => {
    const totalSale = totalValues.reduce(
      (acumulador, valor) => acumulador + valor.totalValue,
      0
    );
    setTotalSaleValue(totalSale);
  }, [totalValues]);

  useEffect(() => {
    setMachineCardTonDiscountInReais((Number(interestRate) / 100) * totalSaleValue);
    setLiquidValue(totalSaleValue - Number(machineCardTonDiscountInReais));
  }, [totalSaleValue, interestRate, machineCardTonDiscountInReais]);

  const getSelectedCustomerName = () => {
    let selectedCustomerName = "";
    customers.forEach((customer) => {
      if (customer.cpf === selectedCustomerOption.value) {
        selectedCustomerName = customer.name;
      }
    });
    return selectedCustomerName;
  };

  if (!isLoaded) {
    return <LoadingLogo description="Carregando" />;
  }

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Save size="6vh" strokeWidth={3} /> Registro de Venda
      </h1>
      <Card title="Detalhes da Venda">
        <FormGroup label="Selecione o Cliente: *" htmlFor="customerCpf">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={selectedCustomerOption}
            onChange={(option: any) => setSelectedCustomerOption(option)}
            options={
              customers.map((customer) => {
                const namesList = customer.name.split(" ");
                if (namesList && namesList.length > 0) {
                  const firstName = namesList[0];
                  return { label: `${firstName} • ${customer.cpf}`, value: customer.cpf } as selectionOptions;
                }
              })
            }
            instanceId="select-cpfCliente"
          />
          {<DisplayError errors={errors} inputName="cpf" />}
        </FormGroup>
        <FormGroup
          label="Selecione a forma de pagamento*"
          htmlFor="paymentMethod"
        >
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={selectedPaymentMethodOption}
            onChange={(option: any) =>
              setSelectedPaymentMethodOption(option)
            }
            options={paymentMethods}
            instanceId="select-formaDePagamento"
          />
          {<DisplayError errors={errors} inputName="paymentMethod" />}
          {selectedPaymentMethodOption.value === "Cartão de Crédito" && (
            <CreditPayment
              errors={errors}
              interestRate={interestRate}
              setInterestRate={setInterestRate}
              selectedCardFlagOption={selectedCardFlagOption}
              setSelectedCardFlagOption={setSelectedCardFlagOption}
              selectedInstallmentOption={selectedInstallmentOption}
              setSelectedInstallmentOption={setSelectedInstallmentOption}
            />
          )}
        </FormGroup>
        <FormGroup label="Observação:" htmlFor="observation">
          <input
            maxLength={100}
            value={sale.observation}
            onChange={(e) => {
              setErrors([]);
              setSale({ ...sale, observation: e.target.value });
            }}
            id="observacao"
            type="text"
          />
          {<DisplayError errors={errors} inputName="observation" />}
        </FormGroup>
      </Card>
      <SaleTable>
        {rowQuantity.map((idLinha) => {
          return (
            <TableRow
              key={idLinha}
              rowId={idLinha}
              products={products}
              rowQuantity={rowQuantity}
              updateSelectedProductIdAndRowId={updateSelectedProductIdRowId}
              totalValues={totalValues}
              setTotalValues={setTotalValues}
              setProducts={setProducts}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              saleProductsRegisters={productsOfSaleRegisters}
              setSaleProductsRegisters={setProductsOfSaleRegisters}
              setSaleProductRowId={setProductsOfSaleRowId}
              saleProductRowId={productsOfSaleRowId}
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
          <span>{formatToBRL(totalSaleValue)}</span>
        </div>
        {selectedPaymentMethodOption.value === "Cartão de Crédito" && (
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
          <Image src={imgAdicionarLinha} width={40} height={40} alt={""} />
        </button>
        <button onClick={removeRow} className="botao-remove-line">
          <Image src={imgRemoverLinha} width={40} height={40} alt={""} />
        </button>
      </div>
      <div className="divBotaoCadastrar">
        <button onClick={handlePerformSale} type="submit">
          Realizar Venda
        </button>
        <PDFGenerator
          receiptType={ReceiptType.Budget}
          customerName={getSelectedCustomerName()}
          customerCpf={selectedCustomerOption.value}
          paymentMethod={selectedPaymentMethodOption.value}
          employeeName={userName}
          observation={sale.observation}
          productOfSaleRegister={productsOfSaleRegisters}
          totalSaleValue={formatToBRL(totalSaleValue)}
        />
      </div>
    </div>
  );
}
