import { ProductOfSale } from "@/models/ProdutoVenda";
import { ApiService } from "./apiService";

export const ProductOfSaleService = () => {
  const url = "/product-of-sale";

  const saveProductOfSale = (data: ProductOfSale) => {
    return ApiService.post(`${url}`, data);
  };

  const findAllProductOfSale = () => {
    return ApiService.get(`${url}/find-all`);
  };

  const findProductOfSaleById = (id: number) => {
    return ApiService.get(`${url}/find/${id}`);
  };

  const updateProductOfSale = (id: number, data: ProductOfSale) => {
    return ApiService.put(`${url}/update/${id}`, data);
  };

  const deleteProductOfSaleById = (id: number) => {
    return ApiService.delete(`${url}/delete/${id}`);
  };

  const findAllProductOfSaleBySaleId = (saleId: number) => {
    return ApiService.get(`${url}/products-of-sale/${saleId}`);
  };

  return {
    saveProductOfSale,
    findAllProductOfSale,
    findProductOfSaleById,
    updateProductOfSale,
    deleteProductOfSaleById,
    findAllProductOfSaleBySaleId,
  };
};
