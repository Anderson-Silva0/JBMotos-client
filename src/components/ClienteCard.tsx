import { Cliente } from '@/models/cliente'
import { Endereco, estadoInicialEndereco } from '../models/endereco'
import { EnderecoService } from '../services/enderecoService'
import '../styles/cardListagem.css'
import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { confirmarDelecao, mensagemErro, mensagemSucesso } from '@/models/toast'
import { Edit, Trash2 } from 'lucide-react'
import { ClienteService } from '@/services/clienteService'
import { useRouter } from 'next/navigation'

interface ClienteCardProps {
  cliente: Cliente
  clientes: Cliente[]
  setClientes: Dispatch<SetStateAction<Cliente[]>>
}

export default function ClienteCard({ cliente, clientes, setClientes }: ClienteCardProps) {
  const router = useRouter()

  const [enderecosState, setEnderecoState] = useState<Endereco>(estadoInicialEndereco)

  const { deletarCliente } = ClienteService()
  const { buscarEnderecoPorId } = EnderecoService()

  useEffect(() => {
    async function buscar() {
      try {
        const response = await buscarEnderecoPorId(cliente.endereco)
        setEnderecoState(response.data)
      } catch (error: any) {
        mensagemErro(error.response.data)
      }
    }
    buscar()
  }, [])

  const handlerDeletar = () => {
    confirmarDelecao(() => {
      deletar()
    })
  }

  const deletar = async () => {
    try {
      await deletarCliente(cliente.cpf)
      setClientes(clientes.filter(c => c.cpf !== cliente.cpf))
      mensagemSucesso('Cliente deletado com sucesso.')
    } catch (error) {
      mensagemErro('Erro ao tentar deletar Cliente.')
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
          <div className='div-dados'>Data e Hora de Cadastro</div>
          <div className='div-resultado'>{cliente.dataHoraCadastro}</div>
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
        <div onClick={handlerDeletar} title='Deletar'>
          <Trash2 className='icones-atualizacao-e-delecao' />
        </div>
      </div>
    </div>
  )
}