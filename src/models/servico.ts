import { estadoInicialMoto, Moto } from "./moto"
import { Venda } from "./venda"

export interface Servico {
    id: number,
    cpfFuncionario: string,
    moto: Moto,
    venda: Venda | null,
    dataHoraCadastro: string,
    servicosRealizados: string,
    observacao: string,
    precoMaoDeObra: number
}

export const estadoInicialServico: Servico = {
    id: 0,
    cpfFuncionario: '',
    moto: estadoInicialMoto,
    venda: null,
    dataHoraCadastro: '',
    servicosRealizados: '',
    observacao: '',
    precoMaoDeObra: 0
}