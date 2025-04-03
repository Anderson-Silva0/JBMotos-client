import { Address } from "./address";

export interface Supplier {
  cnpj: string;
  name: string;
  phone: string;
  supplierStatus: string;
  address: Address | null;
  createdAt: string;
}

export const supplierInitialState: Supplier = {
  cnpj: "",
  name: "",
  phone: "",
  supplierStatus: "",
  address: null,
  createdAt: "",
};