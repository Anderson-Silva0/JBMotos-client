import { Cliente, estadoInicialCliente } from "@/models/cliente"
import { Moto } from "@/models/moto"
import { confirmarDecisao, mensagemErro, mensagemSucesso } from "@/models/toast"
import { ClienteService } from "@/services/clienteService"
import { MotoService } from "@/services/motoService"
import { Check, Edit, UserCheck, UserX, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import '../styles/cardListagem.css'

interface MotoCardProps {
  moto: Moto
  setMotos: Dispatch<SetStateAction<Moto[]>>
}

export default function MotoCard({ moto, setMotos }: MotoCardProps) {
  const router = useRouter()

  const [clienteState, setClienteState] = useState<Cliente>(estadoInicialCliente)

  const { buscarTodasMotos, alternarStatusMoto } = MotoService()
  const { buscarClientePorCpf } = ClienteService()

  useEffect(() => {
    async function buscar() {
      try {
        const response = await buscarClientePorCpf(moto.cpfCliente)
        setClienteState(response.data)
      } catch (error: any) {
        mensagemErro(error.response.data)
      }
    }
    buscar()
  }, [])

  const handlerAlternar = () => {
    if (moto.statusMoto === 'ATIVO') {
      confirmarDecisao(
        'Desativar Moto',
        'Ao confirmar, a Moto será marcada como inativa e não poderá ser alvo de serviços. Deseja realmente desativar a Moto?',
        () => {
          alternarStatus()
        }
      )
    } else if (moto.statusMoto === 'INATIVO') {
      confirmarDecisao(
        'Ativar Moto',
        'Ao confirmar, a Moto será marcada como ativa e poderá ser alvo de serviços normalmente. Deseja realmente ativar a Moto?',
        () => {
          alternarStatus()
        }
      )
    }
  }

  const alternarStatus = async () => {
    try {
      const statusResponse = await alternarStatusMoto(moto.id)
      if (statusResponse.data === 'ATIVO') {
        mensagemSucesso('Moto Ativada com sucesso.')
      } else if (statusResponse.data === 'INATIVO') {
        mensagemSucesso('Moto Desativada com sucesso.')
      }
    } catch (error) {
      mensagemErro('Erro ao tentar definir o Status da Moto.')
    }
    await atualizarListagem()
  }

  const atualizarListagem = async () => {
    try {
      const todasMotosResponse = await buscarTodasMotos()
      setMotos(todasMotosResponse.data)
    } catch (error) {
      mensagemErro('Erro ao tentar buscar todas Motos.')
    }
  }

  const atualizar = () => {
    router.push(`/moto/atualizar/${moto.id}`)
  }

  return (
    <div className="cardListagem-container">
      <div className="info-principal">
        <div className='items'>
          <span id="info-title">Moto</span>
          <div className='div-dados'>Placa</div>
          <div className='div-resultado'>{moto.placa}</div>
          <div className='div-dados'>Marca</div>
          <div className='div-resultado'>{moto.marca}</div>
          <div className='div-dados'>Modelo</div>
          <div className='div-resultado'>{moto.modelo}</div>
          <div className='div-dados'>Ano</div>
          <div className='div-resultado'>{moto.ano}</div>

          <div className='div-dados'>Status da Moto</div>
          {
            moto.statusMoto === 'ATIVO' ? (
              <div style={{ color: 'green' }} className='div-resultado'>
                {moto.statusMoto}
                <Check strokeWidth={3} />
              </div>
            ) : moto.statusMoto === 'INATIVO' && (
              <div style={{ color: 'red' }} className='div-resultado'>
                {moto.statusMoto}
                <X strokeWidth={3} />
              </div>
            )
          }

          <div className='div-dados'>Data e Hora de Cadastro</div>
          <div className='div-resultado'>{moto.dataHoraCadastro}</div>
        </div>
        <div className='items'>
          <span id="info-title">Proprietário</span>
          <div className='div-dados'>CPF</div>
          <div className='div-resultado'>{clienteState.cpf}</div>
          <div className='div-dados'>Nome</div>
          <div className='div-resultado'>{clienteState.nome}</div>
        </div>
      </div>
      <div className='icones-container'>
        <div onClick={atualizar} title='Editar'>
          <Edit className='icones-atualizacao-e-delecao' />
        </div>
        {
          moto.statusMoto === 'ATIVO' ? (
            <div onClick={handlerAlternar} title='Desativar'>
              <UserX className='icones-atualizacao-e-delecao' />
            </div>
          ) : moto.statusMoto === 'INATIVO' && (
            <div onClick={handlerAlternar} title='Ativar'>
              <UserCheck className='icones-atualizacao-e-delecao' />
            </div>
          )
        }
      </div>
    </div>
  )
}