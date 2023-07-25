export interface Fornecedor {
  cnpj: string
  nome: string
  telefone: string
  statusFornecedor: string
  endereco: number
  dataHoraCadastro: string
}

export const estadoInicialFornecedor: Fornecedor = {
  cnpj: '',
  nome: '',
  telefone: '',
  statusFornecedor: '',
  endereco: 0,
  dataHoraCadastro: ''
};