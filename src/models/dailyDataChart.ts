export interface DailyDataChart {
    dataMillis: number
    qtdVenda: number | null
    qtdServico: number | null
}

export const estadoInicialDailyDataChart: DailyDataChart = {
    dataMillis: 0,
    qtdVenda: null,
    qtdServico: null
}