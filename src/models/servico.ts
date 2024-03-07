export interface Servico {
    id: number,
    cpfFuncionario: string,
    idMoto: number,
    idVenda: number | null,
    dataHoraCadastro: string,
    servicosRealizados: string,
    observacao: string,
    precoMaoDeObra: number
}

export const estadoInicialServico: Servico = {
    id: 0,
    cpfFuncionario: '',
    idMoto: 0,
    idVenda: null,
    dataHoraCadastro: '',
    servicosRealizados: '',
    observacao: '',
    precoMaoDeObra: 0
}