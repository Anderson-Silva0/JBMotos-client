import { Stock } from "@/models/stock";
import { ApiService } from "./apiService";

export const StockService = () => {
  const url = "/stock";

  const saveStock = (data: Stock) => {
    return ApiService.post(`${url}`, data);
  };

  const findAllStock = () => {
    return ApiService.get(`${url}/find-all`);
  };

  const findStockById = (id: number) => {
    return ApiService.get(`${url}/find/${id}`);
  };

  const updateStock = (id: number, data: Stock) => {
    return ApiService.put(`${url}/update/${id}`, data);
  };

  const deleteStock = (id: number) => {
    return ApiService.delete(`${url}/delete/${id}`);
  };

  const addQuantity = (productId: number, productQuantity: number) => {
    return ApiService.post(
      `${url}/${productId}/add?quantity=${productQuantity}`
    );
  };

  const totalValueStockCost = () => {
    return ApiService.get(`${url}/total-stock-cost-value`);
  };

  const potentialStockSale = () => {
    return ApiService.get(`${url}/sales-potential-stock`);
  };

  return {
    saveStock,
    findAllStock,
    findStockById,
    updateStock,
    deleteStock,
    addQuantity,
    totalValueStockCost,
    potentialStockSale
  };
};
