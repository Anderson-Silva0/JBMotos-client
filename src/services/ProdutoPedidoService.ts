import { ApiService } from "./apiService"

export const ProdutoPedidoService = () => {

  const url = "/produtopedido"

  const salvarProdutoPedido = (dados: object) => {
    return ApiService.post(`${url}`, dados)
  }

  const buscarTodosProdutoPedido = () => {
    return ApiService.get(`${url}/buscar-todos`)
  }

  const buscarProdutoPedidoPorId = (id: number) => {
    return ApiService.get(`${url}/buscar/${id}`)
  }

  const atualizarProdutoPedido = (id: number, dados: object) => {
    return ApiService.put(`${url}/atualizar/${id}`, dados)
  }

  const deletarProdutoPedido = (id: number) => {
    return ApiService.delete(`${url}/deletar/${id}`)
  }

  const buscarTodosPorIdPedido = (idPedido: number) => {
    return ApiService.get(`${url}/produtos-pedido/${idPedido}`)
  }

  return {
    salvarProdutoPedido,
    buscarTodosProdutoPedido,
    buscarProdutoPedidoPorId,
    atualizarProdutoPedido,
    deletarProdutoPedido,
    buscarTodosPorIdPedido
  }
}