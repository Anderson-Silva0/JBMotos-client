import { AuthRegisterModelFuncionario } from "@/models/authRegisterModel"
import { ApiService } from "./apiService"
import { Authentication } from "@/models/authentication"

export const AuthenticationService = () => {

    const url = "/auth"

    const authLogin = (auth: Authentication) => {
        return ApiService.post(`${url}/login`, auth)
    }

    const authRegisterFuncionario = (authFuncionario: AuthRegisterModelFuncionario) => {
        return ApiService.post(`${url}/cadastrar`, authFuncionario)
    }

    return {
        authLogin,
        authRegisterFuncionario
    }
}