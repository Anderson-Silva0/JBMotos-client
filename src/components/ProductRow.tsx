import { ProductOfSale } from "@/models/productOfSale";
import { formatToBRL } from "@/models/currencyFormatters";
import "@/styles/saleTable.css";

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
