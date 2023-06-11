export interface Endereco {
    id: number,
    rua: string,
    cep: string,
    numero: number | string,
    bairro: string,
    cidade: string
}

export const estadoInicialEndereco: Endereco = {
    id: 0,
    rua: '',
    cep: '',
    numero: '',
    bairro: '',
    cidade: ''
}