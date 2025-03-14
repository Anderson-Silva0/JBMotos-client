'use client'

import { LinhaProduto } from "@/components/LinhaProduto"
import { Olho } from "@/components/Olho"
import TabelaVenda from "@/components/TabelaVenda"
import imgProduto from '@/images/checklist.png'
import imgVenda from '@/images/vendas.png'
import { ProdutoVenda } from "@/models/ProdutoVenda"
import { formatarParaReal } from "@/models/formatadorReal"
import { Produto } from "@/models/produto"
import { mensagemErro } from "@/models/toast"
import { ProdutoVendaService } from "@/services/ProdutoVendaService"
import { VendaService } from "@/services/VendaService"
import { ProdutoService } from "@/services/produtoService"
import '@/styles/cardListagem.css'
import Image from "next/image"
import Cookies from 'js-cookie'
import { decode } from 'jsonwebtoken'
import { DecodedToken } from '@/middleware'
import { ROLE } from '@/models/authRegisterModel'
import { useEffect, useState } from "react"
import { Venda } from "@/models/venda"


interface ProdutosDaVendaProps {
  params: {
    idVenda: number
  }
}

export default function ProdutosDaVenda({ params }: ProdutosDaVendaProps) {
  const { buscarProdutoPorId } = ProdutoService()

  const { buscarTodosPorIdVenda } = ProdutoVendaService()

  const { buscarVendaPorId, lucroDaVenda } = VendaService()

  const [produtosDaVendaState, setProdutosDaVendaState] = useState<ProdutoVenda[]>([])
  const [valorTotalVenda, setValorTotalVenda] = useState<number>(0)
  const [lucroDaVendaState, setLucroDaVendaState] = useState<number>(0)
  const [idNomeProdutoMap, setIdNomeProdutoMap] = useState<Map<number, string>>()
  const [userRole, setUserRole] = useState<string>('')

  function loadUserRole() {
    const token = Cookies.get('login-token')
    if (token) {
      const decodedToken = decode(token) as DecodedToken
      setUserRole(decodedToken.role)
    }
  }

  useEffect(() => {
    const buscarInformacoesDaVenda = async () => {
      try {
        const vendaResponse = await buscarVendaPorId(params.idVenda)
        const venda = vendaResponse.data as Venda

        if (venda) {
          const produtosVenda = venda.produtosVenda
          if (produtosVenda) {
            setProdutosDaVendaState(produtosVenda)
          }

          const valorTotalVendaResponse = venda.valorTotalVenda
          if (valorTotalVendaResponse) {
            setValorTotalVenda(valorTotalVendaResponse)
          }

          const lucroDaVendaResponse = await lucroDaVenda(params.idVenda)
          setLucroDaVendaState(lucroDaVendaResponse.data)

          const mapIdNomeProduto = new Map<number, string>()

          produtosVenda.map(produtoVenda => {
            const produto = produtoVenda.produto
            mapIdNomeProduto.set(produto.id, produto.nome)
          })

          setIdNomeProdutoMap(mapIdNomeProduto)
        }
      } catch (erro: any) {
        mensagemErro("Erro ao carregar dados.")
      }
    }
    loadUserRole()
    buscarInformacoesDaVenda()
  }, [])

  return (
    <div className="div-container-produtoVenda">
      <h1 className="centered-text">
        {
          produtosDaVendaState.length > 1 ? (
            <>
              A <Image src={imgVenda} width={60} height={60} alt="" /> Venda
              contém {produtosDaVendaState.length} Produtos { }
              <Image src={imgProduto} width={60} height={60} alt="" />
            </>
          ) : produtosDaVendaState.length === 1 && (
            <>
              A <Image src={imgVenda} width={60} height={60} alt="" /> Venda
              contém {produtosDaVendaState.length} Produto { }
              <Image src={imgProduto} width={60} height={60} alt="" />
            </>
          )
        }
      </h1>
      <div className="cardListagem-container">
        <span id="info-title-venda">
          {
            produtosDaVendaState.length === 1 ? (
              <div className="div-dados-title">
                Detalhes do Produto
              </div>
            ) : (
              <div className="div-dados-title">
                Detalhes dos Produtos
              </div>
            )
          }
        </span>
        <TabelaVenda>
          {
            produtosDaVendaState.map((produtoVenda) => {
              const nomeProduto = idNomeProdutoMap?.get(produtoVenda.produto.id)
              if (nomeProduto) {
                return (
                  <LinhaProduto
                    key={produtoVenda.id}
                    nome={nomeProduto}
                    produtoVenda={produtoVenda}
                  />
                )
              }
            })
          }
        </TabelaVenda>
      </div>
      <div className="value-box-venda">
        <div className='div-dados-title'>Total da Venda</div>
        <div className='div-resultado' style={{ alignItems: 'center' }}>{formatarParaReal(valorTotalVenda)}</div>
        {userRole === ROLE.ADMIN &&
          <>
            <div className='div-dados-title'>Lucro da Venda</div>
            <Olho isLogin={false} lucroVenda={formatarParaReal(lucroDaVendaState)} />
          </>
        }
      </div>
    </div>
  )
}
