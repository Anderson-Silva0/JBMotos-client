import { Venda } from "./venda"

export interface Servico {
    id: number,
    cpfFuncionario: string,
    idMoto: number,
    venda: Venda | null,
    dataHoraCadastro: string,
    servicosRealizados: string,
    observacao: string,
    precoMaoDeObra: number
}

export const estadoInicialServico: Servico = {
    id: 0,
    cpfFuncionario: '',
    idMoto: 0,
    venda: null,
    dataHoraCadastro: '',
    servicosRealizados: '',
    observacao: '',
    precoMaoDeObra: 0
}