import { Endereco } from "./endereco"

export interface Cliente {
    cpf: string
    nome: string
    email: string
    telefone: string
    statusCliente: string
    endereco: Endereco | null
    dataHoraCadastro: string
}

export const estadoInicialCliente: Cliente = {
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    statusCliente: '',
    endereco: null,
    dataHoraCadastro: ''
}
