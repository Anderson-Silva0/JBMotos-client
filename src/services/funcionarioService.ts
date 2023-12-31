import { ApiService } from "./apiService"

export const FuncionarioService = () => {

    const url = "/funcionario"

    const salvarFuncionario = (dados: object) => {
        return ApiService.post(`${url}`, dados)
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

    const atualizarFuncionario = (cpf: string, dados: object) => {
        return ApiService.put(`${url}/atualizar/${cpf}`, dados)
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