import { RegistroProdutoSelecionadoProps } from '@/app/(pages)/venda/cadastro/page'
import { ProdutoVenda } from '@/models/ProdutoVenda'
import { Cliente, estadoInicialCliente } from '@/models/cliente'
import { formatarParaReal } from '@/models/formatadorReal'
import { Funcionario, estadoInicialFuncionario } from '@/models/funcionario'
import { PagamentoCartao, estadoInicialPagamentoCartao } from '@/models/pagamentoCartao'
import { Produto } from '@/models/produto'
import { mensagemErro } from '@/models/toast'
import { Venda } from '@/models/venda'
import { ProdutoVendaService } from '@/services/ProdutoVendaService'
import { VendaService } from '@/services/VendaService'
import { ClienteService } from '@/services/clienteService'
import { FuncionarioService } from '@/services/funcionarioService'
import { PagamentoCartaoService } from '@/services/pagamentoCartaoService'
import { ProdutoService } from '@/services/produtoService'
import '@/styles/cardListagem.css'
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { GeradorPDF, TipoRecibo } from './GeradorPDF'
import InfoCard from './InfoCard'

export default function VendaCard(venda: Venda) {
  const router = useRouter()

  const { buscarClientePorCpf } = ClienteService()
  const { buscarFuncionarioPorCpf } = FuncionarioService()
  const { valorTotalDaVenda } = VendaService()
  const { buscarTodosPorIdVenda } = ProdutoVendaService()
  const { buscarProdutoPorId } = ProdutoService()
  const { buscarPagamentoCartaoPorIdVenda } = PagamentoCartaoService()

  const [clienteState, setClienteState] = useState<Cliente>(estadoInicialCliente)
  const [funcionarioState, setFuncionarioState] = useState<Funcionario>(estadoInicialFuncionario)
  const [valorTotal, setValorTotal] = useState<string>('')
  const [produtosVendaState, setProdutosVendaState] = useState<RegistroProdutoSelecionadoProps[]>([])
  const [pagamentoCartao, setPagamentoCartao] = useState<PagamentoCartao>(estadoInicialPagamentoCartao)

  const botaoVerProduto = useRef<HTMLButtonElement>(null)
  const cardListagemContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const buscar = async () => {
      try {
        const clienteResponse = await buscarClientePorCpf(venda.cpfCliente)
        setClienteState(clienteResponse.data)

        const funcionarioResponse = await buscarFuncionarioPorCpf(venda.cpfFuncionario)
        setFuncionarioState(funcionarioResponse.data)

        if (venda.formaDePagamento === "Cartão de Crédito") {
          const pagamentoCartaoResponse = await buscarPagamentoCartaoPorIdVenda(venda.id)
          setPagamentoCartao(pagamentoCartaoResponse.data)
        }
      } catch (error: any) {
        mensagemErro(error.response.data)
      }
    }
    buscar()
  }, [])

  const obterNomeProduto = async (idProduto: number) => {
    const produtoResponse = await buscarProdutoPorId(idProduto)
    const produto = produtoResponse.data as Produto
    return produto.nome
  }

  useEffect(() => {
    const buscar = async () => {
      const valorTotalVendaResponse = await valorTotalDaVenda(venda.id)
      setValorTotal(formatarParaReal(valorTotalVendaResponse.data))

      const produtosVendaResponse = await buscarTodosPorIdVenda(venda.id)
      const produtosVenda = produtosVendaResponse.data as ProdutoVenda[]

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

  const listarProdutosVenda = () => {
    if (botaoVerProduto.current && cardListagemContainer.current) {
      cardListagemContainer.current.style.cursor = 'wait'
      botaoVerProduto.current.style.cursor = 'wait'
    }

    const urlAtual = window.location.pathname
    router.push(`${urlAtual}/produtos/${venda.id}`)
  }

  const [mostrarInfo, setMostrarInfo] = useState(false)

  const HandleOnMouseLeave = () => {
    setMostrarInfo(false)
  }
  const HandleOnMouseMove = () => {
    setMostrarInfo(true)
  }

  return (
    <div ref={cardListagemContainer} className="cardListagem-container-venda">
      <span id="info-title-venda">Detalhes da Venda</span>
      <div className='container-items'>
        <div className='items'>
          <div className='div-dados'>Nome do Cliente</div>
          <div className='div-resultado'>{clienteState.nome}</div>
          <div className='div-dados'>CPF do Cliente</div>
          <div className='div-resultado'>{venda.cpfCliente}</div>
          <div className='div-dados'>Nome do Funcionário</div>
          <div className='div-resultado'>{funcionarioState.nome}</div>
          <div className='div-dados'>CPF do Funcionário</div>
          <div className='div-resultado'>{venda.cpfFuncionario}</div>
        </div>
        <div className='items'>
          <div className='div-dados'>Data e Hora de Cadastro da Venda</div>
          <div className='div-resultado'>{venda.dataHoraCadastro}</div>
          <div className='div-dados' style={!venda.observacao ? { display: 'none' } : undefined}>Observação</div>
          <div className='div-resultado'>{venda.observacao}</div>

          <div className='div-dados'>Forma de Pagamento</div>
          <div className='div-resultado'>
            {venda.formaDePagamento}
            {
              venda.formaDePagamento === "Cartão de Crédito" && (
                <div id='div-infocard'>
                  {

                    <Info
                      className='icone-info'
                      strokeWidth={3}
                      onMouseMove={HandleOnMouseMove}
                      onMouseLeave={HandleOnMouseLeave}
                    />
                  }
                  {
                    mostrarInfo && <InfoCard pagamentoCartao={pagamentoCartao} />
                  }
                </div>
              )
            }
          </div>
        </div>
      </div>
      <div className='botoes-container'>
        <button ref={botaoVerProduto} id='botao-ver-produtos' type="button" onClick={listarProdutosVenda}>
          Ver Produtos
        </button>
        <GeradorPDF
          tipoRecibo={TipoRecibo.comprovante}
          nomeCliente={clienteState.nome}
          cpfCliente={venda.cpfCliente}
          formaPagamento={venda.formaDePagamento}
          nomeFuncionario={funcionarioState.nome}
          observacao={venda.observacao}
          produtosVenda={produtosVendaState}
          valorTotalVenda={valorTotal}
          dataHoraVenda={venda.dataHoraCadastro}
        />
      </div>
    </div>
  )
}