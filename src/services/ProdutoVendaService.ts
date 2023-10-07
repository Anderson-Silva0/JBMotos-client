import { ApiService } from "./apiService"

export const ProdutoVendaService = () => {

  const url = "/produtovenda"

  const salvarProdutoVenda = (dados: object) => {
    return ApiService.post(`${url}`, dados)
  }

  const buscarTodosProdutoVenda = () => {
    return ApiService.get(`${url}/buscar-todos`)
  }

  const buscarProdutoVendaPorId = (id: number) => {
    return ApiService.get(`${url}/buscar/${id}`)
  }

  const atualizarProdutoVenda = (id: number, dados: object) => {
    return ApiService.put(`${url}/atualizar/${id}`, dados)
  }

  const deletarProdutoVenda = (id: number) => {
    return ApiService.delete(`${url}/deletar/${id}`)
  }

  const buscarTodosPorIdVenda = (idVenda: number) => {
    return ApiService.get(`${url}/produtos-venda/${idVenda}`)
  }

  return {
    salvarProdutoVenda,
    buscarTodosProdutoVenda,
    buscarProdutoVendaPorId,
    atualizarProdutoVenda,
    deletarProdutoVenda,
    buscarTodosPorIdVenda
  }
}