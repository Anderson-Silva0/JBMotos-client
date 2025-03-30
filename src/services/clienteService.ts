import { Customer } from "@/models/cliente";
import { ApiService } from "./apiService";

export const CustomerService = () => {
  const url = "/cliente";

  const saveCustomer = (cliente: Customer) => {
    return ApiService.post(`${url}`, cliente);
  };

  const findAllCustomer = () => {
    return ApiService.get(`${url}/find-all`);
  };

  const findCustomerByCpf = (cpf: string) => {
    return ApiService.get(`${url}/find/${cpf}`);
  };

  const filterCustomer = (fieldName: string, value: string) => {
    return ApiService.get(`${url}/filtrar?${fieldName}=${value}`);
  };

  const toggleCustomerStatus = (cpf: string) => {
    return ApiService.patch(`${url}/toggle-status/${cpf}`);
  };

  const updateCustomer = (cpf: string, cliente: Customer) => {
    return ApiService.put(`${url}/update/${cpf}`, cliente);
  };

  const deleteCustomer = (cpf: string) => {
    return ApiService.delete(`${url}/delete/${cpf}`);
  };

  return {
    saveCustomer,
    findAllCustomer,
    findCustomerByCpf,
    filterCustomer,
    toggleCustomerStatus,
    updateCustomer,
    deleteCustomer,
  };
};
