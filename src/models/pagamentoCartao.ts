export interface PagamentoCartao {
    id?: number,
    parcela: string | number,
    bandeira: string | number,
    totalTaxas: string | number,
    idVenda: number
}

export const estadoInicialPagamentoCartao: PagamentoCartao = {
    id: 0,
    parcela: '',
    bandeira: '',
    totalTaxas: 0,
    idVenda: 0
}