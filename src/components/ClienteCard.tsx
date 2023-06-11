import { Cliente } from '@/models/cliente'
import { Endereco, estadoInicialEndereco } from '../models/endereco'
import { EnderecoService } from '../services/enderecoService'
import '../styles/cardListagem.css'
import { useEffect, useState } from 'react'
import { mensagemErro } from '@/models/toast'

export default function ClienteCard(cliente: Cliente) {

  const [enderecosState, setEnderecoState] = useState<Endereco>(estadoInicialEndereco)

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

  return (
    <div className="cardListagem-container">

      <span id="usuario">Cliente</span>
      <div className="info-usuario">

        <strong className="item">CPF: {cliente.cpf}</strong>
        <strong className="item">Nome: {cliente.nome}</strong>
        <strong className="item">Email: {cliente.email}</strong>
        <strong className="item">Telefone: {cliente.telefone}</strong>
        <strong className="item">
          Data e Hora de Cadastro: {cliente.dataHoraCadastro}
        </strong>
      </div>

      <span id="endereco">Endereço</span>
      <div className="info-endereco">

        <strong className="item">Rua: {enderecosState.rua}</strong>
        <strong className="item">CEP: {enderecosState.cep}</strong>
        <strong className="item">Número: {enderecosState.numero}</strong>
        <strong className="item">Bairro: {enderecosState.bairro}</strong>
        <strong className="item">Cidade: {enderecosState.cidade}</strong>
      </div>

    </div>
  )
}