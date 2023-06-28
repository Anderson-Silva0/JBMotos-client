import { Produto } from '@/models/produto'
import { Estoque, estadoInicialEstoque } from '../models/estoque'
import { EstoqueService } from '../services/estoqueService'
import '../styles/cardListagem.css'
import { useEffect, useState } from 'react'
import { mensagemErro } from '@/models/toast'
import { Fornecedor, estadoInicialFornecedor } from '@/models/fornecedor'
import { FornecedorService } from '@/services/fornecedorService'

export default function ProdutoCard(produto: Produto) {

  const [estoqueState, setEstoqueState] = useState<Estoque>(estadoInicialEstoque)
  const [fornecedorState, setFornecedorState] = useState<Fornecedor>(estadoInicialFornecedor)

  const { buscarEstoquePorId } = EstoqueService()
  const { buscarFornecedorPorCnpj } = FornecedorService()

  const formatCurrency = (value: number | string): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  useEffect(() => {
    async function buscar() {
      try {
        const estoqueResponse = await buscarEstoquePorId(produto.idEstoque)
        setEstoqueState(estoqueResponse.data)

        const fornecedorResponse = await buscarFornecedorPorCnpj(produto.cnpjFornecedor)
        setFornecedorState(fornecedorResponse.data)
      } catch (error: any) {
        mensagemErro(error.response.data)
      }
    }
    buscar()
  }, [])

  const lucroProduto = Number(produto.precoVenda) - Number(produto.precoCusto)

  return (
    <div className="cardListagem-container">
      <div className="info-principal">
        <div className='items'>
          <span id="info-title">Produto</span>
          <strong className="item">Nome: {produto.nome}</strong>
          <strong className="item">Preço de Custo: {formatCurrency(produto.precoCusto)}</strong>
          <strong className="item">Preço de Venda: {formatCurrency(produto.precoVenda)}</strong>
          <strong className="item">Lucro do Produto: {formatCurrency(lucroProduto)}</strong>
          <strong className="item">Marca: {produto.marca}</strong>
          <strong className="item">Fornecedor: {fornecedorState.nome}</strong>
        </div>
        
        <div className='items'>
          <span id="info-title">Estoque</span>
          <strong className="item">Estoque Mínimo: {estoqueState.estoqueMinimo}</strong>
          <strong className="item">Estoque Máximo: {estoqueState.estoqueMaximo}</strong>
          <strong className="item">Quantidade: {estoqueState.quantidade}</strong>

          {estoqueState.status === 'DISPONIVEL' ? (
            <strong className="item">Status Atual: <span style={{ color: 'green' }}>Disponível</span></strong>
          ) : estoqueState.status === 'INDISPONIVEL' ? (
            <strong className="item">Status Atual: <span style={{ color: 'red' }}>Indisponível</span></strong>
          ) : estoqueState.status === 'ESTOQUE_ALTO' ? (
            <strong className="item">Status Atual: <span style={{ color: 'orange' }}>Estoque Alto</span></strong>
          ) : estoqueState.status === 'ESTOQUE_BAIXO' && (
            <strong className="item">Status Atual: <span style={{ color: 'darkred' }}>Estoque Baixo</span></strong>
          )}
          <strong className="ghost-line">.</strong>
          <strong className="ghost-line">.</strong>
        </div>
      </div>
    </div>
  )
}