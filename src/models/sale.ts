import { ProductOfSale } from "./productOfSale";
import { Customer, customerInitialState } from "./customer";
import { employeeInitialState, Employee } from "./employee";
import { CardPayment } from "./cardPayment";

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
