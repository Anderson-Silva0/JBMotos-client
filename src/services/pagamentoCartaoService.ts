import { ApiService } from "./apiService"

export const PagamentoCartaoService = () => {

    const url = "/pagamentocartao"

    const salvarPagamentoCartao = (dados: object) => {
        return ApiService.post(`${url}`, dados)
    }

    const buscarTodosPagamentosCartoes = () => {
        return ApiService.get(`${url}/buscar-todos`)
    }

    const buscarPagamentoCartaoPorId = (id: number) => {
        return ApiService.get(`${url}/buscar/${id}`)
    }

    const atualizarPagamentoCartao = (id: number, dados: object) => {
        return ApiService.put(`${url}/atualizar/${id}`, dados)
    }

    const deletarPagamentoCartao = (id: number) => {
        return ApiService.delete(`${url}/deletar/${id}`)
    }

    return {
        salvarPagamentoCartao,
        buscarTodosPagamentosCartoes,
        buscarPagamentoCartaoPorId,
        atualizarPagamentoCartao,
        deletarPagamentoCartao
    }
}
