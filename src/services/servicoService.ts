import { Servico } from "@/models/servico"
import { ApiService } from "./apiService"

export const ServicoService = () => {

    const url = "/servico"

    const salvarServico = (servico: Servico) => {
        return ApiService.post(`${url}`, servico)
    }

    const buscarTodosServicos = () => {
        return ApiService.get(`${url}/buscar-todos`)
    }

    const buscarServicoPorId = (id: number) => {
        return ApiService.get(`${url}/buscar/${id}`)
    }

    const buscarServicoPorIdVenda = (idVenda: number) => {
        return ApiService.get(`${url}/buscar-por-venda/${idVenda}`)
    }

    const buscarServicoPorCpfFuncionario = (cpfFuncionario: string) => {
        return ApiService.get(`${url}/buscar-por-cpfFuncionario/${cpfFuncionario}`)
    }

    const atualizarServico = (id: number, servico: Servico) => {
        return ApiService.put(`${url}/atualizar/${id}`, servico)
    }

    const filtrarServico = (nomeCampo: string, valor: string) => {
        return ApiService.get(`${url}/filtrar?${nomeCampo}=${valor}`)
    }

    const deletarServico = (id: number) => {
        return ApiService.delete(`${url}/deletar/${id}`)
    }

    return {
        salvarServico,
        buscarTodosServicos,
        buscarServicoPorId,
        filtrarServico,
        buscarServicoPorIdVenda,
        buscarServicoPorCpfFuncionario,
        atualizarServico,
        deletarServico
    }
}