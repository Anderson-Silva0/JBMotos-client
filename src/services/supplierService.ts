import { Supplier } from "@/models/supplier";
import { ApiService } from "./apiService";

export const SupplierService = () => {
  const url = "/supplier";

  const saveSupplier = (supplier: Supplier) => {
    return ApiService.post(`${url}`, supplier);
  };

  const findAllSupplier = () => {
    return ApiService.get(`${url}/find-all`);
  };

  const findSupplierByCnpj = (cnpj: string) => {
    return ApiService.get(`${url}/find?cnpj=${cnpj}`);
  };

  const filterSupplier = (fieldName: string, value: string) => {
    return ApiService.get(`${url}/filter?${fieldName}=${value}`);
  };

  const toggleStatusSupplier = (cnpj: string) => {
    return ApiService.patch(`${url}/toggle-status?cnpj=${cnpj}`);
  };

  const updateSupplier = (cnpj: string, supplier: Supplier) => {
    return ApiService.put(`${url}/update?cnpj=${cnpj}`, supplier);
  };

  const deleteSupplier = (cnpj: string) => {
    return ApiService.delete(`${url}/delete?cnpj=${cnpj}`);
  };

  return {
    saveSupplier,
    findAllSupplier,
    findSupplierByCnpj,
    filterSupplier,
    toggleStatusSupplier,
    updateSupplier,
    deleteSupplier,
  };
};
