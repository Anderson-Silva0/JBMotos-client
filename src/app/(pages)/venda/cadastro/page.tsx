'use client'

import { Card } from "@/components/Card"
import { ConfirmarDecisao } from "@/components/ConfirmarDecisao"
import { ExibeErro } from "@/components/ExibeErro"
import { FormGroup } from "@/components/Form-group"
import { GeradorPDF, TipoRecibo, removerProdutoOrcamento } from "@/components/GeradorPDF"
import { LinhaTabela } from "@/components/LinhaTabela"
import LoadingLogo from "@/components/LoadingLogo"
import { PagamentoCredito } from "@/components/PagamentoCredito"
import TabelaVenda from "@/components/TabelaVenda"
import imgRemoverLinha from '@/images/icons8-delete-row-100.png'
import imgAdicionarLinha from '@/images/icons8-insert-row-48.png'
import { DecodedToken } from "@/middleware"
import { ProdutoVenda } from "@/models/ProdutoVenda"
import { OpcoesSelecoes, estadoInicialOpcoesSelecoes } from "@/models/Selecoes"
import { Cliente } from "@/models/cliente"
import { Erros, salvarErros } from "@/models/erros"
import { formasPagamentos } from "@/models/formasPagamento"
import { formatarParaReal } from "@/models/formatadorReal"
import { PagamentoCartao, estadoInicialPagamentoCartao } from "@/models/pagamentoCartao"
import { Produto } from "@/models/produto"
import { selectStyles } from "@/models/selectStyles"
import { mensagemAlerta, mensagemErro, mensagemSucesso } from "@/models/toast"
import { Venda, estadoInicialVenda } from "@/models/venda"
import { VendaService } from "@/services/VendaService"
import { ClienteService } from "@/services/clienteService"
import { ProdutoService } from "@/services/produtoService"
import Cookies from 'js-cookie'
import { decode } from 'jsonwebtoken'
import { Save } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import Select from 'react-select'

export interface RegistroProdutoSelecionadoProps {
  idProduto: number
  nomeProduto: string
  quantidade: number
  valorUnidade: string
  valorTotal: string
}

export interface ProdutoSelecionadoProps {
  idLinhaTabela: number,
  produto: Produto
}

export interface IdProdutoEIdLinha {
  idProduto: number
  idLinha: number
}

export interface ValoresTotaisProps {
  valorTotal: number
  idLinha: number
}

export interface ProdutoVendaIdLinhaProps {
  produtoVenda: ProdutoVenda,
  idLinha: number
}

export default function CadastroVenda() {
  const { buscarTodosClientes } = ClienteService()
  const { buscarTodosProdutos } = ProdutoService()
  const { salvarVenda } = VendaService()

  const [userName, setUserName] = useState<string>('')
  const [cpfUser, setCpfUser] = useState<string>('')

  useEffect(() => {
    const token = Cookies.get('login-token')
    if (token) {
      const decodedToken = decode(token) as DecodedToken
      setUserName(decodedToken.userName)
      setCpfUser(decodedToken.userCpf)
    }
  }, [])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)
  const [registrosProdutosVenda, setRegistrosProdutosVenda] = useState<RegistroProdutoSelecionadoProps[]>([])
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionadoProps[]>([])
  const [erros, setErros] = useState<Erros[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([])
  const [venda, setVenda] = useState<Venda>(estadoInicialVenda)
  const [qtdLinha, setQtdLinha] = useState<number[]>([1])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [valoresTotais, setValoresTotais] = useState<ValoresTotaisProps[]>([])
  const [idProdutoIdLinhaSelecionado, setIdProdutoIdLinhaSelecionado] = useState<IdProdutoEIdLinha[]>([])
  const [pagamentoCartao, setPagamentoCartao] = useState<PagamentoCartao>(estadoInicialPagamentoCartao)
  const [opcaoSelecionadaParcela, setOpcaoSelecionadaParcela] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)
  const [opcaoSelecionadaBandeira, setOpcaoSelecionadaBandeira] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)
  const [taxaJuros, setTaxaJuros] = useState<number>(0)
  const [descontoTonReais, setDescontoTonReais] = useState<number | string>(0)
  const [valorLiquido, setValorLiquido] = useState<number | string>(0)
  const [produtosVendaIdLinha, setProdutoVendaIdLinha] = useState<ProdutoVendaIdLinhaProps[]>([])
  const [valorTotalVenda, setValorTotalVenda] = useState<number>(0)

  const [opcaoSelecionadaCliente,
    setOpcaoSelecionadaCliente
  ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

  const [
    opcaoSelecionadaFormaDePagamento,
    setOpcaoSelecionadaFormaDePagamento
  ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

  const definirEstadoInicialSelecaoVenda = () => {
    setOpcaoSelecionadaCliente(estadoInicialOpcoesSelecoes)
    setOpcaoSelecionadaFormaDePagamento(estadoInicialOpcoesSelecoes)
    setVenda({ ...venda, observacao: '' })
  }

  const buscarTodos = async () => {
    try {
      const todosClientesResponse = await buscarTodosClientes()
      const todosClientes = todosClientesResponse.data
      const clientesAtivos = todosClientes.filter((c: Cliente) => c.statusCliente === 'ATIVO')
      setClientes(clientesAtivos)

      const todosProdutosResponse = await buscarTodosProdutos()
      setProdutos(todosProdutosResponse.data)
      setTodosProdutos(todosProdutosResponse.data)
    } catch (erro: any) {
      mensagemErro(erro.response.data)
    } finally {
      setFoiCarregado(true)
    }
  }

  useEffect(() => {
    buscarTodos()
  }, [])

  useEffect(() => {
    setVenda(
      {
        ...venda,
        cpfCliente: String(opcaoSelecionadaCliente?.value),
        cpfFuncionario: cpfUser,
        formaDePagamento: String(opcaoSelecionadaFormaDePagamento?.value)
      }
    )
    setErros([])
  }, [opcaoSelecionadaCliente, opcaoSelecionadaFormaDePagamento])

  const definirEstadoInicialPagamentoCartao = () => {
    setPagamentoCartao(estadoInicialPagamentoCartao)
    setOpcaoSelecionadaParcela(estadoInicialOpcoesSelecoes)
    setOpcaoSelecionadaBandeira(estadoInicialOpcoesSelecoes)
    setTaxaJuros(0)
  }

  const limparTudoAposVenda = () => {
    definirEstadoInicialPagamentoCartao()
    setIdProdutoIdLinhaSelecionado([])
    definirEstadoInicialSelecaoVenda()
    setVenda(estadoInicialVenda)
    setProdutosSelecionados([])
    setValoresTotais([])
    setQtdLinha([1])
    setProdutoVendaIdLinha([])
    buscarTodos()
    setErros([])
  }

  const submit = async () => {
    if (produtosSelecionados.length) {
      try {
        const produtosVenda = produtosVendaIdLinha.map(item => item.produtoVenda)

        if (opcaoSelecionadaFormaDePagamento.value === "Cartão de Crédito") {
          await salvarVenda({ ...venda, produtosVenda, pagamentoCartao })
        } else {
          await salvarVenda({ ...venda, produtosVenda: produtosVenda })
        }

        mensagemSucesso("Venda realizada com sucesso!")
        limparTudoAposVenda()
      } catch (error: any) {
        salvarErros(error, erros, setErros)
        mensagemErro('Erro no preenchimento dos campos.')
      }
    } else {
      mensagemAlerta("Selecione algum produto.")
    }
  }

  useEffect(() => {
    const definirPagamentoCartao = () => {
      if (opcaoSelecionadaFormaDePagamento.label === "Cartão de Crédito") {
        if (opcaoSelecionadaParcela.value || opcaoSelecionadaBandeira.value || taxaJuros) {
          setPagamentoCartao(
            {
              parcela: opcaoSelecionadaParcela.value,
              bandeira: opcaoSelecionadaBandeira.value,
              totalTaxas: taxaJuros,
              idVenda: 0
            }
          )
        }
      } else {
        setPagamentoCartao(estadoInicialPagamentoCartao)
        setOpcaoSelecionadaParcela(estadoInicialOpcoesSelecoes)
        setOpcaoSelecionadaBandeira(estadoInicialOpcoesSelecoes)
        setTaxaJuros(0)
      }

      setErros([])
    }

    definirPagamentoCartao()
  }, [opcaoSelecionadaParcela, opcaoSelecionadaBandeira, taxaJuros, opcaoSelecionadaFormaDePagamento])

  const handlerRealizarVenda = () => {
    ConfirmarDecisao("Confirmação de Venda", "Tem certeza de que deseja realizar esta venda?", submit)
  }

  const gerarMensagemAlertaProdutosAtivos = (produtosAtivos: Produto[]) => {
    let mensagem = ''

    if (todosProdutos.length > 1 && produtosAtivos.length > 1) {
      mensagem = `Não é possível adicionar mais linhas, pois existem  
          ${todosProdutos.length} produtos no total`
    } else if (todosProdutos.length > 1 && produtosAtivos.length === 1) {
      mensagem = `Não é possível adicionar mais linhas, pois existem  
          ${todosProdutos.length} produtos no total`
    } else if (todosProdutos.length === 1) {
      mensagem = `Não é possível adicionar mais linhas, pois existe  
          ${todosProdutos.length} produto no total, e ${produtosAtivos.length} ativo.`
    }

    if (produtosAtivos.length < todosProdutos.length && produtosAtivos.length > 1) {
      mensagem += `, mas apenas ${produtosAtivos.length} estão ativos.`
    } else if (produtosAtivos.length < todosProdutos.length && produtosAtivos.length == 1 && todosProdutos.length > 1) {
      mensagem += `, mas apenas ${produtosAtivos.length} ativo.`
    }

    return mensagem
  }

  const adicionarLinha = () => {
    const produtosAtivos = todosProdutos.filter(p => p.statusProduto === 'ATIVO')
    if (qtdLinha.length < produtosAtivos.length) {
      const newId = Math.floor(Math.random() * 1000000)
      setQtdLinha([...qtdLinha, newId])
    } else if (qtdLinha.length === produtosAtivos.length) {
      mensagemAlerta(gerarMensagemAlertaProdutosAtivos(produtosAtivos))
    }
  }

  const removerLinha = () => {
    const novasLinhas = [...qtdLinha]
    if (qtdLinha.length > 1) {
      novasLinhas.pop()
      if (qtdLinha.length === idProdutoIdLinhaSelecionado.length) {
        const produtoExcluido = idProdutoIdLinhaSelecionado.pop()
        if (produtoExcluido) {
          const produtoExcluidoNoPop = produtosSelecionados.filter(produto => produto.produto.id === produtoExcluido.idProduto)[0].produto

          const novosValoresTotais = valoresTotais.filter(valor => valor.idLinha !== produtoExcluido.idLinha)
          setValoresTotais(novosValoresTotais)

          const indiceParaRemover = produtosVendaIdLinha.findIndex((item) => item.produtoVenda.idProduto === produtoExcluido.idProduto)
          if (indiceParaRemover >= 0) {
            produtosVendaIdLinha.splice(indiceParaRemover, 1)
          }

          setProdutos([...produtos, produtoExcluidoNoPop])
        }
      }
    }
    setQtdLinha(novasLinhas)
  }

  const atualizarElemento = (indice: number, idProduto: number, idLinha: number) => {
    setIdProdutoIdLinhaSelecionado(prevState => {
      const novaLista = [...prevState]
      if (indice >= 0 && indice < novaLista.length) {
        novaLista[indice] = { idProduto, idLinha }
      }
      return novaLista
    })
  }

  const atualizarIdProdutoIdLinhaSelecionado = (idProduto: number, idLinhaAtual: number) => {
    const indiceIdProdutoIdLinha = idProdutoIdLinhaSelecionado.findIndex((idprodutoIdLinha) => idprodutoIdLinha.idLinha === idLinhaAtual)

    if (idProdutoIdLinhaSelecionado[indiceIdProdutoIdLinha]?.idLinha) {
      atualizarElemento(indiceIdProdutoIdLinha, idProduto, idLinhaAtual)
    } else {
      setIdProdutoIdLinhaSelecionado([...idProdutoIdLinhaSelecionado, { idProduto: idProduto, idLinha: idLinhaAtual }])
    }
  }

  useEffect(() => {
    const totalVenda = valoresTotais.reduce((acumulador, valor) => acumulador + valor.valorTotal, 0)
    setValorTotalVenda(totalVenda)
  }, [valoresTotais])

  useEffect(() => {
    setDescontoTonReais(Number(taxaJuros) / 100 * valorTotalVenda)
    setValorLiquido(valorTotalVenda - Number(descontoTonReais))
  }, [valorTotalVenda, taxaJuros, descontoTonReais])

  const obterNomeClienteSelecionado = () => {
    let nomeClienteSelecionado = ''
    clientes.forEach(cliente => {
      if (cliente.cpf === opcaoSelecionadaCliente.value) {
        nomeClienteSelecionado = cliente.nome
      }
    })
    return nomeClienteSelecionado
  }

  if (!foiCarregado) {
    return <LoadingLogo />
  }

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Save size='6vh' strokeWidth={3} /> Registro de Venda
      </h1>
      <Card titulo="Detalhes da Venda">
        <FormGroup label="Selecione o Cliente: *" htmlFor="cpfCliente">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={opcaoSelecionadaCliente}
            onChange={(option: any) => setOpcaoSelecionadaCliente(option)}
            options={clientes.map(c => ({ label: c.cpf, value: c.cpf }) as OpcoesSelecoes)}
            instanceId="select-cpfCliente"
          />
          {<ExibeErro erros={erros} nomeInput="cpfCliente" />}
        </FormGroup>
        <FormGroup label="Selecione a forma de pagamento*" htmlFor="formaDePagamento">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={opcaoSelecionadaFormaDePagamento}
            onChange={(option: any) => setOpcaoSelecionadaFormaDePagamento(option)}
            options={formasPagamentos}
            instanceId="select-formaDePagamento"
          />
          {<ExibeErro erros={erros} nomeInput="formaDePagamento" />}
          {
            opcaoSelecionadaFormaDePagamento.value === "Cartão de Crédito" && (

              <PagamentoCredito
                erros={erros}
                taxaJuros={taxaJuros}
                setTaxaJuros={setTaxaJuros}
                opcaoSelecionadaBandeira={opcaoSelecionadaBandeira}
                setOpcaoSelecionadaBandeira={setOpcaoSelecionadaBandeira}
                opcaoSelecionadaParcela={opcaoSelecionadaParcela}
                setOpcaoSelecionadaParcela={setOpcaoSelecionadaParcela}
              />

            )
          }
        </FormGroup>
        <FormGroup label="Observação:" htmlFor="observacao">
          <input
            maxLength={100}
            value={venda.observacao}
            onChange={(e) => { setErros([]); setVenda({ ...venda, observacao: e.target.value }) }}
            id="observacao"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='observacao' />}
        </FormGroup>
      </Card>
      <TabelaVenda>
        {
          qtdLinha.map(idLinha => {
            return (
              <LinhaTabela key={idLinha}
                idLinha={idLinha}
                produtos={produtos}
                qtdLinha={qtdLinha}
                atualizarIdProdutoIdLinhaSelecionado={atualizarIdProdutoIdLinhaSelecionado}
                valoresTotais={valoresTotais}
                setValoresTotais={setValoresTotais}
                setProdutos={setProdutos}
                produtosSelecionados={produtosSelecionados}
                setProdutosSelecionados={setProdutosSelecionados}
                registrosProdutosVenda={registrosProdutosVenda}
                setRegistrosProdutosVenda={setRegistrosProdutosVenda}
                setProdutoVendaIdLinha={setProdutoVendaIdLinha}
                produtoVendaIdLinha={produtosVendaIdLinha}
              />
            )
          })
        }
      </TabelaVenda>

      <div style={{ display: 'flex', justifyContent: 'space-around', width: '50vw' }}>
        <div id="valor-total-venda">
          <span>Valor Bruto</span>
          <span>
            {formatarParaReal(valorTotalVenda)}
          </span>
        </div>
        {
          opcaoSelecionadaFormaDePagamento.value === "Cartão de Crédito" && (
            <>
              <div id="valor-total-venda" >
                <span style={{ color: 'red' }}>Desconto Ton</span>
                <span style={{ color: 'red' }}>
                  {formatarParaReal(descontoTonReais)}
                </span>
              </div>
              <div id="valor-total-venda">
                <span>Valor Líquido</span>
                <span>
                  {formatarParaReal(valorLiquido)}
                </span>
              </div>
            </>
          )
        }
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
        <button
          onClick={handlerRealizarVenda}
          type="submit">
          Realizar Venda
        </button>
        <GeradorPDF
          tipoRecibo={TipoRecibo.Orcamento}
          nomeCliente={obterNomeClienteSelecionado()}
          cpfCliente={opcaoSelecionadaCliente.value}
          formaPagamento={opcaoSelecionadaFormaDePagamento.value}
          nomeFuncionario={userName}
          observacao={venda.observacao}
          produtosVenda={registrosProdutosVenda}
          valorTotalVenda={formatarParaReal(valorTotalVenda)}
        />
      </div>
    </div>
  )
}