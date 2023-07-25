import { Fornecedor } from '@/models/fornecedor'
import { Endereco, estadoInicialEndereco } from '../models/endereco'
import { EnderecoService } from '../services/enderecoService'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { confirmarDecisao, mensagemErro, mensagemSucesso } from '@/models/toast'
import { Check, Edit, UserCheck, UserX, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import '../styles/cardListagem.css'
import { FornecedorService } from '@/services/fornecedorService'

interface FornecedorCardProps {
  fornecedor: Fornecedor
  setFornecedores: Dispatch<SetStateAction<Fornecedor[]>>
}

export default function FornecedorCard({ fornecedor, setFornecedores }: FornecedorCardProps) {
  const router = useRouter()

  const { buscarTodosFornecedores, alternarStatusFornecedor } = FornecedorService()
  const [enderecosState, setEnderecoState] = useState<Endereco>(estadoInicialEndereco)

  const { buscarEnderecoPorId } = EnderecoService()

  useEffect(() => {
    async function buscar() {
      try {
        const response = await buscarEnderecoPorId(fornecedor.endereco)
        setEnderecoState(response.data)
      } catch (error: any) {
        mensagemErro(error.response.data)
      }
    }
    buscar()
  }, [])

  const handlerAlternar = () => {
    if (fornecedor.statusFornecedor === 'ATIVO') {
      confirmarDecisao(
        'Desativar Fornecedor',
        'Ao confirmar, o Fornecedor será marcado como inativo e seus produtos e informações ainda serão mantidos no sistema, mas ele não poderá fornecer produtos até que seja reativado. Deseja realmente desativar o Fornecedor?',
        () => {
          alternarStatus()
        }
      )
    } else if (fornecedor.statusFornecedor === 'INATIVO') {
      confirmarDecisao(
        'Ativar Fornecedor',
        'Ao confirmar, o Fornecedor será marcado como ativo e poderá fornecer produtos normalmente. Deseja realmente ativar o Fornecedor?',
        () => {
          alternarStatus()
        }
      )
    }
  }

  const alternarStatus = async () => {
    try {
      const statusResponse = await alternarStatusFornecedor(fornecedor.cnpj)
      if (statusResponse.data === 'ATIVO') {
        mensagemSucesso('Fornecedor Ativado com sucesso.')
      } else if (statusResponse.data === 'INATIVO') {
        mensagemSucesso('Fornecedor Desativado com sucesso.')
      }
    } catch (error) {
      mensagemErro('Erro ao tentar definir o Status do Fornecedor.')
    }
    await atualizarListagem()
  }

  const atualizarListagem = async () => {
    try {
      const todosFornecedoresResponse = await buscarTodosFornecedores()
      setFornecedores(todosFornecedoresResponse.data)
    } catch (error) {
      mensagemErro('Erro ao tentar buscar todos Fornecedores.')
    }
  }

  const atualizar = () => {
    router.push(`/fornecedor/atualizar/${encodeURIComponent(fornecedor.cnpj)}`)
  }

  return (
    <div className="cardListagem-container">
      <div className="info-principal">
        <div className='items'>
          <span id="info-title">Fornecedor</span>
          <div className='div-dados'>Nome</div>
          <div className='div-resultado'>{fornecedor.nome}</div>
          <div className='div-dados'>CNPJ</div>
          <div className='div-resultado'>{fornecedor.cnpj}</div>
          <div className='div-dados'>Telefone</div>
          <div className='div-resultado'>{fornecedor.telefone}</div>

          <div className='div-dados'>Status do Fornecedor</div>
          {
            fornecedor.statusFornecedor === 'ATIVO' ? (
              <div style={{ color: 'green' }} className='div-resultado'>
                {fornecedor.statusFornecedor}
                <Check strokeWidth={3} />
              </div>
            ) : fornecedor.statusFornecedor === 'INATIVO' && (
              <div style={{ color: 'red' }} className='div-resultado'>
                {fornecedor.statusFornecedor}
                <X strokeWidth={3} />
              </div>
            )
          }

          <div className='div-dados'>Data e Hora de Cadastro</div>
          <div className='div-resultado'>{fornecedor.dataHoraCadastro}</div>
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
          fornecedor.statusFornecedor === 'ATIVO' ? (
            <div onClick={handlerAlternar} title='Desativar'>
              <UserX className='icones-atualizacao-e-delecao' />
            </div>
          ) : fornecedor.statusFornecedor === 'INATIVO' && (
            <div onClick={handlerAlternar} title='Ativar'>
              <UserCheck className='icones-atualizacao-e-delecao' />
            </div>
          )
        }
      </div>
    </div>
  )
}