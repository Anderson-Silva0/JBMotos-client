import { Address } from "./address";

export interface Customer {
  cpf: string;
  name: string;
  email: string;
  phone: string;
  customerStatus: string;
  address: Address | null;
  createdAt: string;
}

export const customerInitialState: Customer = {
  cpf: "",
  name: "",
  email: "",
  phone: "",
  customerStatus: "",
  address: null,
  createdAt: "",
};
