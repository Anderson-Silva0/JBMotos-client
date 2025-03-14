import { RegistroProdutoSelecionadoProps } from '@/app/(pages)/venda/cadastro/page'
import { Cliente, estadoInicialCliente } from '@/models/cliente'
import { formatarParaReal } from '@/models/formatadorReal'
import { Funcionario, estadoInicialFuncionario } from '@/models/funcionario'
import { PagamentoCartao, estadoInicialPagamentoCartao } from '@/models/pagamentoCartao'
import { mensagemErro } from '@/models/toast'
import { Venda } from '@/models/venda'
import { VendaService } from '@/services/VendaService'
import '@/styles/cardListagem.css'
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { GeradorPDF, TipoRecibo } from './GeradorPDF'
import InfoCard from './InfoCard'

export default function VendaCard(venda: Venda) {
  const router = useRouter()

  const { valorTotalDaVenda } = VendaService()

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
        setClienteState(venda.cliente)
        setFuncionarioState(venda.funcionario)

        if (venda.pagamentoCartao && venda.formaDePagamento === "Cartão de Crédito") {
          setPagamentoCartao(venda.pagamentoCartao)
        }
      } catch (error: any) {
        mensagemErro(error.response.data)
      }
    }
    buscar()
  }, [])

  useEffect(() => {
    const buscar = async () => {
      if (venda.valorTotalVenda) {
        setValorTotal(formatarParaReal(venda.valorTotalVenda))
      }

      const produtosVenda = venda.produtosVenda
      const registrosProdutosVenda = produtosVenda.map(produtoVenda => {
        const produto = produtoVenda.produto
        return {
          idProduto: produto.id,
          nomeProduto: produto.nome,
          quantidade: produtoVenda.quantidade,
          valorUnidade: formatarParaReal(produtoVenda.valorUnidade),
          valorTotal: formatarParaReal(produtoVenda.valorTotal)
        } as RegistroProdutoSelecionadoProps
      })

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
          <div className='div-resultado'>{venda.cliente.cpf}</div>
          <div className='div-dados'>Nome do Funcionário</div>
          <div className='div-resultado'>{funcionarioState.nome}</div>
          <div className='div-dados'>CPF do Funcionário</div>
          <div className='div-resultado'>{venda.funcionario.cpf}</div>
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
          cpfCliente={venda.cliente.cpf}
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