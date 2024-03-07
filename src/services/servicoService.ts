import { Servico } from "@/models/servico"
import { ApiService } from "./apiService"

export const ServicoService = () => {

    const url = "/servico"

    const salvarServico = (dados: Servico) => {
        return ApiService.post(`${url}`, dados)
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

    const atualizarServico = (id: number, dados: Servico) => {
        return ApiService.put(`${url}/atualizar/${id}`, dados)
    }

    const deletarServico = (id: number) => {
        return ApiService.delete(`${url}/deletar/${id}`)
    }

    return {
        salvarServico,
        buscarTodosServicos,
        buscarServicoPorId,
        buscarServicoPorIdVenda,
        buscarServicoPorCpfFuncionario,
        atualizarServico,
        deletarServico
    }
}