
import { ProdutoSelecionadoProps, ProdutoVendaIdLinhaProps, RegistroProdutoSelecionadoProps, ValoresTotaisProps } from "@/app/venda/cadastro/page"
import { ProdutoVenda, estadoInicialProdutoVenda } from "@/models/ProdutoVenda"
import { Estoque, estadoInicialEstoque } from "@/models/estoque"
import { formatarParaReal } from "@/models/formatadorReal"
import { Produto, estadoInicialProduto } from '@/models/produto'
import { selectStylesVenda } from '@/models/selectStyles'
import { mensagemAlerta } from "@/models/toast"
import { EstoqueService } from "@/services/estoqueService"
import '@/styles/tabelaVenda.css'
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import Select from 'react-select'
import { removerProdutoOrcamento } from "./GeradorPDF"

interface LinhaTabelaProps {
  idLinha: number
  produtos: Produto[]
  qtdLinha: number[]
  valoresTotais: ValoresTotaisProps[]
  setValoresTotais: Dispatch<SetStateAction<ValoresTotaisProps[]>>
  atualizarIdProdutoIdLinhaSelecionado: (idProduto: number, idLinhaAtual: number) => void
  setProdutos: Dispatch<SetStateAction<Produto[]>>
  produtosSelecionados: ProdutoSelecionadoProps[]
  setProdutosSelecionados: Dispatch<SetStateAction<ProdutoSelecionadoProps[]>>
  registrosProdutosVenda: RegistroProdutoSelecionadoProps[]
  setRegistrosProdutosVenda: Dispatch<SetStateAction<RegistroProdutoSelecionadoProps[]>>
  setProdutoVendaIdLinha: Dispatch<SetStateAction<ProdutoVendaIdLinhaProps[]>>
  produtoVendaIdLinha: ProdutoVendaIdLinhaProps[]
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

  const { buscarEstoquePorId } = EstoqueService()

  const [produtoAnterior, setProdutoAnterior] = useState<ProdutoSelecionadoProps>({
    idLinhaTabela: 0,
    produto: estadoInicialProduto
  })
  const [valorTotal, setValorTotal] = useState<number>(0)
  const [produtoVenda, setProdutoVenda] = useState<ProdutoVenda>(estadoInicialProdutoVenda)
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<OpcaoSelecionadaProps>(estadoInicialOpcaoSelecionada)
  const [estoqueProdutoSelecionado, setEstoqueProdutoSelecionado] = useState<Estoque>(estadoInicialEstoque)
  const [produtosAtivos, setProdutosAtivos] = useState<Produto[]>([])

  useEffect(() => {
    if (props.produtosSelecionados.length === 0) {
      setOpcaoSelecionada(estadoInicialOpcaoSelecionada)
      setProdutoVenda(estadoInicialProdutoVenda)
      setEstoqueProdutoSelecionado(estadoInicialEstoque)
      setProdutosAtivos([])
    }
  }, [props.produtosSelecionados])

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
        setProdutoVenda((prevState) => ({
          ...prevState,
          quantidade: 1
        }))
      } else {
        setProdutoVenda((prevState) => ({
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
      const total = Number(opcaoSelecionada?.produto.precoVenda) * produtoVenda.quantidade
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
  }, [produtoVenda.quantidade, opcaoSelecionada?.produto.precoVenda])

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
        setProdutoVenda({ ...produtoVenda, quantidade: novoValor < 1 ? 1 : novoValor })
      } else {
        setProdutoVenda({ ...produtoVenda, quantidade: 0 })
      }
    } else {
      setProdutoVenda({ ...produtoVenda, quantidade: novoValor < 0 ? 0 : novoValor })
    }
  }

  useEffect(() => {
    const addProdutosVendaList = () => {
      const { idLinha, produtoVendaIdLinha } = props

      const novoProdutoVenda = { ...produtoVenda }

      if (!novoProdutoVenda.idProduto || novoProdutoVenda.idProduto !== opcaoSelecionada.produto.id) {
        novoProdutoVenda.idProduto = opcaoSelecionada.produto.id
        novoProdutoVenda.valorUnidade = opcaoSelecionada.produto.precoVenda
      }

      const produtoIndex = produtoVendaIdLinha.findIndex(
        (produto) => produto.idLinha === idLinha
      )

      const newProdutoVendaIdLinha = [...produtoVendaIdLinha]

      if (produtoIndex !== -1) {
        newProdutoVendaIdLinha.splice(produtoIndex, 1, { produtoVenda: novoProdutoVenda, idLinha })
      } else {
        if (novoProdutoVenda.quantidade > 0) {
          newProdutoVendaIdLinha.push({ produtoVenda: novoProdutoVenda, idLinha })
        }
      }

      props.setProdutoVendaIdLinha(newProdutoVendaIdLinha)
    }

    addProdutosVendaList()
  }, [produtoVenda, opcaoSelecionada])

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
          quantidade: produtoVenda.quantidade,
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
          value={produtoVenda.quantidade}
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