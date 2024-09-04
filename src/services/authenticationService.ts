import { ApiService } from "./apiService"
import { Authentication } from "@/models/authentication"

export const AuthenticationService = () => {

    const url = "/auth"

    const authLogin = (auth: Authentication) => {
        return ApiService.post(`${url}/login`, auth)
    }

    const authRegister = () => {
        return ApiService.post(`${url}/cadastrar`)
    }

    return {
        authLogin,
        authRegister
    }
}