import { Customer, customerInitialState } from "./customer";

export interface Motorcycle {
  id: number | string;
  plate: string;
  brand: string;
  model: string;
  year: string;
  createdAt: string;
  customer: Customer;
  motorcycleStatus: string;
}

export const motorcycleInitialState: Motorcycle = {
  id: "",
  plate: "",
  brand: "",
  model: "",
  year: "",
  createdAt: "",
  customer: customerInitialState,
  motorcycleStatus: "",
};