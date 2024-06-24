import { Funcionario } from "@/models/funcionario"
import { ApiService } from "./apiService"

export const FuncionarioService = () => {

    const url = "/funcionario"

    const salvarFuncionario = (funcionario: Funcionario) => {
        return ApiService.post(`${url}`, funcionario)
    }

    const buscarTodosFuncionarios = () => {
        return ApiService.get(`${url}/buscar-todos`)
    }

    const buscarFuncionarioPorCpf = (cpf: string) => {
        return ApiService.get(`${url}/buscar/${cpf}`)
    }

    const filtrarFuncionario = (nomeCampo: string, valor: string) => {
        return ApiService.get(`${url}/filtrar?${nomeCampo}=${valor}`)
    }

    const alternarStatusFuncionario = (cpf: string) => {
        return ApiService.patch(`${url}/alternar-status/${cpf}`)
    }

    const atualizarFuncionario = (cpf: string, funcionario: Funcionario) => {
        return ApiService.put(`${url}/atualizar/${cpf}`, funcionario)
    }

    const deletarFuncionario = (cpf: string) => {
        return ApiService.delete(`${url}/deletar/${cpf}`)
    }

    return {
        salvarFuncionario,
        buscarTodosFuncionarios,
        buscarFuncionarioPorCpf,
        filtrarFuncionario,
        alternarStatusFuncionario,
        atualizarFuncionario,
        deletarFuncionario
    }
}