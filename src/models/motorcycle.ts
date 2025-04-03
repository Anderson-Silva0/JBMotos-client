export interface Motorcycle {
  id: number | string;
  plate: string;
  brand: string;
  model: string;
  year: string;
  createdAt: string;
  customerCpf: string;
  motorcycleStatus: string;
}

export const motorcycleInitialState: Motorcycle = {
  id: "",
  plate: "",
  brand: "",
  model: "",
  year: "",
  createdAt: "",
  customerCpf: "",
  motorcycleStatus: "",
};