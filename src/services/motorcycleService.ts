import { Motorcycle } from "@/models/motorcycle";
import { ApiService } from "./apiService";

export const MotorcycleService = () => {
  const url = "/motorcycle";

  const saveMotorcycle = (data: Motorcycle) => {
    return ApiService.post(`${url}`, data);
  };

  const findAllMotorcycle = () => {
    return ApiService.get(`${url}/find-all`);
  };

  const findMotorcycleByCustomerCpf = (customerCpf: string) => {
    return ApiService.get(`${url}/find-by-cpf/${customerCpf}`);
  };

  const findMotorcycleById = (id: number) => {
    return ApiService.get(`${url}/find-by-id/${id}`);
  };

  const findMotorcycleByPlate = (plate: string) => {
    return ApiService.get(`${url}/find-by-plate/${plate}`);
  };

  const filterMotorcycle = (fieldName: string, value: string) => {
    return ApiService.get(`${url}/filter?${fieldName}=${value}`);
  };

  const toggleStatusMotorcycle = (id: number | string) => {
    return ApiService.patch(`${url}/toggle-status/${id}`);
  };

  const updateMotorcycle = (id: number, data: Motorcycle) => {
    return ApiService.put(`${url}/update/${id}`, data);
  };

  const deleteMotorcycleById = (id: number) => {
    return ApiService.delete(`${url}/delete-by-id/${id}`);
  };

  const deleteMotorcycleByPlate = (placa: string) => {
    return ApiService.delete(`${url}/delete-by-plate/${placa}`);
  };

  return {
    saveMotorcycle,
    findAllMotorcycle,
    findMotorcycleByCustomerCpf,
    findMotorcycleById,
    findMotorcycleByPlate,
    filterMotorcycle,
    toggleStatusMotorcycle,
    updateMotorcycle,
    deleteMotorcycleById,
    deleteMotorcycleByPlate,
  };
};
