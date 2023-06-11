import { ApiService } from "./apiService"

export const EnderecoService = () => {
    
    const url = "/endereco"

    const salvarEndereco = (dados: object) => {
        return ApiService.post(`${url}`, dados)
    }

    const buscarTodosEnderecos = () => {
        return ApiService.get(`${url}/buscar-todos`)
    }

    const buscarEnderecoPorId = (id: number) => {
        return ApiService.get(`${url}/buscar/${id}`)
    }

    const atualizarEndereco = (id: number, dados: object) => {
        return ApiService.put(`${url}/atualizar/${id}`, dados)
    }

    const deletarEndereco = (id: number) => {
        return ApiService.delete(`${url}/deletar/${id}`)
    }

    return {
        salvarEndereco,
        buscarTodosEnderecos,
        buscarEnderecoPorId,
        atualizarEndereco,
        deletarEndereco
    }
}
