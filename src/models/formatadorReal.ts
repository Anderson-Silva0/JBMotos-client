export const formatarParaReal = (valor: number | string): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export const formatarParaPercentual = (valor: number): string => {
  valor = !valor ? 0 : valor

  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).replace('R$', '%')
}