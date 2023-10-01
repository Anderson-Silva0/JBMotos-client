import { Estoque, estadoInicialEstoque } from '@/models/estoque'
import { formatarParaReal } from '@/models/formatadorReal'
import { Fornecedor, estadoInicialFornecedor } from '@/models/fornecedor'
import { Produto } from '@/models/produto'
import { mensagemErro, mensagemSucesso } from '@/models/toast'
import { EstoqueService } from '@/services/estoqueService'
import { FornecedorService } from '@/services/fornecedorService'
import { ProdutoService } from '@/services/produtoService'
import { Check, CheckSquare, Edit, X, XSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import '../styles/cardListagem.css'
import { ConfirmarDecisao } from './ConfirmarDecisao'

interface ProdutoCardProps {
  produto: Produto
  setProdutos: Dispatch<SetStateAction<Produto[]>>
}

export default function ProdutoCard({ produto, setProdutos }: ProdutoCardProps) {
  const router = useRouter()

  const [estoqueState, setEstoqueState] = useState<Estoque>(estadoInicialEstoque)
  const [fornecedorState, setFornecedorState] = useState<Fornecedor>(estadoInicialFornecedor)

  const { buscarEstoquePorId } = EstoqueService()
  const { buscarFornecedorPorCnpj } = FornecedorService()
  const { buscarTodosProdutos, alternarStatusProduto } = ProdutoService()

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

  const handlerAlternar = () => {
    if (produto.statusProduto === 'ATIVO') {
      ConfirmarDecisao(
        'Desativar Produto',
        'Ao confirmar, o Produto será marcado como inativo e não poderá ser vendido ou utilizado em serviços. Deseja realmente desativar o Produto?',
        () => {
          alternarStatus()
        }
      )
    } else if (produto.statusProduto === 'INATIVO') {
      ConfirmarDecisao(
        'Ativar Produto',
        'Ao confirmar, o Produto será marcado como ativo e poderá ser vendido e utilizado em serviços normalmente. Deseja realmente ativar o Produto?',
        () => {
          alternarStatus()
        }
      )
    }
  }

  const alternarStatus = async () => {
    try {
      const statusResponse = await alternarStatusProduto(produto.id)
      if (statusResponse.data === 'ATIVO') {
        mensagemSucesso('Produto Ativado com sucesso.')
      } else if (statusResponse.data === 'INATIVO') {
        mensagemSucesso('Produto Desativado com sucesso.')
      }
    } catch (error) {
      mensagemErro('Erro ao tentar definir o Status do Produto.')
    }
    await atualizarListagem()
  }

  const atualizarListagem = async () => {
    try {
      const todosProdutosResponse = await buscarTodosProdutos()
      setProdutos(todosProdutosResponse.data)
    } catch (error) {
      mensagemErro('Erro ao tentar buscar todos Produtos.')
    }
  }

  const atualizar = () => {
    router.push(`/produto/atualizar/${produto.id}`)
  }

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
          <div className='div-dados'>Data e Hora de Cadastro</div>
          <div className='div-resultado'>{produto.dataHoraCadastro}</div>
        </div>
        <div className='items'>
          <span id="info-title">Estoque</span>
          <div className='div-dados'>Estoque Mínimo</div>
          <div className='div-resultado'>{estoqueState.estoqueMinimo}</div>
          <div className='div-dados'>Estoque Máximo</div>
          <div className='div-resultado'>{estoqueState.estoqueMaximo}</div>
          <div className='div-dados'>Quantidade</div>
          <div className='div-resultado'>{estoqueState.quantidade}</div>
          <div className='div-dados'>Status do Estoque</div>
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

          <div className='div-dados'>Status do Produto</div>
          {
            produto.statusProduto === 'ATIVO' ? (
              <div style={{ color: 'green' }} className='div-resultado'>
                {produto.statusProduto}
                <Check strokeWidth={3} />
              </div>
            ) : produto.statusProduto === 'INATIVO' && (
              <div style={{ color: 'red' }} className='div-resultado'>
                {produto.statusProduto}
                <X strokeWidth={3} />
              </div>
            )
          }

        </div>
      </div>
      <div className='icones-container'>
        <div onClick={atualizar} title='Editar'>
          <Edit className='icones-atualizacao-e-delecao' />
        </div>
        {
          produto.statusProduto === 'ATIVO' ? (
            <div onClick={handlerAlternar} title='Desativar'>
              <XSquare className='icones-atualizacao-e-delecao' />
            </div>
          ) : produto.statusProduto === 'INATIVO' && (
            <div onClick={handlerAlternar} title='Ativar'>
              <CheckSquare className='icones-atualizacao-e-delecao' />
            </div>
          )
        }
      </div>
    </div>
  )
}