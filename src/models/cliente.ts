export interface Cliente {
    cpf: string
    nome: string
    email: string
    telefone: string
    statusCliente: string
    endereco: number
    dataHoraCadastro: string
}

export const estadoInicialCliente: Cliente = {
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    statusCliente: '',
    endereco: 0,
    dataHoraCadastro: ''
}
