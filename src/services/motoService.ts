import { ApiService } from "./apiService"

export const MotoService = () => {

  const url = "/moto"

  const salvarMoto = (dados: object) => {
    return ApiService.post(`${url}`, dados)
  }

  const buscarTodasMotos = () => {
    return ApiService.get(`${url}/buscar-todas`)
  }

  const buscarMotosPorCpfCliente = (cpfCliente: string) => {
    return ApiService.get(`${url}/buscar-por-cpf/${cpfCliente}`)
  }

  const buscarMotoPorId = (id: number) => {
    return ApiService.get(`${url}/buscar-por-id/${id}`)
  }

  const buscarMotoPorPlaca = (placa: string) => {
    return ApiService.get(`${url}/buscar-por-placa/${placa}`)
  }

  const filtrarMoto = (nomeCampo: string, valor: string) => {
    return ApiService.get(`${url}/filtrar/?${nomeCampo}=${valor}`)
  }

  const alternarStatusMoto = (id: number | string) => {
    return ApiService.patch(`${url}/alternar-status/${id}`)
  }

  const atualizarMoto = (id: number, dados: object) => {
    return ApiService.put(`${url}/atualizar/${id}`, dados)
  }

  const deletarMotoPorId = (id: number) => {
    return ApiService.delete(`${url}/deletar-por-id/${id}`)
  }

  const deletarMotoPorPlaca = (placa: string) => {
    return ApiService.delete(`${url}/deletar-por-placa/${placa}`)
  }

  return {
    salvarMoto,
    buscarTodasMotos,
    buscarMotosPorCpfCliente,
    buscarMotoPorId,
    buscarMotoPorPlaca,
    filtrarMoto,
    alternarStatusMoto,
    atualizarMoto,
    deletarMotoPorId,
    deletarMotoPorPlaca
  }
}