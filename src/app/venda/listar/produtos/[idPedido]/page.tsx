import { Olho } from "@/components/Olho"
import imgProduto from '@/images/checklist.png'
import imgVenda from '@/images/vendas.png'
import { ProdutoPedido } from "@/models/ProdutoPedido"
import { formatarParaReal } from "@/models/formatadorReal"
import { Produto } from "@/models/produto"
import { PedidoService } from "@/services/PedidoService"
import { ProdutoPedidoService } from "@/services/ProdutoPedidoService"
import { ProdutoService } from "@/services/produtoService"
import '@/styles/cardListagem.css'
import Image from "next/image"

interface ProdutosDoPedidoProps {
  params: {
    idPedido: number
  }
}

export default async function ProdutosDoPedido({ params }: ProdutosDoPedidoProps) {

  const { buscarProdutoPorId } = ProdutoService()

  const { buscarTodosPorIdPedido } = ProdutoPedidoService()

  const { valorTotalDoPedido, lucroDoPedido } = PedidoService()

  const produtosDoPedidoResponse: ProdutoPedido[] = (await buscarTodosPorIdPedido(params.idPedido)).data

  const valorTotalVenda = (await valorTotalDoPedido(params.idPedido)).data
  const lucroVenda: number = (await lucroDoPedido(params.idPedido)).data

  const obterNomeProduto = async (idProduto: number) => {
    const produtoResponse = (await buscarProdutoPorId(idProduto)).data as Produto
    return produtoResponse.nome
  }


  return (
    <div className="div-container-produtoPedido">
      <h1 className="centered-text">
        {
          produtosDoPedidoResponse.length > 1 ? (
            <>
              A <Image src={imgVenda} width={60} height={60} alt="" /> Venda
              contém {produtosDoPedidoResponse.length} Produtos { }
              <Image src={imgProduto} width={60} height={60} alt="" />
            </>
          ) : produtosDoPedidoResponse.length === 1 && (
            <>
              A <Image src={imgVenda} width={60} height={60} alt="" /> Venda
              contém {produtosDoPedidoResponse.length} Produto { }
              <Image src={imgProduto} width={60} height={60} alt="" />
            </>
          )
        }
      </h1>
      <div className="cardListagem-container">
        <span id="info-title-venda">
          {
            produtosDoPedidoResponse.length === 1 ? (
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
        {produtosDoPedidoResponse.map((produtoPedido) => (
          <div id="div-produtoPedido-venda" key={produtoPedido.id}>
            <span id="info-title-venda">Produto</span>
            <div className='div-dados'>Nome</div>
            <div className='div-resultado'>{obterNomeProduto(produtoPedido.idProduto)}</div>
            <div className='div-dados'>Quantidade</div>
            <div className='div-resultado'>{produtoPedido.quantidade}</div>
            <div className='div-dados'>Valor Unidade</div>
            <div className='div-resultado'>{formatarParaReal(produtoPedido.valorUnidade)}</div>
            <div className='div-dados'>Valor Total</div>
            <div className='div-resultado'>{formatarParaReal(produtoPedido.valorTotal)}</div>
          </div>
        ))}
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
