export interface ProdutoPedido {
  id: number
  idPedido: number
  idProduto: number
  quantidade: number
  valorUnidade: number | string
  valorTotal: number | string
}

export const estadoInicialProdutoPedido: ProdutoPedido = {
  id: 0,
  idPedido: 0,
  idProduto: 0,
  quantidade: 0,
  valorUnidade: 0,
  valorTotal: 0
}