import { Product } from "@/models/produto";
import { ApiService } from "./apiService";

export const ProductService = () => {
  const url = "/product";

  const saveProduct = (data: Product) => {
    return ApiService.post(`${url}`, data);
  };

  const findAllProduct = () => {
    return ApiService.get(`${url}/find-all`);
  };

  const findProductById = (id: number) => {
    return ApiService.get(`${url}/find/${id}`);
  };

  const filterProduct = (fieldName: string, value: string) => {
    return ApiService.get(`${url}/filter?${fieldName}=${value}`);
  };

  const toggleStatusProduct = (productId: number) => {
    return ApiService.patch(`${url}/toggle-status/${productId}`);
  };

  const updateProduct = (id: number, data: Product) => {
    return ApiService.put(`${url}/update/${id}`, data);
  };

  const deleteProductById = (id: number) => {
    return ApiService.delete(`${url}/delete/${id}`);
  };

  const productProfit = (id: number) => {
    return ApiService.get(`${url}/product-profit/${id}`);
  };

  return {
    saveProduct,
    findAllProduct,
    findProductById,
    filterProduct,
    toggleStatusProduct,
    updateProduct,
    deleteProductById,
    productProfit,
  };
};
