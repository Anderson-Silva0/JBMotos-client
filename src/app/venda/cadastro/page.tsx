'use client'

import { Card } from "@/components/Card"
import { ExibeErro } from "@/components/ExibeErro"
import { FormGroup } from "@/components/Form-group"
import LinhaTabela from "@/components/LinhaTabela"
import TabelaVenda from "@/components/TabelaVenda"
import imgRemoverLinha from '@/images/icons8-delete-row-100.png'
import imgAdicionarLinha from '@/images/icons8-insert-row-48.png'
import { OpcoesSelecoes, estadoInicialOpcoesSelecoes } from "@/models/Selecoes"
import { Cliente } from "@/models/cliente"
import { Erros, salvarErros } from "@/models/erros"
import { formatarParaReal } from "@/models/formatadorReal"
import { Funcionario } from "@/models/funcionario"
import { Pedido, estadoInicialPedido } from "@/models/pedido"
import { Produto } from "@/models/produto"
import { selectStyles } from "@/models/selectStyles"
import { mensagemAlerta, mensagemErro, mensagemSucesso } from "@/models/toast"
import { PedidoService } from "@/services/PedidoService"
import { ClienteService } from "@/services/clienteService"
import { FuncionarioService } from "@/services/funcionarioService"
import { ProdutoService } from "@/services/produtoService"
import Image from "next/image"
import { useEffect, useState } from "react"
import Select from 'react-select'


interface IdProdutoEIdLinha {
  idProduto: number
  idLinha: number
}

export interface ValoresTotaisProps {
  valorTotal: number
  idLinha: number
}

let handleRepeticao: boolean = false

export default function CadastroVenda() {
  const { buscarTodosClientes } = ClienteService()
  const { buscarTodosFuncionarios } = FuncionarioService()
  const { buscarTodosProdutos } = ProdutoService()
  const { salvarPedido, deletarPedido } = PedidoService()

  const [erros, setErros] = useState<Erros[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [pedido, setPedido] = useState<Pedido>(estadoInicialPedido)
  const [idPedido, setIdPedido] = useState<number>(0)
  const [qtdLinha, setQtdLinha] = useState<number[]>([1])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [formasDePagamento, setFormasDePagamento] = useState<OpcoesSelecoes[]>([])
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

  const definirEstadoInicialSelecaoPedido = () => {
    setOpcaoSelecionadaCliente(estadoInicialOpcoesSelecoes)
    setOpcaoSelecionadaFuncionario(estadoInicialOpcoesSelecoes)
    setOpcaoSelecionadaFormaDePagamento(estadoInicialOpcoesSelecoes)
    setPedido({ ...pedido, observacao: '' })
  }

  useEffect(() => {
    setFormasDePagamento([
      { value: 'PIX', label: 'PIX' },
      { value: 'Transferência Bancária', label: 'Transferência Bancária' },
      { value: 'Dinheiro', label: 'Dinheiro' },
      { value: 'Cartão de débito', label: 'Cartão de Débito' },
      { value: 'Cartão de Crédito', label: 'Cartão de Crédito' },
      { value: 'Boleto Bancário', label: 'Boleto Bancário' },
    ])
  }, [])

  useEffect(() => {
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
      } catch (erro: any) {
        mensagemErro(erro.response.data)
      }
    }
    buscarTodos()
  }, [])

  useEffect(() => {
    setPedido(
      {
        ...pedido,
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
      await deletarPedido(idPedido)
      mensagemAlerta('Ocorreram erros. Por favor, refaça o Pedido.')
    }
    setQtdLinha([1])
    setOcorrenciasErros([])
    setValoresTotais([])
    definirEstadoInicialSelecaoPedido()
    setPedido(estadoInicialPedido)
    setIdPedido(0)
  }

  useEffect(() => {
    if (ocorrenciasErros.length === qtdLinha.length) {
      exibirResultados()
    }

  }, [ocorrenciasErros])

  const submit = async () => {
    if (!verificarIdProdutosComRepeticoes(idProdutoIdLinhaSelecionado)) {
      try {
        const response = await salvarPedido(pedido)
        setIdPedido(response.data.id)
        setErros([])
        setIdProdutoIdLinhaSelecionado([])
      } catch (error: any) {
        salvarErros(error, erros, setErros)
        mensagemErro('Erro no preenchimento dos campos.')
      }
    } else if (verificarIdProdutosComRepeticoes(idProdutoIdLinhaSelecionado)) {
      mensagemErro('Você selecionou Produtos repetidos. Selecione novamente para realizar a Venda.')
      setQtdLinha([1])
      setIdProdutoIdLinhaSelecionado([])
      setValoresTotais([])
      handleRepeticao = !handleRepeticao ? true : false
    }
  }

  const gerarMensagemAlertaProdutosAtivos = (produtosAtivos: Produto[]) => {
    let mensagem = ''
    if (produtos.length > 1 && produtosAtivos.length > 1) {
      mensagem = `Não é possível adicionar mais linhas, pois existem  
      ${produtos.length} produtos no total, mas apenas ${produtosAtivos.length} estão ativos.`
    } else if (produtos.length > 1 && produtosAtivos.length === 1) {
      mensagem = `Não é possível adicionar mais linhas, pois existem  
      ${produtos.length} produtos no total, mas apenas ${produtosAtivos.length} ativo.`
    } else if (produtos.length === 1) {
      mensagem = `Não é possível adicionar mais linhas, pois existe  
      ${produtos.length} produto no total, e ${produtosAtivos.length} ativo.`
    }
    return mensagem
  }

  const adicionarLinha = () => {
    const produtosAtivos = produtos.filter(p => p.statusProduto === 'ATIVO')
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
        idProdutoIdLinhaSelecionado.pop()
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

  const verificarIdProdutosComRepeticoes = (meuArray: IdProdutoEIdLinha[]): boolean => {
    const set = new Set(meuArray.map(item => item.idProduto))
    return set.size !== meuArray.length
  }

  return (
    <div className="div-form-container">
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
            options={formasDePagamento}
            instanceId="select-formaDePagamento"
          />
          {<ExibeErro erros={erros} nomeInput="formaDePagamento" />}
        </FormGroup>
        <FormGroup label="Observação:" htmlFor="observacao">
          <input
            value={pedido.observacao}
            onChange={(e) => { setErros([]); setPedido({ ...pedido, observacao: e.target.value }) }}
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
              idPedido={idPedido}
              qtdLinha={qtdLinha}
              setOcorrenciasErros={setOcorrenciasErros}
              atualizarIdProdutoIdLinhaSelecionado={atualizarIdProdutoIdLinhaSelecionado}
              handleRepeticao={handleRepeticao}
              valoresTotais={valoresTotais}
              setValoresTotais={setValoresTotais}
            />
          )
        })
        }
      </TabelaVenda>
      <div id="valor-total-pedido">
        <span>Total do Pedido</span>
        <span>
          {formatarParaReal(
            valoresTotais.reduce((acumulador, valor) => acumulador + valor.valorTotal, 0)
          )}
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
          onClick={submit}
          type="submit">
          Realizar Venda
        </button>
      </div>
    </div>
  )
}