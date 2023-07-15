import { ApiService } from "./apiService"

export const PedidoService = () => {

  const url = "/pedido"

  const salvarPedido = (dados: object) => {
    return ApiService.post(`${url}`, dados)
  }

  const buscarTodosPedidos = () => {
    return ApiService.get(`${url}/buscar-todos`)
  }

  const buscarPedidoPorId = (id: number) => {
    return ApiService.get(`${url}/buscar/${id}`)
  }

  const atualizarPedido = (id: number, dados: object) => {
    return ApiService.put(`${url}/atualizar/${id}`, dados)
  }

  const deletarPedido = (id: number) => {
    return ApiService.delete(`${url}/deletar/${id}`)
  }

  const lucroDoPedido = (id: number) => {
    return ApiService.get(`${url}/lucro-pedido/${id}`)
  }

  const valorTotalDoPedido = (id: number) => {
    return ApiService.get(`${url}/valor-total-pedido/${id}`)
  }

  const buscarProdutosDoPedido = (id: number) => {
    return ApiService.get(`${url}/produtos-do-pedido/${id}`)
  }

  return {
    salvarPedido,
    buscarTodosPedidos,
    buscarPedidoPorId,
    atualizarPedido,
    deletarPedido,
    lucroDoPedido,
    valorTotalDoPedido,
    buscarProdutosDoPedido
  }
}