import { Repair } from "@/models/servico";
import { ApiService } from "./apiService";

export const RepairService = () => {
  const url = "/repair";

  const saveRepair = (servico: Repair) => {
    return ApiService.post(`${url}`, servico);
  };

  const findAllRepair = () => {
    return ApiService.get(`${url}/find-all`);
  };

  const findRepairById = (id: number) => {
    return ApiService.get(`${url}/find/${id}`);
  };

  const findRepairBySaleId = (saleId: number) => {
    return ApiService.get(`${url}/find-by-sale-id/${saleId}`);
  };

  const findRepairByCpfEmployee = (employeeCpf: string) => {
    return ApiService.get(`${url}/find-by-employeeCpf/${employeeCpf}`);
  };

  const updateRepair = (id: number, repair: Repair) => {
    return ApiService.put(`${url}/update/${id}`, repair);
  };

  const filterRepair = (fieldName: string, value: string) => {
    return ApiService.get(`${url}/filter?${fieldName}=${value}`);
  };

  const deleteRepair = (id: number) => {
    return ApiService.delete(`${url}/delete/${id}`);
  };

  return {
    saveRepair,
    findAllRepair,
    findRepairById,
    filterRepair,
    findRepairBySaleId,
    findRepairByCpfEmployee,
    updateRepair,
    deleteRepair,
  };
};
