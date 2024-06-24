import { Endereco } from "./endereco"

export interface Funcionario {
  cpf: string
  nome: string
  telefone: string
  statusFuncionario: string
  endereco: Endereco | null
  dataHoraCadastro: string
}

export const estadoInicialFuncionario: Funcionario = {
  cpf: '',
  nome: '',
  telefone: '',
  statusFuncionario: '',
  endereco: null,
  dataHoraCadastro: ''
};