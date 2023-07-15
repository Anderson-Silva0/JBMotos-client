export interface Estoque {
  id: number
  estoqueMinimo: number | string
  estoqueMaximo: number | string
  quantidade: number | string
  status: string
}

export const estadoInicialEstoque: Estoque = {
  id: 0,
  estoqueMinimo: '',
  estoqueMaximo: '',
  quantidade: '',
  status: ''
}