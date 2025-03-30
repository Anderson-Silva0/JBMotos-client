import { AuthRegisterModelEmployee } from "@/models/authRegisterModel";
import { ApiService } from "./apiService";
import { Authentication } from "@/models/authentication";

export const AuthenticationService = () => {
  const url = "/auth";

  const authLogin = (auth: Authentication) => {
    return ApiService.post(`${url}/login`, auth);
  };

  const authRegisterEmployee = (
    employeeAuth: AuthRegisterModelEmployee
  ) => {
    return ApiService.post(`${url}/save`, employeeAuth);
  };

  return {
    authLogin,
    authRegisterEmployee,
  };
};
