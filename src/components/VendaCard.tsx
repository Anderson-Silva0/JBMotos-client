import { RegistroProdutoSelecionadoProps } from '@/app/venda/cadastro/page'
import { ProdutoPedido } from '@/models/ProdutoPedido'
import { Cliente, estadoInicialCliente } from '@/models/cliente'
import { formatarParaReal } from '@/models/formatadorReal'
import { Funcionario, estadoInicialFuncionario } from '@/models/funcionario'
import { Pedido } from '@/models/pedido'
import { Produto } from '@/models/produto'
import { mensagemErro } from '@/models/toast'
import { PedidoService } from '@/services/PedidoService'
import { ProdutoPedidoService } from '@/services/ProdutoPedidoService'
import { ClienteService } from '@/services/clienteService'
import { FuncionarioService } from '@/services/funcionarioService'
import { ProdutoService } from '@/services/produtoService'
import '@/styles/cardListagem.css'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { GeradorPDF, TipoRecibo } from './GeradorPDF'

export default function VendaCard(pedido: Pedido) {
  const router = useRouter()

  const { buscarClientePorCpf } = ClienteService()
  const { buscarFuncionarioPorCpf } = FuncionarioService()
  const { valorTotalDoPedido } = PedidoService()
  const { buscarTodosPorIdPedido } = ProdutoPedidoService()
  const { buscarProdutoPorId } = ProdutoService()

  const [clienteState, setClienteState] = useState<Cliente>(estadoInicialCliente)
  const [funcionarioState, setFuncionarioState] = useState<Funcionario>(estadoInicialFuncionario)
  const [valorTotal, setValorTotal] = useState<string>('')
  const [produtosVendaState, setProdutosVendaState] = useState<RegistroProdutoSelecionadoProps[]>([])

  const botaoVerProduto = useRef<HTMLButtonElement>(null)
  const cardListagemContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const buscar = async () => {
      try {
        const clienteResponse = await buscarClientePorCpf(pedido.cpfCliente)
        setClienteState(clienteResponse.data)

        const funcionarioResponse = await buscarFuncionarioPorCpf(pedido.cpfFuncionario)
        setFuncionarioState(funcionarioResponse.data)
      } catch (error: any) {
        mensagemErro(error.response.data)
      }
    }
    buscar()
  }, [])

  const handleOnClick = () => {
    if (botaoVerProduto.current && cardListagemContainer.current) {
      cardListagemContainer.current.style.cursor = 'wait'
      botaoVerProduto.current.style.cursor = 'wait'
    }

    const urlAtual = window.location.pathname
    router.push(`${urlAtual}/produtos/${pedido.id}`)
  }

  const obterNomeProduto = async (idProduto: number) => {
    const produtoResponse = await buscarProdutoPorId(idProduto)
    const produto = produtoResponse.data as Produto
    return produto.nome
  }

  useEffect(() => {
    const buscar = async () => {
      const valorTotalVendaResponse = await valorTotalDoPedido(pedido.id)
      setValorTotal(formatarParaReal(valorTotalVendaResponse.data))

      const produtosVendaResponse = await buscarTodosPorIdPedido(pedido.id)
      const produtosVenda = produtosVendaResponse.data as ProdutoPedido[]

      const registrosProdutosVenda = await Promise.all(
        produtosVenda.map(async (produtoVenda) => {
          const nomeProduto = await obterNomeProduto(produtoVenda.idProduto)

          return {
            idProduto: produtoVenda.idProduto,
            nomeProduto: nomeProduto,
            quantidade: produtoVenda.quantidade,
            valorUnidade: formatarParaReal(produtoVenda.valorUnidade),
            valorTotal: formatarParaReal(produtoVenda.valorTotal)
          } as RegistroProdutoSelecionadoProps
        })
      )

      setProdutosVendaState(registrosProdutosVenda)
    }
    buscar()
  }, [])

  return (
    <div ref={cardListagemContainer} className="cardListagem-container-venda">
      <span id="info-title-venda">Detalhes da Venda</span>
      <div className='container-items'>
        <div className='items'>
          <div className='div-dados'>Nome do Cliente</div>
          <div className='div-resultado'>{clienteState.nome}</div>
          <div className='div-dados'>CPF do Cliente</div>
          <div className='div-resultado'>{pedido.cpfCliente}</div>
          <div className='div-dados'>Nome do Funcionário</div>
          <div className='div-resultado'>{funcionarioState.nome}</div>
          <div className='div-dados'>CPF do Funcionário</div>
          <div className='div-resultado'>{pedido.cpfFuncionario}</div>
        </div>
        <div className='items'>
          <div className='div-dados'>Data e Hora de Cadastro da Venda</div>
          <div className='div-resultado'>{pedido.dataHoraCadastro}</div>
          <div className='div-dados'>Observação</div>
          <div className='div-resultado'>{pedido.observacao}</div>
          <div className='div-dados'>Forma de Pagamento</div>
          <div className='div-resultado'>{pedido.formaDePagamento}</div>
        </div>
      </div>
      <div className='botoes-container'>
        <button ref={botaoVerProduto} id='botao-ver-produtos' type="button" onClick={handleOnClick}>
          Ver Produtos
        </button>
        <GeradorPDF
          tipoRecibo={TipoRecibo.comprovante}
          nomeCliente={clienteState.nome}
          cpfCliente={pedido.cpfCliente}
          formaPagamento={pedido.formaDePagamento}
          nomeFuncionario={funcionarioState.nome}
          observacao={pedido.observacao}
          produtosVenda={produtosVendaState}
          valorTotalVenda={valorTotal}
          dataHoraVenda={pedido.dataHoraCadastro}
        />
      </div>
    </div>
  )
}