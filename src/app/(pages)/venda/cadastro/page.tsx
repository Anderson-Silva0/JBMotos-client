"use client";

import { Card } from "@/components/Card";
import { confirmDecision } from "@/components/ConfirmarDecisao";
import { DisplayError } from "@/components/ExibeErro";
import { FormGroup } from "@/components/Form-group";
import {
  PDFGenerator,
  ReceiptType,
  removeProductFromBudget,
} from "@/components/GeradorPDF";
import { TableRow } from "@/components/LinhaTabela";
import LoadingLogo from "@/components/LoadingLogo";
import { CreditPayment } from "@/components/PagamentoCredito";
import SaleTable from "@/components/TabelaVenda";
import imgRemoverLinha from "@/images/icons8-delete-row-100.png";
import imgAdicionarLinha from "@/images/icons8-insert-row-48.png";
import { DecodedToken } from "@/middleware";
import { ProductOfSale } from "@/models/ProdutoVenda";
import {
  selectionOptions,
  selectionOptionsInitialState,
} from "@/models/Selecoes";
import { Customer } from "@/models/cliente";
import { Errors, saveErrors } from "@/models/erros";
import { paymentMethods } from "@/models/formasPagamento";
import { formatToBRL } from "@/models/formatadorReal";
import {
  CardPayment,
  cardPaymentInitialState,
} from "@/models/pagamentoCartao";
import { Product } from "@/models/produto";
import { selectStyles } from "@/models/selectStyles";
import { alertMessage, errorMessage, successMessage } from "@/models/toast";
import { Sale, SaleInitialState } from "@/models/venda";
import { SaleService } from "@/services/VendaService";
import { CustomerService } from "@/services/clienteService";
import { ProductService } from "@/services/produtoService";
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

export default function CadastroVenda() {
  const { findAllCustomer: buscarTodosClientes } = CustomerService();
  const { findAllProduct: buscarTodosProdutos } = ProductService();
  const { saveSale: salvarVenda } = SaleService();

  const [userName, setUserName] = useState<string>("");
  const [cpfUser, setCpfUser] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("login-token");
    if (token) {
      const decodedToken = decode(token) as DecodedToken;
      setUserName(decodedToken.userName);
      setCpfUser(decodedToken.userCpf);
    }
  }, []);

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false);
  const [registrosProdutosVenda, setRegistrosProdutosVenda] = useState<
    SelectedProductRegisterProps[]
  >([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    SelectedProductProps[]
  >([]);
  const [erros, setErros] = useState<Errors[]>([]);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [todosProdutos, setTodosProdutos] = useState<Product[]>([]);
  const [venda, setVenda] = useState<Sale>(SaleInitialState);
  const [qtdLinha, setQtdLinha] = useState<number[]>([1]);
  const [clientes, setClientes] = useState<Customer[]>([]);
  const [valoresTotais, setValoresTotais] = useState<TotalValuesProps[]>([]);
  const [idProdutoIdLinhaSelecionado, setIdProdutoIdLinhaSelecionado] =
    useState<ProductIdAndRowId[]>([]);
  const [pagamentoCartao, setPagamentoCartao] = useState<CardPayment>(
    cardPaymentInitialState
  );
  const [opcaoSelecionadaParcela, setOpcaoSelecionadaParcela] =
    useState<selectionOptions>(selectionOptionsInitialState);
  const [opcaoSelecionadaBandeira, setOpcaoSelecionadaBandeira] =
    useState<selectionOptions>(selectionOptionsInitialState);
  const [taxaJuros, setTaxaJuros] = useState<number>(0);
  const [descontoTonReais, setDescontoTonReais] = useState<number | string>(0);
  const [valorLiquido, setValorLiquido] = useState<number | string>(0);
  const [produtosVendaIdLinha, setProdutoVendaIdLinha] = useState<
    ProductOfSaleRowIdProps[]
  >([]);
  const [valorTotalVenda, setValorTotalVenda] = useState<number>(0);

  const [opcaoSelecionadaCliente, setOpcaoSelecionadaCliente] =
    useState<selectionOptions>(selectionOptionsInitialState);

  const [
    opcaoSelecionadaFormaDePagamento,
    setOpcaoSelecionadaFormaDePagamento,
  ] = useState<selectionOptions>(selectionOptionsInitialState);

  const definirEstadoInicialSelecaoVenda = () => {
    setOpcaoSelecionadaCliente(selectionOptionsInitialState);
    setOpcaoSelecionadaFormaDePagamento(selectionOptionsInitialState);
    setVenda({ ...venda, observation: "" });
  };

  const buscarTodos = async () => {
    try {
      const todosClientesResponse = await buscarTodosClientes();
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
    setVenda({
      ...venda,
      customer: {
        ...venda.customer,
        cpf: String(opcaoSelecionadaCliente?.value),
      },
      employee: { ...venda.employee, cpf: cpfUser },
      paymentMethod: String(opcaoSelecionadaFormaDePagamento?.value),
    });
    setErros([]);
  }, [opcaoSelecionadaCliente, opcaoSelecionadaFormaDePagamento]);

  const definirEstadoInicialPagamentoCartao = () => {
    setPagamentoCartao(cardPaymentInitialState);
    setOpcaoSelecionadaParcela(selectionOptionsInitialState);
    setOpcaoSelecionadaBandeira(selectionOptionsInitialState);
    setTaxaJuros(0);
  };

  const limparTudoAposVenda = () => {
    definirEstadoInicialPagamentoCartao();
    setIdProdutoIdLinhaSelecionado([]);
    definirEstadoInicialSelecaoVenda();
    setVenda(SaleInitialState);
    setProdutosSelecionados([]);
    setValoresTotais([]);
    setQtdLinha([1]);
    setProdutoVendaIdLinha([]);
    buscarTodos();
    setErros([]);
  };

  const submit = async () => {
    if (produtosSelecionados.length) {
      try {
        const produtosVenda = produtosVendaIdLinha.map((item) => {
          const produtoVenda = { ...item.productOfSale };
          produtoVenda.product = { ...produtoVenda.product };
          produtoVenda.product.id = produtoVenda.productId;

          return produtoVenda;
        });

        if (opcaoSelecionadaFormaDePagamento.value === "Cartão de Crédito") {
          await salvarVenda({ ...venda, productsOfSale: produtosVenda, cardPayment: pagamentoCartao });
        } else {
          await salvarVenda({ ...venda, productsOfSale: produtosVenda });
        }

        successMessage("Venda realizada com sucesso!");
        limparTudoAposVenda();
      } catch (error: any) {
        saveErrors(error, erros, setErros);
        errorMessage("Erro no preenchimento dos campos.");
      }
    } else {
      alertMessage("Selecione algum produto.");
    }
  };

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

  const handlerRealizarVenda = () => {
    confirmDecision(
      "Confirmação de Venda",
      "Tem certeza de que deseja realizar esta venda?",
      submit
    );
  };

  const gerarMensagemAlertaProdutosAtivos = (produtosAtivos: Product[]) => {
    let mensagem = "";

    if (todosProdutos.length > 1 && produtosAtivos.length > 1) {
      mensagem = `Não é possível adicionar mais linhas, pois existem  
          ${todosProdutos.length} produtos no total`;
    } else if (todosProdutos.length > 1 && produtosAtivos.length === 1) {
      mensagem = `Não é possível adicionar mais linhas, pois existem  
          ${todosProdutos.length} produtos no total`;
    } else if (todosProdutos.length === 1) {
      mensagem = `Não é possível adicionar mais linhas, pois existe  
          ${todosProdutos.length} produto no total, e ${produtosAtivos.length} ativo.`;
    }

    if (
      produtosAtivos.length < todosProdutos.length &&
      produtosAtivos.length > 1
    ) {
      mensagem += `, mas apenas ${produtosAtivos.length} estão ativos.`;
    } else if (
      produtosAtivos.length < todosProdutos.length &&
      produtosAtivos.length == 1 &&
      todosProdutos.length > 1
    ) {
      mensagem += `, mas apenas ${produtosAtivos.length} ativo.`;
    }

    return mensagem;
  };

  const adicionarLinha = () => {
    const produtosAtivos = todosProdutos.filter(
      (p) => p.productStatus === "ATIVO"
    );
    if (qtdLinha.length < produtosAtivos.length) {
      const newId = Math.floor(Math.random() * 1000000);
      setQtdLinha([...qtdLinha, newId]);
    } else if (qtdLinha.length === produtosAtivos.length) {
      alertMessage(gerarMensagemAlertaProdutosAtivos(produtosAtivos));
    }
  };

  const removerLinha = () => {
    const novasLinhas = [...qtdLinha];
    if (qtdLinha.length > 1) {
      novasLinhas.pop();
      if (qtdLinha.length === idProdutoIdLinhaSelecionado.length) {
        const produtoExcluido = idProdutoIdLinhaSelecionado.pop();
        if (produtoExcluido) {
          const produtoExcluidoNoPop = produtosSelecionados.filter(
            (produto) => produto.product.id === produtoExcluido.productId
          )[0].product;

          const novosValoresTotais = valoresTotais.filter(
            (valor) => valor.rowId !== produtoExcluido.rowId
          );
          setValoresTotais(novosValoresTotais);

          const indiceParaRemover = produtosVendaIdLinha.findIndex(
            (item) => item.productOfSale.product.id === produtoExcluido.productId
          );
          if (indiceParaRemover >= 0) {
            produtosVendaIdLinha.splice(indiceParaRemover, 1);
          }

          setProdutos([...produtos, produtoExcluidoNoPop]);
        }
      }
    }
    setQtdLinha(novasLinhas);
  };

  const atualizarElemento = (
    indice: number,
    idProduto: number,
    idLinha: number
  ) => {
    setIdProdutoIdLinhaSelecionado((prevState) => {
      const novaLista = [...prevState];
      if (indice >= 0 && indice < novaLista.length) {
        novaLista[indice] = { productId: idProduto, rowId: idLinha };
      }
      return novaLista;
    });
  };

  const atualizarIdProdutoIdLinhaSelecionado = (
    idProduto: number,
    idLinhaAtual: number
  ) => {
    const indiceIdProdutoIdLinha = idProdutoIdLinhaSelecionado.findIndex(
      (idprodutoIdLinha) => idprodutoIdLinha.rowId === idLinhaAtual
    );

    if (idProdutoIdLinhaSelecionado[indiceIdProdutoIdLinha]?.rowId) {
      atualizarElemento(indiceIdProdutoIdLinha, idProduto, idLinhaAtual);
    } else {
      setIdProdutoIdLinhaSelecionado([
        ...idProdutoIdLinhaSelecionado,
        { productId: idProduto, rowId: idLinhaAtual },
      ]);
    }
  };

  useEffect(() => {
    const totalVenda = valoresTotais.reduce(
      (acumulador, valor) => acumulador + valor.totalValue,
      0
    );
    setValorTotalVenda(totalVenda);
  }, [valoresTotais]);

  useEffect(() => {
    setDescontoTonReais((Number(taxaJuros) / 100) * valorTotalVenda);
    setValorLiquido(valorTotalVenda - Number(descontoTonReais));
  }, [valorTotalVenda, taxaJuros, descontoTonReais]);

  const obterNomeClienteSelecionado = () => {
    let nomeClienteSelecionado = "";
    clientes.forEach((cliente) => {
      if (cliente.cpf === opcaoSelecionadaCliente.value) {
        nomeClienteSelecionado = cliente.name;
      }
    });
    return nomeClienteSelecionado;
  };

  if (!foiCarregado) {
    return <LoadingLogo description="Carregando" />;
  }

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Save size="6vh" strokeWidth={3} /> Registro de Venda
      </h1>
      <Card title="Detalhes da Venda">
        <FormGroup label="Selecione o Cliente: *" htmlFor="cpfCliente">
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
        <FormGroup label="Observação:" htmlFor="observacao">
          <input
            maxLength={100}
            value={venda.observation}
            onChange={(e) => {
              setErros([]);
              setVenda({ ...venda, observation: e.target.value });
            }}
            id="observacao"
            type="text"
          />
          {<DisplayError errors={erros} inputName="observacao" />}
        </FormGroup>
      </Card>
      <SaleTable>
        {qtdLinha.map((idLinha) => {
          return (
            <TableRow
              key={idLinha}
              rowId={idLinha}
              products={produtos}
              rowQuantity={qtdLinha}
              updateSelectedProductIdAndRowId={
                atualizarIdProdutoIdLinhaSelecionado
              }
              totalValues={valoresTotais}
              setTotalValues={setValoresTotais}
              setProducts={setProdutos}
              selectedProducts={produtosSelecionados}
              setSelectedProducts={setProdutosSelecionados}
              saleProductsRegisters={registrosProdutosVenda}
              setSaleProductsRegisters={setRegistrosProdutosVenda}
              setSaleProductRowId={setProdutoVendaIdLinha}
              saleProductRowId={produtosVendaIdLinha}
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
          <span>{formatToBRL(valorTotalVenda)}</span>
        </div>
        {opcaoSelecionadaFormaDePagamento.value === "Cartão de Crédito" && (
          <>
            <div id="valor-total-venda">
              <span style={{ color: "red" }}>Desconto Ton</span>
              <span style={{ color: "red" }}>
                {formatToBRL(descontoTonReais)}
              </span>
            </div>
            <div id="valor-total-venda">
              <span>Valor Líquido</span>
              <span>{formatToBRL(valorLiquido)}</span>
            </div>
          </>
        )}
      </div>

      <div className="div-botoes-line">
        <button onClick={adicionarLinha} className="botao-add-line">
          <Image src={imgAdicionarLinha} width={40} height={40} alt={""} />
        </button>
        <button onClick={removerLinha} className="botao-remove-line">
          <Image src={imgRemoverLinha} width={40} height={40} alt={""} />
        </button>
      </div>
      <div className="divBotaoCadastrar">
        <button onClick={handlerRealizarVenda} type="submit">
          Realizar Venda
        </button>
        <PDFGenerator
          receiptType={ReceiptType.Budget}
          customerName={obterNomeClienteSelecionado()}
          customerCpf={opcaoSelecionadaCliente.value}
          paymentMethod={opcaoSelecionadaFormaDePagamento.value}
          employeeName={userName}
          observation={venda.observation}
          productOfSaleRegister={registrosProdutosVenda}
          totalSaleValue={formatToBRL(valorTotalVenda)}
        />
      </div>
    </div>
  );
}
