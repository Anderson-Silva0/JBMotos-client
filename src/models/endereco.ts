export interface Address {
    id: number,
    road: string,
    cep: string,
    number: number | string,
    neighborhood: string,
    city: string
}

export const addressInitialState: Address = {
    id: 0,
    road: '',
    cep: '',
    number: '',
    neighborhood: '',
    city: ''
}