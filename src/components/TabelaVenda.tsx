import { ReactNode } from "react";

export default function SaleTable({ children }: { children: ReactNode }) {
  return (
    <div className="tabela-container">
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Valor Unidade</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
