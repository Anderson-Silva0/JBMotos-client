import { ApiService } from "./apiService"

export const ProdutoService = () => {

  const url = "/produto"

  const salvarProduto = (dados: object) => {
    return ApiService.post(`${url}`, dados)
  }

  const buscarTodosProdutos = () => {
    return ApiService.get(`${url}/buscar-todos`)
  }

  const buscarProdutoPorId = (id: number) => {
    return ApiService.get(`${url}/buscar/${id}`)
  }

  const atualizarProduto = (id: number, dados: object) => {
    return ApiService.put(`${url}/atualizar/${id}`, dados)
  }

  const deletarProduto = (id: number) => {
    return ApiService.delete(`${url}/deletar/${id}`)
  }

  const lucroProduto = (id: number) => {
    return ApiService.get(`${url}/lucro-produto/${id}`)
  }

  return {
    salvarProduto,
    buscarTodosProdutos,
    buscarProdutoPorId,
    atualizarProduto,
    deletarProduto,
    lucroProduto
  }
}