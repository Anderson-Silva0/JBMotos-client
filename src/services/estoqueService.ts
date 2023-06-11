import { ApiService } from "./apiService"

export const EstoqueService = () => {

  const url = "/estoque"

  const salvarEstoque = (dados: object) => {
    return ApiService.post(`${url}`, dados)
  }

  const buscarTodosEstoques = () => {
    return ApiService.get(`${url}/buscar-todos`)
  }

  const buscarEstoquePorId = (id: number) => {
    return ApiService.get(`${url}/buscar/${id}`)
  }

  const atualizarEstoque = (id: number, dados: object) => {
    return ApiService.put(`${url}/atualizar/${id}`, dados)
  }

  const deletarEstoque = (id: number) => {
    return ApiService.delete(`${url}/deletar/${id}`)
  }

  const adicionarQuantidade = (idProduto: number, qtdProduto: number) => {
    return ApiService.post(`${url}/${idProduto}/adicionar?quantidade=${qtdProduto}`)
  }

  const valorTotalEstoque = () => {
    return ApiService.get(`${url}/valor-total`)
  }

  return {
    salvarEstoque,
    buscarTodosEstoques,
    buscarEstoquePorId,
    atualizarEstoque,
    deletarEstoque,
    adicionarQuantidade,
    valorTotalEstoque
  }
}