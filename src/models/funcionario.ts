export interface Funcionario {
  cpf: string
  nome: string
  telefone: string
  statusFuncionario: string
  endereco: number
  dataHoraCadastro: string
}

export const estadoInicialFuncionario: Funcionario = {
  cpf: '',
  nome: '',
  telefone: '',
  statusFuncionario: '',
  endereco: 0,
  dataHoraCadastro: ''
};