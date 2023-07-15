export const formatarParaReal = (valor: number | string): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}