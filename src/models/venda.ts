import { ProdutoVenda } from "./ProdutoVenda"
import { PagamentoCartao } from "./pagamentoCartao"

export interface Venda {
  id: number
  cpfCliente: string
  cpfFuncionario: string
  dataHoraCadastro: string
  observacao: string
  formaDePagamento: string
  pagamentoCartao: PagamentoCartao | null,
  produtosVenda: ProdutoVenda[]
}

export const estadoInicialVenda: Venda = {
  id: 0,
  cpfCliente: '',
  cpfFuncionario: '',
  dataHoraCadastro: '',
  observacao: '',
  formaDePagamento: '',
  pagamentoCartao: null,
  produtosVenda: []
}