import { LinhaProduto } from "@/components/LinhaProduto"
import { Olho } from "@/components/Olho"
import TabelaVenda from "@/components/TabelaVenda"
import imgProduto from '@/images/checklist.png'
import imgVenda from '@/images/vendas.png'
import { ProdutoVenda } from "@/models/ProdutoVenda"
import { formatarParaReal } from "@/models/formatadorReal"
import { Produto } from "@/models/produto"
import { ProdutoVendaService } from "@/services/ProdutoVendaService"
import { VendaService } from "@/services/VendaService"
import { ProdutoService } from "@/services/produtoService"
import '@/styles/cardListagem.css'
import Image from "next/image"

interface ProdutosDoVendaProps {
  params: {
    idVenda: number
  }
}

export default async function ProdutosDoVenda({ params }: ProdutosDoVendaProps) {
  const { buscarProdutoPorId } = ProdutoService()

  const { buscarTodosPorIdVenda } = ProdutoVendaService()

  const { valorTotalDaVenda, lucroDaVenda } = VendaService()

  const produtosDoVendaResponse: ProdutoVenda[] = (await buscarTodosPorIdVenda(params.idVenda)).data

  const valorTotalVenda = (await valorTotalDaVenda(params.idVenda)).data
  const lucroVenda: number = (await lucroDaVenda(params.idVenda)).data

  const obterNomeProduto = async (idProduto: number) => {
    const produtoResponse = (await buscarProdutoPorId(idProduto)).data as Produto
    return produtoResponse.nome
  }

  return (
    <div className="div-container-produtoVenda">
      <h1 className="centered-text">
        {
          produtosDoVendaResponse.length > 1 ? (
            <>
              A <Image src={imgVenda} width={60} height={60} alt="" /> Venda
              contém {produtosDoVendaResponse.length} Produtos { }
              <Image src={imgProduto} width={60} height={60} alt="" />
            </>
          ) : produtosDoVendaResponse.length === 1 && (
            <>
              A <Image src={imgVenda} width={60} height={60} alt="" /> Venda
              contém {produtosDoVendaResponse.length} Produto { }
              <Image src={imgProduto} width={60} height={60} alt="" />
            </>
          )
        }
      </h1>
      <div className="cardListagem-container">
        <span id="info-title-venda">
          {
            produtosDoVendaResponse.length === 1 ? (
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
            await Promise.all(
              produtosDoVendaResponse.map(async (produtoVenda) => {
                const nomeProduto = await obterNomeProduto(produtoVenda.idProduto)
                return (
                  <LinhaProduto
                    key={produtoVenda.id}
                    nome={nomeProduto}
                    produtoVenda={produtoVenda}
                  />
                )
              })
            )
          }
        </TabelaVenda>
      </div>
      <div className="value-box-venda">
        <div className='div-dados-title'>Total da Venda</div>
        <div className='div-resultado'>{formatarParaReal(valorTotalVenda)}</div>
        <div className='div-dados-title'>Lucro da Venda</div>
        <Olho lucroVenda={formatarParaReal(lucroVenda)} />
      </div>
    </div>
  )
}
