import { ProdutoPedido } from "@/models/ProdutoPedido"
import { formatarParaReal } from "@/models/formatadorReal"
import '@/styles/tabelaVenda.css'

interface LinhaProdutoProps {
    produtoPedido: ProdutoPedido
    nome: string
}

export function LinhaProduto(props: LinhaProdutoProps) {
    return (
        <tr>
            <td id="col-NomeProduto">
                {
                    props.nome
                }
            </td>
            <td>
                {
                    props.produtoPedido.quantidade
                }
            </td>
            <td>{formatarParaReal(props.produtoPedido.valorUnidade)}</td>
            <td>{formatarParaReal(props.produtoPedido.valorTotal)}</td>
        </tr>
    )
}