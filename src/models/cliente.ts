export interface Cliente {
    cpf: string
    nome: string
    email: string
    telefone: string
    endereco: number
    dataHoraCadastro: string
}

export const estadoInicialCliente: Cliente = {
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    endereco: 0,
    dataHoraCadastro: ''
};
