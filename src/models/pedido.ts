export interface Pedido {
  id: number
  cpfCliente: string
  cpfFuncionario: string
  dataHoraCadastro: string
  observacao: string
  formaDePagamento: string
}

export const estadoInicialPedido: Pedido = {
  id: 0,
  cpfCliente: '',
  cpfFuncionario: '',
  dataHoraCadastro: '',
  observacao: '',
  formaDePagamento: ''
}