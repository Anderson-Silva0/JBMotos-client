import { ApiService } from "./apiService"

export const FornecedorService = () => {
    
    const url = "/fornecedor"

    const salvarFornecedor = (dados: object) => {
        return ApiService.post(`${url}`, dados)
    }

    const buscarTodosFornecedores = () => {
        return ApiService.get(`${url}/buscar-todos`)
    }

    const buscarFornecedorPorCnpj = (cnpj: string) => {
        return ApiService.get(`${url}/buscar/?cnpj=${cnpj}`)
    }

    const atualizarFornecedor = (cnpj: string, dados: object) => {
        return ApiService.put(`${url}/atualizar/${cnpj}`, dados)
    }

    const deletarFornecedor = (cnpj: string) => {
        return ApiService.delete(`${url}/deletar/${cnpj}`)
    }

    return {
        salvarFornecedor,
        buscarTodosFornecedores,
        buscarFornecedorPorCnpj,
        atualizarFornecedor,
        deletarFornecedor
    }
}