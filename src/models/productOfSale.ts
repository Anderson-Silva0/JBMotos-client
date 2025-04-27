import { productInitialState, Product } from "./product";

export interface ProductOfSale {
  id: number;
  saleId: number;
  product: Product;
  quantity: number;
  unitValue: number | string;
  totalValue: number | string;
}

export const productOfSaleInitialState: ProductOfSale = {
  id: 0,
  saleId: 0,
  product: productInitialState,
  quantity: 0,
  unitValue: 0,
  totalValue: 0,
};
