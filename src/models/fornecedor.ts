import { Endereco } from "./endereco"

export interface Fornecedor {
  cnpj: string
  nome: string
  telefone: string
  statusFornecedor: string
  endereco: Endereco | null
  dataHoraCadastro: string
}

export const estadoInicialFornecedor: Fornecedor = {
  cnpj: '',
  nome: '',
  telefone: '',
  statusFornecedor: '',
  endereco: null,
  dataHoraCadastro: ''
};