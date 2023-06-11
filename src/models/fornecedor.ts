export interface Fornecedor {
  cnpj: string
  nome: string
  telefone: string
  endereco: number
  dataHoraCadastro: string
}

export const estadoInicialFornecedor: Fornecedor = {
  cnpj: '',
  nome: '',
  telefone: '',
  endereco: 0,
  dataHoraCadastro: ''
};