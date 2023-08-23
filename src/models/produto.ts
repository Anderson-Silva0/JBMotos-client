export interface Produto {
  id: number
  nome: string
  precoCusto: number | string
  precoVenda: number | string
  marca: string
  idEstoque: number
  cnpjFornecedor: string
  statusProduto: string
  dataHoraCadastro: string
}

export const estadoInicialProduto: Produto = {
  id: 0,
  nome: '',
  precoCusto: 0,
  precoVenda: 0,
  marca: '',
  idEstoque: 0,
  cnpjFornecedor: '',
  statusProduto: '',
  dataHoraCadastro: ''
}