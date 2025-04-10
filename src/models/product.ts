export interface Product {
  id: number;
  name: string;
  costPrice: number | string;
  salePrice: number | string;
  brand: string;
  stockId: number;
  supplierCnpj: string;
  productStatus: string;
  createdAt: string;
}

export const productInitialState: Product = {
  id: 0,
  name: "",
  costPrice: 0,
  salePrice: 0,
  brand: "",
  stockId: 0,
  supplierCnpj: "",
  productStatus: "",
  createdAt: "",
};
