import { motorcycleInitialState, Motorcycle } from "./moto";
import { Sale } from "./venda";

export interface Repair {
  id: number;
  employeeCpf: string;
  motorcycle: Motorcycle;
  sale: Sale | null;
  createdAt: string;
  repairPerformed: string;
  observation: string;
  laborCost: number;
}

export const repairInitialState: Repair = {
  id: 0,
  employeeCpf: "",
  motorcycle: motorcycleInitialState,
  sale: null,
  createdAt: "",
  repairPerformed: "",
  observation: "",
  laborCost: 0,
};
