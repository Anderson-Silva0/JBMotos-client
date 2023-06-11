export interface Funcionario {
  cpf: string
  nome: string
  telefone: string
  endereco: number
  dataHoraCadastro: string
}

export const estadoInicialFuncionario: Funcionario = {
  cpf: '',
  nome: '',
  telefone: '',
  endereco: 0,
  dataHoraCadastro: ''
};