import { Sale } from "@/models/sale";
import { ApiService } from "./apiService";

export const SaleService = () => {
  const url = "/sale";

  const saveSale = (sale: Sale) => {
    return ApiService.post(`${url}`, sale);
  };

  const findAllSale = () => {
    return ApiService.get(`${url}/find-all`);
  };

  const findSaleById = (id: number) => {
    return ApiService.get(`${url}/find/${id}`);
  };

  const filterSale = (fieldName: string, value: string) => {
    return ApiService.get(`${url}/filter?${fieldName}=${value}`);
  };

  const updateSale = (id: number, sale: Sale) => {
    return ApiService.put(`${url}/update/${id}`, sale);
  };

  const deleteSaleById = (id: number) => {
    return ApiService.delete(`${url}/delete/${id}`);
  };

  const saleProfit = (id: number) => {
    return ApiService.get(`${url}/sale-profit/${id}`);
  };

  const totalSaleValue = (id: number) => {
    return ApiService.get(`${url}/total-sale-value/${id}`);
  };

  const findSaleProducts = (id: number) => {
    return ApiService.get(`${url}/find-sale-products/${id}`);
  };

  return {
    saveSale,
    findAllSale,
    findSaleById,
    filterSale,
    updateSale,
    deleteSaleById,
    saleProfit,
    totalSaleValue,
    findSaleProducts,
  };
};
