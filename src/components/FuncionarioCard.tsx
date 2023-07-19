import { Funcionario } from '@/models/funcionario'
import { Endereco, estadoInicialEndereco } from '../models/endereco'
import { EnderecoService } from '../services/enderecoService'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { confirmarDelecao, mensagemErro, mensagemSucesso } from '@/models/toast'
import { Check, DoorClosed, Edit, Trash2, UserCheck, X } from 'lucide-react'
import '../styles/cardListagem.css'
import { useRouter } from 'next/navigation'
import { FuncionarioService } from '@/services/funcionarioService'

interface FuncionarioCardProps {
  funcionario: Funcionario
  funcionarios: Funcionario[]
  setFuncionarios: Dispatch<SetStateAction<Funcionario[]>>
}

export default function FuncionarioCard({ funcionario, funcionarios, setFuncionarios }: FuncionarioCardProps) {
  const router = useRouter()

  const [enderecosState, setEnderecoState] = useState<Endereco>(estadoInicialEndereco)

  const { buscarTodosFuncionarios, alternarStatusFuncionario } = FuncionarioService()
  const { buscarEnderecoPorId } = EnderecoService()

  useEffect(() => {
    async function buscar() {
      try {
        const response = await buscarEnderecoPorId(funcionario.endereco)
        setEnderecoState(response.data)
      } catch (error: any) {
        mensagemErro(error.response.data)
      }
    }
    buscar()
  }, [])

  const handlerAlternar = () => {
    if (funcionario.statusFuncionario === 'ATIVO') {
      confirmarDelecao('Desativar Funcionário',
        'Ao confirmar, o Funcionário será marcado como inativo e suas informações ainda serão mantidas no sistema, mas ele não poderá realizar serviços ou vendas até que seja reativado. Deseja realmente desativar o Funcionário?',
        () => {
          alternarStatus()
        })
    } else if (funcionario.statusFuncionario === 'INATIVO') {
      confirmarDelecao('Ativar Funcionário',
        'Ao confirmar, o Funcionário será marcado como ativo e poderá realizar serviços e vendas normalmente. Deseja realmente ativar o Funcionário?',
        () => {
          alternarStatus()
        })
    }
  }

  const alternarStatus = async () => {
    try {
      const statusResponse = await alternarStatusFuncionario(funcionario.cpf)
      if (statusResponse.data === 'ATIVO') {
        mensagemSucesso('Funcionário Ativado com sucesso.')
      } else if (statusResponse.data === 'INATIVO') {
        mensagemSucesso('Funcionário Desativado com sucesso.')
      }
    } catch (error) {
      mensagemErro('Erro ao tentar definir o Status do Funcionário.')
    }
    await atualizarFuncionarios()
  }

  const atualizarFuncionarios = async () => {
    try {
      const todosFuncionariosResponse = await buscarTodosFuncionarios()
      setFuncionarios(todosFuncionariosResponse.data)
    } catch (error) {
      mensagemErro('Erro ao tentar buscar todos Funcionários.')
    }
  }

  const atualizar = () => {
    router.push(`/funcionario/atualizar/${funcionario.cpf}`)
  }

  return (
    <div className="cardListagem-container">
      <div className="info-principal">
        <div className='items'>
          <span id="info-title">Funcionário</span>
          <div className='div-dados'>Nome</div>
          <div className='div-resultado'>{funcionario.nome}</div>
          <div className='div-dados'>CPF</div>
          <div className='div-resultado'>{funcionario.cpf}</div>
          <div className='div-dados'>Telefone</div>
          <div className='div-resultado'>{funcionario.telefone}</div>

          <div className='div-dados'>Status do Funcionário</div>
          {
            funcionario.statusFuncionario === 'ATIVO' ? (
              <div style={{ color: 'green' }} className='div-resultado'>
                {funcionario.statusFuncionario}
                <Check strokeWidth={3} />
              </div>
            ) : funcionario.statusFuncionario === 'INATIVO' && (
              <div style={{ color: 'red' }} className='div-resultado'>
                {funcionario.statusFuncionario}
                <X strokeWidth={3} />
              </div>
            )
          }

          <div className='div-dados'>Data e Hora de Cadastro</div>
          <div className='div-resultado'>{funcionario.dataHoraCadastro}</div>
        </div>
        <div className='items'>
          <span id="info-title">Endereço</span>
          <div className='div-dados'>Endereço</div>
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
          funcionario.statusFuncionario === 'ATIVO' ? (
            <div onClick={handlerAlternar} title='Desativar'>
              <Trash2 className='icones-atualizacao-e-delecao' />
            </div>
          ) : funcionario.statusFuncionario === 'INATIVO' && (
            <div onClick={handlerAlternar} title='Ativar'>
              <UserCheck className='icones-atualizacao-e-delecao' />
            </div>
          )
        }

      </div>
    </div>
  )
}