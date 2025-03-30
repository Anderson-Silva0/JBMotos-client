import { ProductOfSale } from "@/models/ProdutoVenda";
import { formatToBRL } from "@/models/formatadorReal";
import "@/styles/tabelaVenda.css";

interface ProductRowProps {
  productOfSale: ProductOfSale;
  name: string;
}

export function ProductRow(props: ProductRowProps) {
  return (
    <tr>
      <td id="col-NomeProduto">{props.name}</td>
      <td>{props.productOfSale.quantity}</td>
      <td>{formatToBRL(props.productOfSale.unitValue)}</td>
      <td>{formatToBRL(props.productOfSale.totalValue)}</td>
    </tr>
  );
}
