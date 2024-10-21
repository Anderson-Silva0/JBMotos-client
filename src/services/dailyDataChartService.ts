import { ApiService } from "./apiService"

export const DailyDataChartService = () => {

    const url = "/dailyDataChart"

    const buscarDadosDoGrafico = () => {
        return ApiService.get(url)
    }

    return {
        buscarDadosDoGrafico
    }
}