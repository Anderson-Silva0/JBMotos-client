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
import imgAddProduto from "@/images/icons8-add-product-66.png";
import imgARemoveProduto from "@/images/icons8-remove-product-64.png";
import Cookies from "js-cookie";
import { decode } from "jsonwebtoken";
import Select from "react-select";
import { DecodedToken } from "@/middleware";
import { confirmDecision } from "@/components/ConfirmarDecisao";
import LoadingLogo from "@/components/LoadingLogo";

export default function CadastroServico() {
  const { findAllCustomer } = CustomerService();
  const { findMotorcycleByCustomerCpf } = MotorcycleService();
  const { saveRepair: salvarServico } = RepairService();
  const { findAllProduct: buscarTodosProdutos } = ProductRepair();

  const [cpfUser, setCpfUser] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("login-token");
    if (token) {
      const decodedToken = decode(token) as DecodedToken;
      setCpfUser(decodedToken.userCpf);
    }
  }, []);

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false);
  const [servico, setServico] = useState<Repair>(repairInitialState);
  const [motosCliente, setMotosCliente] = useState<Motorcycle[]>([]);
  const [clientes, setClientes] = useState<Customer[]>([]);
  const [erros, setErros] = useState<Errors[]>([]);
  const [adicaoProduto, setAdicaoProduto] = useState<boolean>(false);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [todosProdutos, setTodosProdutos] = useState<Product[]>([]);
  const [venda, setVenda] = useState<Sale>(SaleInitialState);
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    SelectedProductProps[]
  >([]);
  const [pagamentoCartao, setPagamentoCartao] = useState<CardPayment>(
    cardPaymentInitialState
  );
  const [opcaoSelecionadaParcela, setOpcaoSelecionadaParcela] =
    useState<selectionOptions>(selectionOptionsInitialState);
  const [opcaoSelecionadaBandeira, setOpcaoSelecionadaBandeira] =
    useState<selectionOptions>(selectionOptionsInitialState);
  const [idProdutoIdLinhaSelecionado, setIdProdutoIdLinhaSelecionado] =
    useState<ProductIdAndRowId[]>([]);
  const [precoServico, setPrecoServico] = useState<number>(0);
  const [valoresTotais, setValoresTotais] = useState<TotalValuesProps[]>([]);
  const [qtdLinha, setQtdLinha] = useState<number[]>([1]);
  const [taxaJuros, setTaxaJuros] = useState<number>(0);
  const [produtosVendaIdLinha, setProdutoVendaIdLinha] = useState<
    ProductOfSaleRowIdProps[]
  >([]);

  const [opcaoSelecionadaCliente, setOpcaoSelecionadaCliente] =
    useState<selectionOptions>(selectionOptionsInitialState);

  const [opcaoSelecionadaMoto, setOpcaoSelecionadaMoto] =
    useState<selectionOptions>(selectionOptionsInitialState);

  const [
    opcaoSelecionadaFormaDePagamento,
    setOpcaoSelecionadaFormaDePagamento,
  ] = useState<selectionOptions>(selectionOptionsInitialState);

  const setPropsProdutoMoney = (
    key: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value.replace(/\D/g, "")) / 100;
    const limitedValue = Math.min(value, 100000);
    setServico({ ...servico, [key]: limitedValue });
    setPrecoServico(limitedValue);
    setErros([]);
  };

  const buscarTodos = async () => {
    try {
      const todosClientesResponse = await findAllCustomer();
      const todosClientes = todosClientesResponse.data;
      const clientesAtivos = todosClientes.filter(
        (c: Customer) => c.customerStatus === "ATIVO"
      );
      setClientes(clientesAtivos);

      const todosProdutosResponse = await buscarTodosProdutos();
      setProdutos(todosProdutosResponse.data);
      setTodosProdutos(todosProdutosResponse.data);
    } catch (erro: any) {
      errorMessage(erro.response.data);
    } finally {
      setFoiCarregado(true);
    }
  };

  useEffect(() => {
    buscarTodos();
  }, []);

  useEffect(() => {
    const buscarMotosCliente = async () => {
      try {
        const motosClienteResponse = await findMotorcycleByCustomerCpf(
          String(opcaoSelecionadaCliente.value)
        );
        const motosCliente = motosClienteResponse.data;
        const motosClienteAtivas = motosCliente.filter(
          (m: Motorcycle) => m.motorcycleStatus === "ATIVO"
        );
        setMotosCliente(motosClienteAtivas);

        if (opcaoSelecionadaMoto.value) {
          setOpcaoSelecionadaMoto(selectionOptionsInitialState);
        }
      } catch (error: any) {
        errorMessage(error.response.data.error);
        setMotosCliente([]);
        setOpcaoSelecionadaMoto(selectionOptionsInitialState);
      }
    };
    if (opcaoSelecionadaCliente.value) {
      buscarMotosCliente();
    }
  }, [opcaoSelecionadaCliente]);

  useEffect(() => {
    let motoResult = motorcycleInitialState;
    motoResult.id = Number(opcaoSelecionadaMoto.value);
    setServico({
      ...servico,
      employeeCpf: cpfUser,
      motorcycle: motoResult,
    });
    setVenda({
      ...venda,
      cpfFuncionario: cpfUser,
      cpfCliente: String(opcaoSelecionadaCliente.value),
      paymentMethod: String(opcaoSelecionadaFormaDePagamento.value),
    });
    setErros([]);
  }, [
    opcaoSelecionadaCliente,
    opcaoSelecionadaFormaDePagamento,
    opcaoSelecionadaMoto,
  ]);

  useEffect(() => {
    const definirPagamentoCartao = () => {
      if (opcaoSelecionadaFormaDePagamento.label === "Cartão de Crédito") {
        if (
          opcaoSelecionadaParcela.value ||
          opcaoSelecionadaBandeira.value ||
          taxaJuros
        ) {
          setPagamentoCartao({
            installment: opcaoSelecionadaParcela.value,
            flag: opcaoSelecionadaBandeira.value,
            totalFees: taxaJuros,
            saleId: 0,
          });
        }
      } else {
        setPagamentoCartao(cardPaymentInitialState);
        setOpcaoSelecionadaParcela(selectionOptionsInitialState);
        setOpcaoSelecionadaBandeira(selectionOptionsInitialState);
        setTaxaJuros(0);
      }

      setErros([]);
    };

    definirPagamentoCartao();
  }, [
    opcaoSelecionadaParcela,
    opcaoSelecionadaBandeira,
    taxaJuros,
    opcaoSelecionadaFormaDePagamento,
  ]);

  const definirEstadoInicialPagamentoCartao = () => {
    setPagamentoCartao(cardPaymentInitialState);
    setOpcaoSelecionadaParcela(selectionOptionsInitialState);
    setOpcaoSelecionadaBandeira(selectionOptionsInitialState);
    setTaxaJuros(0);
  };

  const definirEstadoInicialSelecaoVenda = () => {
    setOpcaoSelecionadaFormaDePagamento(selectionOptionsInitialState);
    setVenda({ ...venda, observation: "" });
  };

  const resetarVenda = () => {
    setAdicaoProduto(false);
    definirEstadoInicialPagamentoCartao();
    setIdProdutoIdLinhaSelecionado([]);
    definirEstadoInicialSelecaoVenda();
    setVenda(SaleInitialState);
    setProdutosSelecionados([]);
    setValoresTotais([]);
    setPrecoServico(0);
    setQtdLinha([1]);
    buscarTodos();
    setErros([]);
  };

  const resetarServico = () => {
    setServico(repairInitialState);
    setErros([]);
    setOpcaoSelecionadaCliente(selectionOptionsInitialState);
    setOpcaoSelecionadaMoto(selectionOptionsInitialState);
    setAdicaoProduto(false);
  };

  const submit = async () => {
    try {
      const produtosVenda = produtosVendaIdLinha.map(
        (item) => item.productOfSale
      );

      if (adicaoProduto) {
        if (produtosSelecionados.length) {
          if (venda.paymentMethod === "Cartão de Crédito") {
            await salvarServico({
              ...servico,
              sale: {
                ...venda,
                cardPayment: pagamentoCartao,
                productsOfSale: produtosVenda,
                observation: "Venda de Serviço",
              },
            });
          } else {
            await salvarServico({
              ...servico,
              sale: {
                ...venda,
                productsOfSale: produtosVenda,
                observation: "Venda de Serviço",
              },
            });
          }
          resetarServico();
          resetarVenda();
          successMessage("Serviço cadastrado com sucesso!");
        } else {
          alertMessage("Selecione algum produto.");
        }
      } else {
        await salvarServico({ ...servico });
        successMessage("Serviço cadastrado com sucesso!");
        resetarServico();
        resetarVenda();
      }
    } catch (error) {
      errorMessage("Erro no preenchimento dos campos");
      exibeErroCampoCliente();
      saveErrors(error, erros, setErros);
    }
  };

  const handlerRealizarServico = () => {
    confirmDecision(
      "Confirmação de Serviço",
      "Tem certeza de que deseja realizar este serviço?",
      submit
    );
  };

  const exibeErroCampoCliente = () => {
    if (!opcaoSelecionadaCliente.value) {
      setErros([
        ...erros,
        {
          inputName: "cpfCliente",
          errorMessage: "O campo CPF do Cliente é obrigatório.",
        },
      ]);
    }
  };

  const alternarEstadoAdicaoProduto = () => {
    if (adicaoProduto) {
      setAdicaoProduto(false);
      resetarVenda();
      setValoresTotais([]);
    } else {
      setAdicaoProduto(true);
      setPrecoServico(servico.laborCost);
    }
  };

  if (!foiCarregado) {
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
            value={opcaoSelecionadaCliente}
            onChange={(option: any) => setOpcaoSelecionadaCliente(option)}
            options={clientes.map(
              (c) => ({ label: c.cpf, value: c.cpf } as selectionOptions)
            )}
            instanceId="select-cpfCliente"
          />
          {<DisplayError errors={erros} inputName="cpfCliente" />}
        </FormGroup>

        <FormGroup label="Selecione a Moto*" htmlFor="moto">
          <Select
            isDisabled={!motosCliente.length}
            styles={selectStyles}
            placeholder="Selecione..."
            value={opcaoSelecionadaMoto}
            onChange={(option: any) => setOpcaoSelecionadaMoto(option)}
            options={motosCliente.map(
              (m) =>
                ({
                  label: `${m.brand} ${m.model} - [ ${m.plate} ]`,
                  value: m.id,
                } as selectionOptions)
            )}
            instanceId="select-idMoto"
          />
          {<DisplayError errors={erros} inputName="idMoto" />}
        </FormGroup>

        <FormGroup label="Serviços Realizados: *" htmlFor="servicosRealizados">
          <textarea
            value={servico.repairPerformed}
            onChange={(e) => {
              setErros([]);
              setServico({ ...servico, repairPerformed: e.target.value });
            }}
            id="servicosRealizados"
          />
          {<DisplayError errors={erros} inputName="servicosRealizados" />}
        </FormGroup>

        <FormGroup label="Observação: *" htmlFor="observacao">
          <input
            value={servico.observation}
            onChange={(e) => {
              setErros([]);
              setServico({ ...servico, observation: e.target.value });
            }}
            id="observacao"
            type="text"
          />
          {<DisplayError errors={erros} inputName="observacao" />}
        </FormGroup>

        <FormGroup label="Preço de Mão de Obra: *" htmlFor="precoMaoDeObra">
          <input
            value={formatToBRL(servico.laborCost)}
            onChange={(e) => setPropsProdutoMoney("precoMaoDeObra", e)}
            id="precoMaoDeObra"
            type="text"
          />
          {<DisplayError errors={erros} inputName="precoMaoDeObra" />}
        </FormGroup>
        {adicaoProduto && (
          <FormGroup
            label="Selecione a forma de pagamento*"
            htmlFor="formaDePagamento"
          >
            <Select
              styles={selectStyles}
              placeholder="Selecione..."
              value={opcaoSelecionadaFormaDePagamento}
              onChange={(option: any) =>
                setOpcaoSelecionadaFormaDePagamento(option)
              }
              options={paymentMethods}
              instanceId="select-formaDePagamento"
            />
            {<DisplayError errors={erros} inputName="formaDePagamento" />}
            {opcaoSelecionadaFormaDePagamento.value === "Cartão de Crédito" && (
              <CreditPayment
                errors={erros}
                interestRate={taxaJuros}
                setInterestRate={setTaxaJuros}
                selectedCardFlagOption={opcaoSelecionadaBandeira}
                setSelectedCardFlagOption={setOpcaoSelecionadaBandeira}
                selectedInstallmentOption={opcaoSelecionadaParcela}
                setSelectedInstallmentOption={setOpcaoSelecionadaParcela}
              />
            )}
          </FormGroup>
        )}
      </Card>

      {adicaoProduto ? (
        <button
          onClick={alternarEstadoAdicaoProduto}
          title="Remover Produto"
          style={{ cursor: "pointer", border: "none", margin: "2vw" }}
        >
          <Image src={imgARemoveProduto} width={70} height={65} alt="" />
        </button>
      ) : (
        <button
          onClick={alternarEstadoAdicaoProduto}
          title="Adicionar Produto"
          style={{ cursor: "pointer", border: "none", margin: "2vw 0 1vw 0" }}
        >
          <Image src={imgAddProduto} width={70} height={60} alt="" />
        </button>
      )}

      {adicaoProduto && (
        <ProductRepair
          products={produtos}
          setProducts={setProdutos}
          allProducts={todosProdutos}
          rowQuantity={qtdLinha}
          setRowQuantity={setQtdLinha}
          repairPrice={precoServico}
          setRepairPrice={setPrecoServico}
          totalValues={valoresTotais}
          setTotalValues={setValoresTotais}
          selectedProducts={produtosSelecionados}
          setSelectedProducts={setProdutosSelecionados}
          selectedProductIdAndRowId={idProdutoIdLinhaSelecionado}
          setSelectedProductIdAndRowId={setIdProdutoIdLinhaSelecionado}
          productOfSaleRowId={produtosVendaIdLinha}
          setProductOfSaleRowId={setProdutoVendaIdLinha}
          interestRate={taxaJuros}
          setInterestRate={setTaxaJuros}
          selectedPaymentMethodOption={opcaoSelecionadaFormaDePagamento}
          setSelectedPaymentMethodOption={
            setOpcaoSelecionadaFormaDePagamento
          }
        />
      )}

      <div className="divBotaoCadastrar">
        <button onClick={handlerRealizarServico} type="submit">
          Realizar Serviço
        </button>
      </div>
    </div>
  );
}
