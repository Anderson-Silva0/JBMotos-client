import { Employee, employeeInitialState } from "./employee";
import { motorcycleInitialState, Motorcycle } from "./motorcycle";
import { Sale } from "./sale";

export interface Repair {
  id: number;
  employee: Employee;
  motorcycle: Motorcycle;
  sale: Sale | null;
  createdAt: string;
  repairsPerformed: string;
  observation: string;
  laborCost: number;
}

export const repairInitialState: Repair = {
  id: 0,
  employee: employeeInitialState,
  motorcycle: motorcycleInitialState,
  sale: null,
  createdAt: "",
  repairsPerformed: "",
  observation: "",
  laborCost: 0,
};
