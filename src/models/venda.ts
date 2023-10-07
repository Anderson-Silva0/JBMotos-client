export interface Venda {
  id: number
  cpfCliente: string
  cpfFuncionario: string
  dataHoraCadastro: string
  observacao: string
  formaDePagamento: string
}

export const estadoInicialVenda: Venda = {
  id: 0,
  cpfCliente: '',
  cpfFuncionario: '',
  dataHoraCadastro: '',
  observacao: '',
  formaDePagamento: ''
}