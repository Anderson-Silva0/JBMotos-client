export interface ProdutoVenda {
  id: number
  idVenda: number
  idProduto: number
  quantidade: number
  valorUnidade: number | string
  valorTotal: number | string
}

export const estadoInicialProdutoVenda: ProdutoVenda = {
  id: 0,
  idVenda: 0,
  idProduto: 0,
  quantidade: 0,
  valorUnidade: 0,
  valorTotal: 0
}