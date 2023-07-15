import { Fornecedor } from '@/models/fornecedor'
import { Endereco, estadoInicialEndereco } from '../models/endereco'
import { EnderecoService } from '../services/enderecoService'
import { useEffect, useState } from 'react'
import { mensagemErro } from '@/models/toast'
import '../styles/cardListagem.css'

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
      <div className="info-principal">
        <div className='items'>
          <span id="info-title">Fornecedor</span>
          <div className='div-dados'>Nome</div>
          <div className='div-resultado'>{fornecedor.nome}</div>
          <div className='div-dados'>CNPJ</div>
          <div className='div-resultado'>{fornecedor.cnpj}</div>
          <div className='div-dados'>Telefone</div>
          <div className='div-resultado'>{fornecedor.telefone}</div>
          <div className='div-dados'>Data e Hora de Cadastro</div>
          <div className='div-resultado'>{fornecedor.dataHoraCadastro}</div>
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
    </div>
  )
}