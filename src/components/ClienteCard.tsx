import { Cliente } from '@/models/cliente'
import { mensagemErro, mensagemSucesso } from '@/models/toast'
import { ClienteService } from '@/services/clienteService'
import { Check, Edit, UserCheck, UserX, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Endereco, estadoInicialEndereco } from '../models/endereco'
import '../styles/cardListagem.css'
import { ConfirmarDecisao } from './ConfirmarDecisao'

interface ClienteCardProps {
  cliente: Cliente
  setClientes: Dispatch<SetStateAction<Cliente[]>>
}

export default function ClienteCard({ cliente, setClientes }: ClienteCardProps) {
  const router = useRouter()

  const [enderecosState, setEnderecoState] = useState<Endereco>(estadoInicialEndereco)

  const { buscarTodosClientes, alternarStatusCliente } = ClienteService()

  useEffect(() => {
    if (cliente.endereco) {
      setEnderecoState(cliente.endereco)
    }
  }, [])

  const handlerAlternar = () => {
    if (cliente.statusCliente === 'ATIVO') {
      ConfirmarDecisao(
        'Desativar Cliente',
        'Ao confirmar, o Cliente será marcado como inativo e suas informações ainda serão mantidas no sistema, mas ele não poderá realizar compras ou serviços e suas motos não poderão ser alvo de serviços. Deseja realmente desativar o Cliente?',
        () => {
          alternarStatus()
        }
      )
    } else if (cliente.statusCliente === 'INATIVO') {
      ConfirmarDecisao(
        'Ativar Cliente',
        'Ao confirmar, o Cliente será marcado como ativo e poderá realizar compras e serviços e suas motos poderão ser alvo de serviços normalmente. Deseja realmente ativar o Cliente?',
        () => {
          alternarStatus()
        })
    }
  }

  const alternarStatus = async () => {
    try {
      const statusResponse = await alternarStatusCliente(cliente.cpf)
      if (statusResponse.data === 'ATIVO') {
        mensagemSucesso('Cliente Ativado com sucesso.')
      } else if (statusResponse.data === 'INATIVO') {
        mensagemSucesso('Cliente Desativado com sucesso.')
      }
    } catch (error) {
      mensagemErro('Erro ao tentar definir o Status do Cliente.')
    }
    await atualizarListagem()
  }

  const atualizarListagem = async () => {
    try {
      const todosClientesResponse = await buscarTodosClientes()
      setClientes(todosClientesResponse.data)
    } catch (error) {
      mensagemErro('Erro ao tentar buscar todos Clientes.')
    }
  }

  const atualizar = () => {
    router.push(`/cliente/atualizar/${cliente.cpf}`)
  }

  return (
    <div className="cardListagem-container">
      <div className="info-principal">
        <div className='items'>
          <span id="info-title">Cliente</span>
          <div className='div-dados'>Nome</div>
          <div className='div-resultado'>{cliente.nome}</div>
          <div className='div-dados'>CPF</div>
          <div className='div-resultado'>{cliente.cpf}</div>
          <div className='div-dados'>Email</div>
          <div className='div-resultado'>{cliente.email}</div>
          <div className='div-dados'>Telefone</div>
          <div className='div-resultado'>{cliente.telefone}</div>

          <div className='div-dados'>Status do Cliente</div>
          {
            cliente.statusCliente === 'ATIVO' ? (
              <div style={{ color: 'green' }} className='div-resultado'>
                {cliente.statusCliente}
                <Check strokeWidth={3} />
              </div>
            ) : cliente.statusCliente === 'INATIVO' && (
              <div style={{ color: 'red' }} className='div-resultado'>
                {cliente.statusCliente}
                <X strokeWidth={3} />
              </div>
            )
          }

          <div className='div-dados'>Data e Hora de Cadastro</div>
          <div className='div-resultado'>{cliente.dataHoraCadastro}</div>
        </div>
        <div className='items'>
          <span id="info-title">Endereço</span>
          <div className='div-dados'>Logradouro</div>
          <div className='div-resultado'>{enderecosState.rua}</div>
          <div className='div-dados'>CEP</div>
          <div className='div-resultado'>{enderecosState.cep}</div>
          <div className='div-dados'>Número</div>
          <div className='div-resultado'>{enderecosState.numero}</div>
          <div className='div-dados'>Bairro</div>
          <div className='div-resultado'>{enderecosState.bairro}</div>
          <div className='div-dados'>Cidade</div>
          <div className='div-resultado'>{enderecosState.cidade}</div>
        </div>
      </div>
      <div className='icones-container'>
        <div onClick={atualizar} title='Editar'>
          <Edit className='icones-atualizacao-e-delecao' />
        </div>
        {
          cliente.statusCliente === 'ATIVO' ? (
            <div onClick={handlerAlternar} title='Desativar'>
              <UserX className='icones-atualizacao-e-delecao' />
            </div>
          ) : cliente.statusCliente === 'INATIVO' && (
            <div onClick={handlerAlternar} title='Ativar'>
              <UserCheck className='icones-atualizacao-e-delecao' />
            </div>
          )
        }
      </div>
    </div>
  )
}