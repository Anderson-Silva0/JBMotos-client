import { Fornecedor } from '@/models/fornecedor'
import { Endereco, estadoInicialEndereco } from '../models/endereco'
import { EnderecoService } from '../services/enderecoService'
import '../styles/cardListagem.css'
import { useEffect, useState } from 'react'
import { mensagemErro } from '@/models/toast'

export default function FornecedorCard(fornecedor: Fornecedor) {

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

  return (
    <div className="cardListagem-container">

      <span id="usuario">Fornecedor</span>
      <div className="info-usuario">

        <strong className="item">CNPJ: {fornecedor.cnpj}</strong>
        <strong className="item">Nome: {fornecedor.nome}</strong>
        <strong className="item">Telefone: {fornecedor.telefone}</strong>
        <strong className="item">
          Data e Hora de Cadastro: {fornecedor.dataHoraCadastro}
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