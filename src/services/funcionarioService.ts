import { Employee } from "@/models/funcionario";
import { ApiService } from "./apiService";

export const EmployeeService = () => {
  const url = "/employee";

  const findAllEmployee = () => {
    return ApiService.get(`${url}/find-all`);
  };

  const findEmployeeByCpf = (cpf: string) => {
    return ApiService.get(`${url}/find/${cpf}`);
  };

  const filterEmployee = (fieldName: string, value: string) => {
    return ApiService.get(`${url}/filter?${fieldName}=${value}`);
  };

  const toggleStatusEmployee = (cpf: string) => {
    return ApiService.patch(`${url}/toggle-status/${cpf}`);
  };

  const updateEmployee = (cpf: string, funcionario: Employee) => {
    return ApiService.put(`${url}/update/${cpf}`, funcionario);
  };

  const deleteEmployee = (cpf: string) => {
    return ApiService.delete(`${url}/delete/${cpf}`);
  };

  return {
    findAllEmployee,
    findEmployeeByCpf,
    filterEmployee,
    toggleStatusEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
