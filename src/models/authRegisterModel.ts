import { estadoInicialFuncionario, Funcionario } from "./funcionario"

export enum ROLE {
    SUPORTE = "SUPORTE",
    ADMIN = "ADMIN",
    OPERADOR = "OPERADOR"
}

export const roleSelectOptions = [
    { label: 'Admin', value: ROLE.ADMIN },
    { label: 'Operador', value: ROLE.OPERADOR }
]

export interface AuthRegisterModelFuncionario {
    id: number
    login: string
    senha: string
    role: string
    funcionario: Funcionario
}

export const estadoInicialAuthRegisterModelFuncionario: AuthRegisterModelFuncionario = {
    id: 0,
    login: '',
    senha: '',
    role: ROLE.OPERADOR,
    funcionario: estadoInicialFuncionario
}