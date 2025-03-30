import { ProductOfSale } from "./ProdutoVenda";
import { Customer, customerInitialState } from "./cliente";
import { employeeInitialState, Employee } from "./funcionario";
import { CardPayment } from "./pagamentoCartao";

export interface Sale {
  id: number;
  customer: Customer;
  employee: Employee;
  createdAt: string;
  observation: string;
  paymentMethod: string;
  cardPayment: CardPayment | null;
  productsOfSale: ProductOfSale[];
  totalSaleValue: number;
}

export const SaleInitialState: Sale = {
  id: 0,
  customer: customerInitialState,
  employee: employeeInitialState,
  createdAt: "",
  observation: "",
  paymentMethod: "",
  cardPayment: null,
  productsOfSale: [],
  totalSaleValue: 0,
};
