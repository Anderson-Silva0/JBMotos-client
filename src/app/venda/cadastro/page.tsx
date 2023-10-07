'use client'

import { Card } from "@/components/Card"
import { ConfirmarDecisao } from "@/components/ConfirmarDecisao"
import { ExibeErro } from "@/components/ExibeErro"
import { FormGroup } from "@/components/Form-group"
import { GeradorPDF, TipoRecibo, removerProdutoOrcamento } from "@/components/GeradorPDF"
import { LinhaTabela } from "@/components/LinhaTabela"
import TabelaVenda from "@/components/TabelaVenda"
import imgRemoverLinha from '@/images/icons8-delete-row-100.png'
import imgAdicionarLinha from '@/images/icons8-insert-row-48.png'
import { OpcoesSelecoes, estadoInicialOpcoesSelecoes } from "@/models/Selecoes"
import { Cliente } from "@/models/cliente"
import { Erros, salvarErros } from "@/models/erros"
import { formasPagamentos } from "@/models/formasPagamento"
import { formatarParaReal } from "@/models/formatadorReal"
import { Funcionario } from "@/models/funcionario"
import { Produto } from "@/models/produto"
import { selectStyles } from "@/models/selectStyles"
import { mensagemAlerta, mensagemErro, mensagemSucesso } from "@/models/toast"
import { Venda, estadoInicialVenda } from "@/models/venda"
import { VendaService } from "@/services/VendaService"
import { ClienteService } from "@/services/clienteService"
import { FuncionarioService } from "@/services/funcionarioService"
import { ProdutoService } from "@/services/produtoService"
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

interface IdProdutoEIdLinha {
  idProduto: number
  idLinha: number
}

export interface ValoresTotaisProps {
  valorTotal: number
  idLinha: number
}

export default function CadastroVenda() {
  const { buscarTodosClientes } = ClienteService()
  const { buscarTodosFuncionarios } = FuncionarioService()
  const { buscarTodosProdutos } = ProdutoService()
  const { salvarVenda, deletarVenda } = VendaService()

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)
  const [registrosProdutosVenda, setRegistrosProdutosVenda] = useState<RegistroProdutoSelecionadoProps[]>([])
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionadoProps[]>([])
  const [erros, setErros] = useState<Erros[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([])
  const [venda, setVenda] = useState<Venda>(estadoInicialVenda)
  const [idVenda, setIdVenda] = useState<number>(0)
  const [qtdLinha, setQtdLinha] = useState<number[]>([1])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [valoresTotais, setValoresTotais] = useState<ValoresTotaisProps[]>([])
  const [ocorrenciasErros, setOcorrenciasErros] = useState<string[]>([])
  const [idProdutoIdLinhaSelecionado, setIdProdutoIdLinhaSelecionado] = useState<IdProdutoEIdLinha[]>([])

  const [opcaoSelecionadaCliente,
    setOpcaoSelecionadaCliente
  ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

  const [
    opcaoSelecionadaFuncionario,
    setOpcaoSelecionadaFuncionario
  ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

  const [
    opcaoSelecionadaFormaDePagamento,
    setOpcaoSelecionadaFormaDePagamento
  ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

  const definirEstadoInicialSelecaoVenda = () => {
    setOpcaoSelecionadaCliente(estadoInicialOpcoesSelecoes)
    setOpcaoSelecionadaFuncionario(estadoInicialOpcoesSelecoes)
    setOpcaoSelecionadaFormaDePagamento(estadoInicialOpcoesSelecoes)
    setVenda({ ...venda, observacao: '' })
  }

  const buscarTodos = async () => {
    try {
      const todosClientesResponse = await buscarTodosClientes()
      const todosClientes = todosClientesResponse.data
      const clientesAtivos = todosClientes.filter((c: Cliente) => c.statusCliente === 'ATIVO')
      setClientes(clientesAtivos)

      const todosFuncionariosResponse = await buscarTodosFuncionarios()
      const todosFuncionarios = todosFuncionariosResponse.data
      const funcionariosAtivos = todosFuncionarios.filter((f: Funcionario) => f.statusFuncionario === 'ATIVO')
      setFuncionarios(funcionariosAtivos)

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
        cpfFuncionario: String(opcaoSelecionadaFuncionario?.value),
        formaDePagamento: String(opcaoSelecionadaFormaDePagamento?.value)
      }
    )
    setErros([])
  }, [opcaoSelecionadaCliente, opcaoSelecionadaFuncionario, opcaoSelecionadaFormaDePagamento])

  const exibirResultados = async () => {
    if (ocorrenciasErros.includes('sucesso') && !ocorrenciasErros.includes('erro')) {
      mensagemSucesso("Venda realizada com sucesso!")
    } else if (ocorrenciasErros.includes('erro')) {
      await deletarVenda(idVenda)
      mensagemAlerta('Ocorreram erros. Por favor, refaça a Venda.')
    }
    setQtdLinha([1])
    setOcorrenciasErros([])
    setValoresTotais([])
    definirEstadoInicialSelecaoVenda()
    setVenda(estadoInicialVenda)
    setIdVenda(0)
    buscarTodos()
  }

  useEffect(() => {
    if (ocorrenciasErros.length === qtdLinha.length) {
      exibirResultados()
    }
  }, [ocorrenciasErros])

  const submit = async () => {
    try {
      const response = await salvarVenda(venda)
      setIdVenda(response.data.id)
      setErros([])
      setIdProdutoIdLinhaSelecionado([])
    } catch (error: any) {
      salvarErros(error, erros, setErros)
      mensagemErro('Erro no preenchimento dos campos.')
    }
  }

  const handlerRealizarVenda = () => {
    ConfirmarDecisao("Confirmação de Venda", "Tem certeza de que deseja realizar esta venda?", submit)
  }

  const gerarMensagemAlertaProdutosAtivos = (produtosAtivos: Produto[]) => {
    let mensagem = ''
    if (todosProdutos.length > 1 && produtosAtivos.length > 1) {
      mensagem = `Não é possível adicionar mais linhas, pois existem  
      ${todosProdutos.length} produtos no total, mas apenas ${produtosAtivos.length} estão ativos.`
    } else if (todosProdutos.length > 1 && produtosAtivos.length === 1) {
      mensagem = `Não é possível adicionar mais linhas, pois existem  
      ${todosProdutos.length} produtos no total, mas apenas ${produtosAtivos.length} ativo.`
    } else if (todosProdutos.length === 1) {
      mensagem = `Não é possível adicionar mais linhas, pois existe  
      ${todosProdutos.length} produto no total, e ${produtosAtivos.length} ativo.`
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
        valoresTotais.pop()
        const idProdutoExcluido = idProdutoIdLinhaSelecionado.pop()?.idProduto
        const produtoExcluido = produtosSelecionados.filter(produto => produto.produto.id === idProdutoExcluido)[0].produto
        removerProdutoOrcamento(registrosProdutosVenda, produtoExcluido)
        setProdutos([...produtos, produtoExcluido])
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

  const valorTotalVenda = valoresTotais.reduce((acumulador, valor) => acumulador + valor.valorTotal, 0)

  const obterNomeClienteSelecionado = () => {
    let nomeClienteSelecionado = ''
    clientes.forEach(cliente => {
      if (cliente.cpf === opcaoSelecionadaCliente.value) {
        nomeClienteSelecionado = cliente.nome
      }
    })
    return nomeClienteSelecionado
  }

  //Teste ****************************************************************

  const [divisoesState, setDivisoesState] = useState<OpcoesSelecoes[]>([])
  const [opcaoSelecionadaDivisao, setOpcaoSelecionadaDivisao] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

  useEffect(() => {
    const divisoes: OpcoesSelecoes[] = []

    for (let i = 1; i <= 24; i++) {
      const label = `${i}x`
      const value = label
      divisoes.push({ label, value })
    }
    setDivisoesState(divisoes)
  }, [])

  useEffect(() => {
    if (opcaoSelecionadaDivisao.value !== "") {
      console.log("Divisão Selecionada: ", opcaoSelecionadaDivisao)
    }
  }, [opcaoSelecionadaDivisao])

  //************************************************************************

  if (!foiCarregado) {
    return <h1 className="carregando">Carregando...</h1>
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
        <FormGroup label="Selecione o Funcionário (Vendedor): *" htmlFor="cpfFuncionario">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={opcaoSelecionadaFuncionario}
            onChange={(option: any) => setOpcaoSelecionadaFuncionario(option)}
            options={funcionarios.map(f => ({ label: f.nome, value: f.cpf }) as OpcoesSelecoes)}
            instanceId="select-cpfFuncionario"
          />
          {<ExibeErro erros={erros} nomeInput="cpfFuncionario" />}
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
              <>
                <label htmlFor="teste">Divisão em Parcelas</label>
                <Select
                  styles={selectStyles}
                  placeholder="Selecione..."
                  value={opcaoSelecionadaDivisao}
                  onChange={(option: any) => setOpcaoSelecionadaDivisao(option)}
                  options={divisoesState}
                  instanceId="select-divisoes"
                />
              </>
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
        {qtdLinha.map(idLinha => {
          return (
            <LinhaTabela key={idLinha}
              idLinha={idLinha}
              produtos={produtos}
              idVenda={idVenda}
              qtdLinha={qtdLinha}
              setOcorrenciasErros={setOcorrenciasErros}
              atualizarIdProdutoIdLinhaSelecionado={atualizarIdProdutoIdLinhaSelecionado}
              valoresTotais={valoresTotais}
              setValoresTotais={setValoresTotais}
              setProdutos={setProdutos}
              produtosSelecionados={produtosSelecionados}
              setProdutosSelecionados={setProdutosSelecionados}
              registrosProdutosVenda={registrosProdutosVenda}
              setRegistrosProdutosVenda={setRegistrosProdutosVenda}
            />
          )
        })
        }
      </TabelaVenda>
      <div id="valor-total-venda">
        <span>Total da Venda</span>
        <span>
          {formatarParaReal(valorTotalVenda)}
        </span>
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
          nomeFuncionario={opcaoSelecionadaFuncionario.label}
          observacao={venda.observacao}
          produtosVenda={registrosProdutosVenda}
          valorTotalVenda={formatarParaReal(valorTotalVenda)}
        />
      </div>
    </div>
  )
}