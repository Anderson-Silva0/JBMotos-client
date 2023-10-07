import { ApiService } from "./apiService"

export const VendaService = () => {

  const url = "/venda"

  const salvarVenda = (dados: object) => {
    return ApiService.post(`${url}`, dados)
  }

  const buscarTodasVendas = () => {
    return ApiService.get(`${url}/buscar-todas`)
  }

  const buscarVendaPorId = (id: number) => {
    return ApiService.get(`${url}/buscar/${id}`)
  }

  const filtrarVenda = (nomeCampo: string, valor: string) => {
    return ApiService.get(`${url}/filtrar/?${nomeCampo}=${valor}`)
  }

  const atualizarVenda = (id: number, dados: object) => {
    return ApiService.put(`${url}/atualizar/${id}`, dados)
  }

  const deletarVenda = (id: number) => {
    return ApiService.delete(`${url}/deletar/${id}`)
  }

  const lucroDaVenda = (id: number) => {
    return ApiService.get(`${url}/lucro-venda/${id}`)
  }

  const valorTotalDaVenda = (id: number) => {
    return ApiService.get(`${url}/valor-total-venda/${id}`)
  }

  const buscarProdutosDaVenda = (id: number) => {
    return ApiService.get(`${url}/produtos-do-venda/${id}`)
  }

  return {
    salvarVenda,
    buscarTodasVendas,
    buscarVendaPorId,
    filtrarVenda,
    atualizarVenda,
    deletarVenda,
    lucroDaVenda,
    valorTotalDaVenda,
    buscarProdutosDaVenda
  }
}