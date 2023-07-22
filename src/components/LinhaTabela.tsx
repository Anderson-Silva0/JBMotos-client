
import { ChangeEvent, Dispatch, useEffect, useState, SetStateAction } from "react"
import Select from 'react-select'
import '@/styles/tabelaVenda.css'

import { ValoresTotaisProps } from "@/app/venda/cadastro/page"

import { ProdutoPedidoService } from '@/services/ProdutoPedidoService'

import { ProdutoPedido, estadoInicialProdutoPedido } from "@/models/ProdutoPedido"
import { selectStylesVenda } from '@/models/selectStyles'
import { Produto } from '@/models/produto'
import { formatarParaReal } from "@/models/formatadorReal"
import { mensagemAlerta, mensagemErro } from "@/models/toast"
import { EstoqueService } from "@/services/estoqueService"
import { Estoque, estadoInicialEstoque } from "@/models/estoque"


interface LinhaTabelaProps {
  idLinha: number
  produtos: Produto[]
  qtdLinha: number[]
  idPedido: number
  setOcorrenciasErros: Dispatch<SetStateAction<string[]>>
  handleRepeticao: boolean
  valoresTotais: ValoresTotaisProps[]
  setValoresTotais: Dispatch<SetStateAction<ValoresTotaisProps[]>>
  atualizarIdProdutoIdLinhaSelecionado: (idProduto: number, idLinhaAtual: number) => void
}

interface OpcaoSelecionadaProps {
  label: string
  idProduto: number
  valorUnidade: number
  idEstoqueProduto: number
}

const estadoInicialOpcaoSelecionada: OpcaoSelecionadaProps = {
  label: 'Selecione...',
  idProduto: 0,
  valorUnidade: 0,
  idEstoqueProduto: 0
}

export default function LinhaTabela(props: LinhaTabelaProps) {
  const { salvarProdutoPedido } = ProdutoPedidoService()
  const { buscarEstoquePorId } = EstoqueService()

  const [valorTotal, setValorTotal] = useState<number>(0)
  const [produtoPedido, setProdutoPedido] = useState<ProdutoPedido>(estadoInicialProdutoPedido)
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<OpcaoSelecionadaProps>(estadoInicialOpcaoSelecionada)
  const [estoqueProdutoSelecionado, setEstoqueProdutoSelecionado] = useState<Estoque>(estadoInicialEstoque)

  useEffect(() => {
    if (opcaoSelecionada.idProduto) {
      props.atualizarIdProdutoIdLinhaSelecionado(opcaoSelecionada.idProduto, props.idLinha)
    }
    const verificarEstoque = async () => {
      const estoqueResponse = await buscarEstoquePorId(opcaoSelecionada.idEstoqueProduto)
      setEstoqueProdutoSelecionado(estoqueResponse.data)
    }
    if (opcaoSelecionada.idProduto) {
      verificarEstoque()
    }
  }, [opcaoSelecionada.idProduto])

  useEffect(() => {
    const setQuantidadeInicial = () => {
      if (opcaoSelecionada.idProduto !== 0 && estoqueProdutoSelecionado.status !== 'INDISPONIVEL') {
        setProdutoPedido((prevState) => ({
          ...prevState,
          quantidade: 1
        }))
      } else {
        setProdutoPedido((prevState) => ({
          ...prevState,
          quantidade: 0
        }))
        if (opcaoSelecionada.label !== 'Selecione...') {
          mensagemAlerta(`${opcaoSelecionada.label} indisponível no estoque.`)
        }
      }
    }
    setQuantidadeInicial()
  }, [estoqueProdutoSelecionado])

  const atualizarValorTotal = (total: number) => {
    const novoArray = props.valoresTotais.map(item => {
      if (item.idLinha === props.idLinha) {
        return {
          ...item,
          valorTotal: total,
        }
      }
      return item
    })
    return novoArray
  }

  useEffect(() => {
    const calculo = () => {
      const total = Number(opcaoSelecionada?.valorUnidade) * produtoPedido.quantidade
      setValorTotal(total)
      if (total !== 0) {
        if (props.valoresTotais.some(item => item.idLinha === props.idLinha)) {
          const novoArray = atualizarValorTotal(total)
          props.setValoresTotais(novoArray)
        } else {
          props.setValoresTotais([...props.valoresTotais, { valorTotal: total, idLinha: props.idLinha }])
        }
      }
    }
    calculo()
  }, [produtoPedido.quantidade, opcaoSelecionada?.valorUnidade])

  useEffect(() => {
    setOpcaoSelecionada(estadoInicialOpcaoSelecionada)
    produtoPedido.quantidade = 0
  }, [props.handleRepeticao])

  useEffect(() => {
    const salvar = async () => {
      try {
        const produtoPedidoAtualizado = {
          ...produtoPedido,
          idPedido: props.idPedido,
          idProduto: opcaoSelecionada.idProduto
        }
        await salvarProdutoPedido(produtoPedidoAtualizado)
        props.setOcorrenciasErros(prevState => [...prevState, 'sucesso'])
      } catch (error: any) {
        props.setOcorrenciasErros(prevState => [...prevState, 'erro'])
        mostrarErrosProdutos(error)
      }
      definirEstadoInicialOpcoesProdutos()
      setOpcaoSelecionada(estadoInicialOpcaoSelecionada)
      setProdutoPedido(estadoInicialProdutoPedido)
    }
    if (props.idPedido !== 0) {
      salvar()
    }
  }, [props.idPedido])


  const mostrarErrosProdutos = (erro: any) => {
    const err = erro.response.data
    if (err.quantidade) {
      mensagemErro(err.quantidade)
    } else if (err.error) {
      const msgErro = 'Produto não encontrado para o Id informado.'
      err.error === msgErro ? (
        mensagemErro('Faltou Selecionar algum Produto.')
      ) : (
        mensagemErro(err.error)
      )
    }
  }

  const setPropQuantidade = (e: ChangeEvent<HTMLInputElement>) => {
    let novoValor = Number(e.target.value)
    if (novoValor > Number(estoqueProdutoSelecionado.quantidade) && estoqueProdutoSelecionado.status !== 'INDISPONIVEL'
    ) {
      novoValor = Number(estoqueProdutoSelecionado.quantidade)
      if (opcaoSelecionada.label !== 'Selecione...') {
        mensagemAlerta(`Limite de estoque atingido. Máximo de ${estoqueProdutoSelecionado.quantidade}
       unidades disponíveis para ${opcaoSelecionada.label}.`)
      }
    }
    if (opcaoSelecionada.idProduto) {
      if (estoqueProdutoSelecionado.status !== 'INDISPONIVEL') {
        setProdutoPedido({ ...produtoPedido, quantidade: novoValor < 1 ? 1 : novoValor })
      } else {
        setProdutoPedido({ ...produtoPedido, quantidade: 0 })
      }
    } else {
      setProdutoPedido({ ...produtoPedido, quantidade: novoValor < 0 ? 0 : novoValor })
    }
  }

  const definirEstadoInicialOpcoesProdutos = () => {
    setOpcaoSelecionada(estadoInicialOpcaoSelecionada)
  }

  return (
    <tr>
      <td id="col-NomeProduto">
        {
          <Select styles={selectStylesVenda}
            placeholder="Selecione..."
            value={opcaoSelecionada}
            onChange={(option: any) => setOpcaoSelecionada(option)}
            options={props.produtos.map(p => ({
              label: p.nome,
              idProduto: p.id,
              valorUnidade: p.precoVenda,
              idEstoqueProduto: p.idEstoque
            }) as OpcaoSelecionadaProps)}
            instanceId="select-idProduto"
            id="select-idProduto"
          />
        }
      </td>
      <td>
        <input
          value={produtoPedido.quantidade}
          onChange={(e) => setPropQuantidade(e)}
          type="number"
          name="quantidade"
          id="input-number-tabela"
          onWheel={(e) => e.currentTarget.blur()}
        />
      </td>
      <td>{formatarParaReal(Number(opcaoSelecionada.valorUnidade))}</td>
      <td>{formatarParaReal(valorTotal)}</td>
    </tr>
  )
}