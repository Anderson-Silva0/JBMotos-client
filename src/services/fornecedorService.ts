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
        return ApiService.get(`${url}/buscar?cnpj=${cnpj}`)
    }

    const filtrarFornecedor = (nomeCampo: string, valor: string) => {
        return ApiService.get(`${url}/filtrar?${nomeCampo}=${valor}`)
    }

    const alternarStatusFornecedor = (cnpj: string) => {
        return ApiService.patch(`${url}/alternar-status?cnpj=${cnpj}`)
    }

    const atualizarFornecedor = (cnpj: string, dados: object) => {
        return ApiService.put(`${url}/atualizar?cnpj=${cnpj}`, dados)
    }

    const deletarFornecedor = (cnpj: string) => {
        return ApiService.delete(`${url}/deletar?cnpj=${cnpj}`)
    }

    return {
        salvarFornecedor,
        buscarTodosFornecedores,
        buscarFornecedorPorCnpj,
        filtrarFornecedor,
        alternarStatusFornecedor,
        atualizarFornecedor,
        deletarFornecedor
    }
}