"use client";

import {
  ProductIdAndRowId,
  SelectedProductProps,
  ProductOfSaleRowIdProps,
  TotalValuesProps,
} from "@/app/(pages)/venda/cadastro/page";
import { Card } from "@/components/Card";
import { DisplayError } from "@/components/ExibeErro";
import { FormGroup } from "@/components/Form-group";
import { CreditPayment } from "@/components/PagamentoCredito";
import ProductRepair from "@/components/ProdutoServico";
import {
  selectionOptions,
  selectionOptionsInitialState,
} from "@/models/Selecoes";
import { Customer } from "@/models/cliente";
import { Errors, saveErrors } from "@/models/erros";
import { paymentMethods } from "@/models/formasPagamento";
import { formatToBRL } from "@/models/formatadorReal";
import { motorcycleInitialState, Motorcycle } from "@/models/moto";
import {
  CardPayment,
  cardPaymentInitialState,
} from "@/models/pagamentoCartao";
import { Product } from "@/models/produto";
import { selectStyles } from "@/models/selectStyles";
import { Repair, repairInitialState } from "@/models/servico";
import { alertMessage, errorMessage, successMessage } from "@/models/toast";
import { Sale, SaleInitialState } from "@/models/venda";
import { CustomerService } from "@/services/clienteService";
import { MotorcycleService } from "@/services/motoService";
import { ProductService } from "@/services/produtoService";
import { RepairService } from "@/services/servicoService";
import { Save } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import imgAddProduct from "@/images/icons8-add-product-66.png";
import imgRemoveProduct from "@/images/icons8-remove-product-64.png";
import Cookies from "js-cookie";
import { decode } from "jsonwebtoken";
import Select from "react-select";
import { DecodedToken } from "@/middleware";
import { confirmDecision } from "@/components/ConfirmarDecisao";
import LoadingLogo from "@/components/LoadingLogo";
import { Employee } from "@/models/funcionario";

export default function CadastroServico() {
  const { findAllCustomer } = CustomerService();
  const { findMotorcycleByCustomerCpf } = MotorcycleService();
  const { saveRepair } = RepairService();
  const { findAllProduct } = ProductService();

  const [userCpf, setUserCpf] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("login-token");
    if (token) {
      const decodedToken = decode(token) as DecodedToken;
      setUserCpf(decodedToken.userCpf);
    }
  }, []);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [repair, setRepair] = useState<Repair>(repairInitialState);
  const [customerMotorcycles, setCustomerMotorcycles] = useState<Motorcycle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [errors, setErrors] = useState<Errors[]>([]);
  const [productAddition, setProductAddition] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [sale, setSale] = useState<Sale>(SaleInitialState);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProductProps[]>([]);
  const [cardPayment, setCardPayment] = useState<CardPayment>(cardPaymentInitialState);
  const [selectedInstallmentOption, setSelectedInstallmentOption] = useState<selectionOptions>(selectionOptionsInitialState);
  const [selectedCardFlagOption, setSelectedCardFlagOption] = useState<selectionOptions>(selectionOptionsInitialState);
  const [selectedProductIdRowId, setSelectedProductIdRowId] = useState<ProductIdAndRowId[]>([]);
  const [repairPrice, setRepairPrice] = useState<number>(0);
  const [totalValues, setTotalValues] = useState<TotalValuesProps[]>([]);
  const [rowQuantity, setRowQuantity] = useState<number[]>([1]);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [productsOfSaleRowId, setProductsOfSaleRowId] = useState<ProductOfSaleRowIdProps[]>([]);

  const [selectedClientOption, setSelectedCustomerOption] = useState<selectionOptions>(selectionOptionsInitialState);

  const [selectedMotorcycleOption, setSelectedMotorcycleOption] = useState<selectionOptions>(selectionOptionsInitialState);

  const [
    selectedPaymentMethodOption,
    setSelectedPaymentMethodOption,
  ] = useState<selectionOptions>(selectionOptionsInitialState);

  const setProductMoneyProps = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/\D/g, "")) / 100;
    const limitedValue = Math.min(value, 100000);
    setRepair({ ...repair, [key]: limitedValue });
    setRepairPrice(limitedValue);
    setErrors([]);
  };

  const findAll = async () => {
    try {
      const allCustomersResponse = await findAllCustomer();
      const allCustomers = allCustomersResponse.data;
      const activeCustomers = allCustomers.filter((c: Customer) => 
        c.customerStatus === "ATIVO"
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
    const fetchCustomerMotorcycles = async () => {
      try {
        const customerMotorcyclesResponse = await findMotorcycleByCustomerCpf(
          String(selectedClientOption.value)
        );
        const customerMotorcycles = customerMotorcyclesResponse.data;
        const activeCustomerMotorcycles = customerMotorcycles.filter((m: Motorcycle) =>
          m.motorcycleStatus === "ATIVO"
        );
        setCustomerMotorcycles(activeCustomerMotorcycles);

        if (selectedMotorcycleOption.value) {
          setSelectedMotorcycleOption(selectionOptionsInitialState);
        }
      } catch (error: any) {
        errorMessage(error.response.data.error);
        setCustomerMotorcycles([]);
        setSelectedMotorcycleOption(selectionOptionsInitialState);
      }
    };
    if (selectedClientOption.value) {
      fetchCustomerMotorcycles();
    }
  }, [selectedClientOption]);

  useEffect(() => {
    let motorcycleResult = motorcycleInitialState;
    motorcycleResult.id = Number(selectedMotorcycleOption.value);
    setRepair({
      ...repair,
      employeeCpf: userCpf,
      motorcycle: motorcycleResult,
    });
    setSale({
      ...sale,
      employee: {cpf: userCpf} as Employee,
      customer: {cpf: String(selectedClientOption.value)} as Customer,
      paymentMethod: String(selectedPaymentMethodOption.value),
    });
    setErrors([]);
  }, [
    selectedClientOption,
    selectedPaymentMethodOption,
    selectedMotorcycleOption,
  ]);

  useEffect(() => {
    const setCardPaymentMethod = () => {
      if (selectedPaymentMethodOption.label === "Cartão de Crédito") {
        if (
          selectedInstallmentOption.value ||
          selectedCardFlagOption.value ||
          interestRate
        ) {
          setCardPayment({
            installment: selectedInstallmentOption.value,
            flag: selectedCardFlagOption.value,
            totalFees: interestRate,
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

  const setCardPaymentInitialState = () => {
    setCardPayment(cardPaymentInitialState);
    setSelectedInstallmentOption(selectionOptionsInitialState);
    setSelectedCardFlagOption(selectionOptionsInitialState);
    setInterestRate(0);
  };

  const setSaleSelectionInitialState = () => {
    setSelectedPaymentMethodOption(selectionOptionsInitialState);
    setSale({ ...sale, observation: "" });
  };

  const resetSale = () => {
    setProductAddition(false);
    setCardPaymentInitialState();
    setSelectedProductIdRowId([]);
    setSaleSelectionInitialState();
    setSale(SaleInitialState);
    setSelectedProducts([]);
    setTotalValues([]);
    setRepairPrice(0);
    setRowQuantity([1]);
    findAll();
    setErrors([]);
  };

  const resetRepair = () => {
    setRepair(repairInitialState);
    setErrors([]);
    setSelectedCustomerOption(selectionOptionsInitialState);
    setSelectedMotorcycleOption(selectionOptionsInitialState);
    setProductAddition(false);
  };

  const submit = async () => {
    try {
      const productsOfSale = productsOfSaleRowId.map(
        (item) => item.productOfSale
      );

      if (productAddition) {
        if (selectedProducts.length) {
          if (sale.paymentMethod === "Cartão de Crédito") {
            await saveRepair({
              ...repair,
              sale: {
                ...sale,
                cardPayment: cardPayment,
                productsOfSale: productsOfSale,
                observation: "Venda de Serviço",
              },
            });
          } else {
            await saveRepair({
              ...repair,
              sale: {
                ...sale,
                productsOfSale: productsOfSale,
                observation: "Venda de Serviço",
              },
            });
          }
          resetRepair();
          resetSale();
          successMessage("Serviço cadastrado com sucesso!");
        } else {
          alertMessage("Selecione algum produto.");
        }
      } else {
        await saveRepair({ ...repair });
        successMessage("Serviço cadastrado com sucesso!");
        resetRepair();
        resetSale();
      }
    } catch (error) {
      errorMessage("Erro no preenchimento dos campos");
      showCustomerFieldError();
      saveErrors(error, errors, setErrors);
    }
  };

  const handlePerformRepair = () => {
    confirmDecision(
      "Confirmação de Serviço",
      "Tem certeza de que deseja realizar este serviço?",
      submit
    );
  };

  const showCustomerFieldError = () => {
    if (!selectedClientOption.value) {
      setErrors([
        ...errors,
        {
          inputName: "cpfCliente",
          errorMessage: "O campo CPF do Cliente é obrigatório.",
        },
      ]);
    }
  };

  const productAdditionStateToggle = () => {
    if (productAddition) {
      setProductAddition(false);
      resetSale();
      setTotalValues([]);
    } else {
      setProductAddition(true);
      setRepairPrice(repair.laborCost);
    }
  };

  if (!isLoaded) {
    return <LoadingLogo description="Carregando" />;
  }

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Save size="6vh" strokeWidth={3} /> Cadastro de Serviço
      </h1>
      <Card title="Dados do Serviço">
        <FormGroup label="Selecione o Cliente*" htmlFor="cpfCliente">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={selectedClientOption}
            onChange={(option: any) => setSelectedCustomerOption(option)}
            options={customers.map(
              (c) => ({ label: c.cpf, value: c.cpf } as selectionOptions)
            )}
            instanceId="select-cpfCliente"
          />
          {<DisplayError errors={errors} inputName="cpfCliente" />}
        </FormGroup>

        <FormGroup label="Selecione a Moto*" htmlFor="moto">
          <Select
            isDisabled={!customerMotorcycles.length}
            styles={selectStyles}
            placeholder="Selecione..."
            value={selectedMotorcycleOption}
            onChange={(option: any) => setSelectedMotorcycleOption(option)}
            options={customerMotorcycles.map(
              (m) =>
                ({
                  label: `${m.brand} ${m.model} - [ ${m.plate} ]`,
                  value: m.id,
                } as selectionOptions)
            )}
            instanceId="select-idMoto"
          />
          {<DisplayError errors={errors} inputName="idMoto" />}
        </FormGroup>

        <FormGroup label="Serviços Realizados: *" htmlFor="servicosRealizados">
          <textarea
            value={repair.repairPerformed}
            onChange={(e) => {
              setErrors([]);
              setRepair({ ...repair, repairPerformed: e.target.value });
            }}
            id="servicosRealizados"
          />
          {<DisplayError errors={errors} inputName="servicosRealizados" />}
        </FormGroup>

        <FormGroup label="Observação: *" htmlFor="observacao">
          <input
            value={repair.observation}
            onChange={(e) => {
              setErrors([]);
              setRepair({ ...repair, observation: e.target.value });
            }}
            id="observacao"
            type="text"
          />
          {<DisplayError errors={errors} inputName="observacao" />}
        </FormGroup>

        <FormGroup label="Preço de Mão de Obra: *" htmlFor="precoMaoDeObra">
          <input
            value={formatToBRL(repair.laborCost)}
            onChange={(e) => setProductMoneyProps("precoMaoDeObra", e)}
            id="precoMaoDeObra"
            type="text"
          />
          {<DisplayError errors={errors} inputName="precoMaoDeObra" />}
        </FormGroup>
        {productAddition && (
          <FormGroup
            label="Selecione a forma de pagamento*"
            htmlFor="formaDePagamento"
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
            {<DisplayError errors={errors} inputName="formaDePagamento" />}
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
        )}
      </Card>

      {productAddition ? (
        <button
          onClick={productAdditionStateToggle}
          title="Remover Produto"
          style={{ cursor: "pointer", border: "none", margin: "2vw" }}
        >
          <Image src={imgRemoveProduct} width={70} height={65} alt="" />
        </button>
      ) : (
        <button
          onClick={productAdditionStateToggle}
          title="Adicionar Produto"
          style={{ cursor: "pointer", border: "none", margin: "2vw 0 1vw 0" }}
        >
          <Image src={imgAddProduct} width={70} height={60} alt="" />
        </button>
      )}

      {productAddition && (
        <ProductRepair
          products={products}
          setProducts={setProducts}
          allProducts={allProducts}
          rowQuantity={rowQuantity}
          setRowQuantity={setRowQuantity}
          repairPrice={repairPrice}
          setRepairPrice={setRepairPrice}
          totalValues={totalValues}
          setTotalValues={setTotalValues}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          selectedProductIdAndRowId={selectedProductIdRowId}
          setSelectedProductIdAndRowId={setSelectedProductIdRowId}
          productOfSaleRowId={productsOfSaleRowId}
          setProductOfSaleRowId={setProductsOfSaleRowId}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          selectedPaymentMethodOption={selectedPaymentMethodOption}
          setSelectedPaymentMethodOption={
            setSelectedPaymentMethodOption
          }
        />
      )}

      <div className="divBotaoCadastrar">
        <button onClick={handlePerformRepair} type="submit">
          Realizar Serviço
        </button>
      </div>
    </div>
  );
}
