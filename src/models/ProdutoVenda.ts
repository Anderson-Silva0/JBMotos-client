import { estadoInicialProduto, Produto } from "./produto"

export interface ProdutoVenda {
  id: number
  idVenda: number
  produto: Produto
  quantidade: number
  valorUnidade: number | string
  valorTotal: number | string
  idProduto: number
}

export const estadoInicialProdutoVenda: ProdutoVenda = {
  id: 0,
  idVenda: 0,
  produto: estadoInicialProduto,
  quantidade: 0,
  valorUnidade: 0,
  valorTotal: 0,
  idProduto: 0
}