import { Cliente, estadoInicialCliente } from '@/models/cliente'
import { formatarParaReal } from '@/models/formatadorReal'
import { Funcionario, estadoInicialFuncionario } from '@/models/funcionario'
import { mensagemErro } from '@/models/toast'
import { VendaService } from '@/services/VendaService'
import { ClienteService } from '@/services/clienteService'
import { FuncionarioService } from '@/services/funcionarioService'
import '@/styles/cardListagem.css'
import { Edit, PackageSearch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Servico } from '@/models/servico'

export default function ServicoCard(servico: Servico) {
  const router = useRouter()

  const { buscarClientePorCpf } = ClienteService()
  const { buscarFuncionarioPorCpf } = FuncionarioService()
  const { valorTotalDaVenda } = VendaService()

  const [clienteState, setClienteState] = useState<Cliente>(estadoInicialCliente)
  const [funcionarioState, setFuncionarioState] = useState<Funcionario>(estadoInicialFuncionario)
  const [valorTotalVendaState, setValorTotalVendaState] = useState<string>('')

  const botaoVerProduto = useRef<HTMLButtonElement>(null)
  const cardListagemContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const buscar = async () => {
      try {
        const clienteResponse = await buscarClientePorCpf(servico.moto.cpfCliente)
        setClienteState(clienteResponse.data)

        const funcionarioResponse = await buscarFuncionarioPorCpf(servico.cpfFuncionario)
        setFuncionarioState(funcionarioResponse.data)

        if (servico.venda) {
          const valorTotalVendaResponse = await valorTotalDaVenda(servico.venda.id)
          setValorTotalVendaState(valorTotalVendaResponse.data)
        }
      } catch (error: any) {
        mensagemErro(error.response.data)
      }
    }
    buscar()
  }, [])

  const listarProdutosVenda = () => {
    if (botaoVerProduto.current && cardListagemContainer.current) {
      cardListagemContainer.current.style.cursor = 'wait'
      botaoVerProduto.current.style.cursor = 'wait'
    }

    if (servico.venda) {
      router.push(`/venda/listar/produtos/${servico.venda.id}`)
    }
  }

  return (
    <div className="cardListagem-container-venda">
      <span id="info-title-venda">Detalhes do Serviço</span>
      {/* <div className='div-btn-edit' onClick={atualizar} title='Editar'> */}
      <div className='div-btn-edit' title='Editar'>
        <Edit className='icones-atualizacao-e-delecao' />
      </div>
      <div className='container-items'>
        <div className='items'>
          <div className='div-dados'>Nome do Cliente</div>
          <div className='div-resultado'>{clienteState.nome}</div>
          <div className='div-dados'>CPF do Cliente</div>
          <div className='div-resultado'>{clienteState.cpf}</div>
          <div className='div-dados'>Nome do Funcionário</div>
          <div className='div-resultado'>{funcionarioState.nome}</div>
          <div className='div-dados'>CPF do Funcionário</div>
          <div className='div-resultado'>{funcionarioState.cpf}</div>
          <div className='div-dados'>Data e Hora de Cadastro do Serviço</div>
          <div className='div-resultado'>{servico.dataHoraCadastro}</div>
        </div>
        <div className='items'>
          <div className='div-dados'>Motocicleta</div>
          <div className='div-resultado'>{servico.moto.marca} {servico.moto.modelo} <span style={{ fontWeight: 'bolder' }}>[ {servico.moto.placa} ]</span></div>
          <div className='div-dados' style={!servico.observacao ? { display: 'none' } : undefined}>Observação</div>
          <div className='div-resultado'>{servico.observacao}</div>
          <div className='div-dados'>Preço de Mão de Obra</div>
          <div className='div-resultado'>{formatarParaReal(servico.precoMaoDeObra)}</div>
          <div className='div-dados'>Serviços realizados</div>
          <div className='div-resultado'>{servico.servicosRealizados}</div>
          {
            servico.venda && (
              <>
                <div className='div-dados' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    Preço da Venda
                  </div>
                  <div title='Ver Produtos da Venda' onClick={listarProdutosVenda}>
                    <PackageSearch width={30} height={30} style={{ cursor: 'pointer' }} />
                  </div>
                </div>
                <div className='div-resultado'>{formatarParaReal(valorTotalVendaState)}</div>
                <div className='div-dados'>Total do Serviço</div>
                <div className='div-resultado'>{formatarParaReal(valorTotalVendaState + servico.precoMaoDeObra)}</div>
              </>
            )
          }
        </div>
      </div>
    </div >
  )
}