import { ProdutoVenda } from "@/models/ProdutoVenda"
import { formatarParaReal } from "@/models/formatadorReal"
import '@/styles/tabelaVenda.css'

interface LinhaProdutoProps {
    produtoVenda: ProdutoVenda
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
                    props.produtoVenda.quantidade
                }
            </td>
            <td>{formatarParaReal(props.produtoVenda.valorUnidade)}</td>
            <td>{formatarParaReal(props.produtoVenda.valorTotal)}</td>
        </tr>
    )
}