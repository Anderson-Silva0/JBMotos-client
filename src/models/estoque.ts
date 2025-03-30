export interface Stock {
  id: number;
  minStock: number | string;
  maxStock: number | string;
  quantity: number | string;
  status: string;
}

export const stockInitialState: Stock = {
  id: 0,
  minStock: "",
  maxStock: "",
  quantity: "",
  status: "",
};
