
import { ProdutoSelecionadoProps, RegistroProdutoSelecionadoProps, ValoresTotaisProps } from "@/app/venda/cadastro/page"
import { ProdutoPedido, estadoInicialProdutoPedido } from "@/models/ProdutoPedido"
import { Estoque, estadoInicialEstoque } from "@/models/estoque"
import { formatarParaReal } from "@/models/formatadorReal"
import { Produto, estadoInicialProduto } from '@/models/produto'
import { selectStylesVenda } from '@/models/selectStyles'
import { mensagemAlerta, mensagemErro } from "@/models/toast"
import { ProdutoPedidoService } from '@/services/ProdutoPedidoService'
import { EstoqueService } from "@/services/estoqueService"
import '@/styles/tabelaVenda.css'
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import Select from 'react-select'
import { removerProdutoOrcamento } from "./GeradorPDF"

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
  setProdutos: Dispatch<SetStateAction<Produto[]>>
  produtosSelecionados: ProdutoSelecionadoProps[]
  setProdutosSelecionados: Dispatch<SetStateAction<ProdutoSelecionadoProps[]>>
  registrosProdutosVenda: RegistroProdutoSelecionadoProps[]
  setRegistrosProdutosVenda: Dispatch<SetStateAction<RegistroProdutoSelecionadoProps[]>>
}

interface OpcaoSelecionadaProps {
  label: string
  produto: Produto
}

const estadoInicialOpcaoSelecionada: OpcaoSelecionadaProps = {
  label: 'Selecione...',
  produto: estadoInicialProduto
}

export function LinhaTabela(props: LinhaTabelaProps) {
  const { salvarProdutoPedido } = ProdutoPedidoService()
  const { buscarEstoquePorId } = EstoqueService()

  const [produtoAnterior, setProdutoAnterior] = useState<ProdutoSelecionadoProps>({
    idLinhaTabela: 0,
    produto: estadoInicialProduto
  })
  const [valorTotal, setValorTotal] = useState<number>(0)
  const [produtoPedido, setProdutoPedido] = useState<ProdutoPedido>(estadoInicialProdutoPedido)
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<OpcaoSelecionadaProps>(estadoInicialOpcaoSelecionada)
  const [estoqueProdutoSelecionado, setEstoqueProdutoSelecionado] = useState<Estoque>(estadoInicialEstoque)
  const [produtosAtivos, setProdutosAtivos] = useState<Produto[]>([])

  useEffect(() => {
    const buscarProdutosAtivos = () => {
      setProdutosAtivos(props.produtos.filter(p => p.statusProduto === 'ATIVO'))
    }
    if (props.produtos) {
      buscarProdutosAtivos()
    }
  }, [props.produtos])

  useEffect(() => {
    const atualizarProdutosSelecionados = () => {
      if (props.produtosSelecionados.length) {
        props.produtosSelecionados.map(produtoSelecionado => {
          if (produtoSelecionado.idLinhaTabela === props.idLinha) {
            if (produtoAnterior.produto.id !== opcaoSelecionada.produto.id) {
              let indice = props.produtosSelecionados.findIndex(produto => produto.idLinhaTabela === produtoSelecionado.idLinhaTabela)
              const produtoParaDevolver = props.produtosSelecionados[indice].produto
              if (!props.produtos.includes(produtoParaDevolver)) {
                props.setProdutos([...props.produtos, produtoParaDevolver])
              }
              const produtoExcluido = props.produtosSelecionados.splice(indice, 1)[0].produto
              removerProdutoOrcamento(props.registrosProdutosVenda, produtoExcluido)
            }
          }
        })
      }

      if (produtoAnterior.produto === estadoInicialProduto || produtoAnterior.produto !== opcaoSelecionada.produto) {
        const produtoSelecionado: ProdutoSelecionadoProps = {
          idLinhaTabela: props.idLinha,
          produto: opcaoSelecionada.produto
        }

        if (!props.produtosSelecionados.includes(produtoSelecionado)) {
          props.setProdutosSelecionados([...props.produtosSelecionados, produtoSelecionado])
          setProdutoAnterior(produtoSelecionado)
        }
      }
    }

    if (opcaoSelecionada.produto.id) {
      atualizarProdutosSelecionados()
    }
  }, [props.produtos])

  useEffect(() => {
    const removerProdutoSelecionado = () => {
      const produtosAtualizado = props.produtos.filter(produto => produto.id !== opcaoSelecionada.produto.id)
      props.setProdutos(produtosAtualizado)
    }

    if (opcaoSelecionada.produto.id) {
      removerProdutoSelecionado()
    }
  }, [opcaoSelecionada])

  useEffect(() => {
    if (opcaoSelecionada.produto.id) {
      props.atualizarIdProdutoIdLinhaSelecionado(opcaoSelecionada.produto.id, props.idLinha)
    }
    const verificarEstoque = async () => {
      const estoqueResponse = await buscarEstoquePorId(opcaoSelecionada.produto.idEstoque)
      setEstoqueProdutoSelecionado(estoqueResponse.data)
    }
    if (opcaoSelecionada.produto.id) {
      verificarEstoque()
    }
  }, [opcaoSelecionada.produto.id])

  useEffect(() => {
    const setQuantidadeInicial = () => {
      if (opcaoSelecionada.produto.id !== 0 && estoqueProdutoSelecionado.status !== 'INDISPONIVEL') {
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
      const total = Number(opcaoSelecionada?.produto.precoVenda) * produtoPedido.quantidade
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
  }, [produtoPedido.quantidade, opcaoSelecionada?.produto.precoVenda])

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
          idProduto: opcaoSelecionada.produto.id
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
    if (opcaoSelecionada.produto.id) {
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

  useEffect(() => {
    props.registrosProdutosVenda.forEach(produtoVenda => {
      if (opcaoSelecionada.produto.id === produtoVenda.idProduto) {
        const indice = props.registrosProdutosVenda.findIndex(objeto => objeto.idProduto === produtoVenda.idProduto)
        props.registrosProdutosVenda.splice(indice, 1)
      }
    })

    if (opcaoSelecionada.produto.id !== 0) {
      props.setRegistrosProdutosVenda([
        ...props.registrosProdutosVenda,
        {
          idProduto: opcaoSelecionada.produto.id,
          nomeProduto: opcaoSelecionada.label,
          quantidade: produtoPedido.quantidade,
          valorUnidade: formatarParaReal(opcaoSelecionada.produto.precoVenda),
          valorTotal: formatarParaReal(valorTotal)
        }
      ])
    }
  }, [valorTotal])

  return (
    <tr>
      <td id="col-NomeProduto">
        {
          <Select styles={selectStylesVenda}
            placeholder="Selecione..."
            value={opcaoSelecionada}
            onChange={(option: any) => setOpcaoSelecionada(option)}
            options={produtosAtivos.map(produto => ({
              label: produto.nome,
              produto: produto
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
      <td>{formatarParaReal(Number(opcaoSelecionada.produto.precoVenda))}</td>
      <td>{formatarParaReal(valorTotal)}</td>
    </tr>
  )
}