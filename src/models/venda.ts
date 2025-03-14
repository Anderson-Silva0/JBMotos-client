import { ProdutoVenda } from "./ProdutoVenda"
import { Cliente, estadoInicialCliente } from "./cliente"
import { estadoInicialFuncionario, Funcionario } from "./funcionario"
import { PagamentoCartao } from "./pagamentoCartao"

export interface Venda {
  id: number
  cliente: Cliente
  funcionario: Funcionario
  dataHoraCadastro: string
  observacao: string
  formaDePagamento: string
  pagamentoCartao: PagamentoCartao | null,
  produtosVenda: ProdutoVenda[]
  valorTotalVenda: number
}

export const estadoInicialVenda: Venda = {
  id: 0,
  cliente: estadoInicialCliente,
  funcionario: estadoInicialFuncionario,
  dataHoraCadastro: '',
  observacao: '',
  formaDePagamento: '',
  pagamentoCartao: null,
  produtosVenda: [],
  valorTotalVenda: 0
}