import { Produto } from '@/models/produto'
import { Estoque, estadoInicialEstoque } from '../models/estoque'
import { EstoqueService } from '../services/estoqueService'
import '../styles/cardListagem.css'
import { useEffect, useState } from 'react'
import { mensagemErro } from '@/models/toast'
import { Fornecedor, estadoInicialFornecedor } from '@/models/fornecedor'
import { FornecedorService } from '@/services/fornecedorService'
import { formatarParaReal } from '@/models/formatadorReal'

export default function ProdutoCard(produto: Produto) {

  const [estoqueState, setEstoqueState] = useState<Estoque>(estadoInicialEstoque)
  const [fornecedorState, setFornecedorState] = useState<Fornecedor>(estadoInicialFornecedor)

  const { buscarEstoquePorId } = EstoqueService()
  const { buscarFornecedorPorCnpj } = FornecedorService()

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
          <div className='div-dados'>Nome</div>
          <div className='div-resultado'>{produto.nome}</div>
          <div className='div-dados'>Preço de Custo</div>
          <div className='div-resultado'>{formatarParaReal(produto.precoCusto)}</div>
          <div className='div-dados'>Preço de Venda</div>
          <div className='div-resultado'>{formatarParaReal(produto.precoVenda)}</div>
          <div className='div-dados'>Lucro do Produto</div>
          <div className='div-resultado'>{formatarParaReal(lucroProduto)}</div>
          <div className='div-dados'>Marca</div>
          <div className='div-resultado'>{produto.marca}</div>
          <div className='div-dados'>Fornecedor</div>
          <div className='div-resultado'>{fornecedorState.nome}</div>
        </div>
        <div className='items'>
          <span id="info-title">Estoque</span>
          <div className='div-dados'>Estoque Mínimo</div>
          <div className='div-resultado'>{estoqueState.estoqueMinimo}</div>
          <div className='div-dados'>Estoque Máximo</div>
          <div className='div-resultado'>{estoqueState.estoqueMaximo}</div>
          <div className='div-dados'>Quantidade</div>
          <div className='div-resultado'>{estoqueState.quantidade}</div>
          <div className='div-dados'>Status Atual</div>
          <div className='div-resultado'>
            {estoqueState.status === 'DISPONIVEL' ? (
              <strong className="item"><span style={{ color: 'green' }}>Disponível</span></strong>
            ) : estoqueState.status === 'INDISPONIVEL' ? (
              <strong className="item"><span style={{ color: 'red' }}>Indisponível</span></strong>
            ) : estoqueState.status === 'ESTOQUE_ALTO' ? (
              <strong className="item"><span style={{ color: 'orange' }}>Estoque Alto</span></strong>
            ) : estoqueState.status === 'ESTOQUE_BAIXO' && (
              <strong className="item"><span style={{ color: 'darkred' }}>Estoque Baixo</span></strong>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}