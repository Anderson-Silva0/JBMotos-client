import { Address } from "./address";

export interface Employee {
  cpf: string;
  name: string;
  phone: string;
  employeeStatus: string;
  address: Address | null;
  createdAt: string;
}

export const employeeInitialState: Employee = {
  cpf: "",
  name: "",
  phone: "",
  employeeStatus: "",
  address: null,
  createdAt: "",
};