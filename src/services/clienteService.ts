import { ApiService } from "./apiService"

export const ClienteService = () => {

    const url = "/cliente"

    const salvarCliente = (dados: object) => {
        return ApiService.post(`${url}`, dados)
    }

    const buscarTodosClientes = () => {
        return ApiService.get(`${url}/buscar-todos`)
    }

    const buscarClientePorCpf = (cpf: string) => {
        return ApiService.get(`${url}/buscar/${cpf}`)
    }

    const filtrarCliente = (nomeCampo: string, valor: string) => {
        return ApiService.get(`${url}/filtrar?${nomeCampo}=${valor}`)
    }

    const alternarStatusCliente = (cpf: string) => {
        return ApiService.patch(`${url}/alternar-status/${cpf}`)
    }

    const atualizarCliente = (cpf: string, dados: object) => {
        return ApiService.put(`${url}/atualizar/${cpf}`, dados)
    }

    const deletarCliente = (cpf: string) => {
        return ApiService.delete(`${url}/deletar/${cpf}`)
    }

    return {
        salvarCliente,
        buscarTodosClientes,
        buscarClientePorCpf,
        filtrarCliente,
        alternarStatusCliente,
        atualizarCliente,
        deletarCliente
    }
}