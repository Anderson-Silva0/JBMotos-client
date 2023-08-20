export interface Moto {
  id: number | string
  placa: string
  marca: string
  modelo: string
  ano: string
  dataHoraCadastro: string
  cpfCliente: string
  statusMoto: string
}

export const estadoInicialMoto: Moto = {
  id: '',
  placa: '',
  marca: '',
  modelo: '',
  ano: '',
  dataHoraCadastro: '',
  cpfCliente: '',
  statusMoto: ''
}
