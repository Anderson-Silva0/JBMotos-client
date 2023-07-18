import React from 'react'

interface Erro {
  nomeInput: string
  mensagemErro: string
}

interface ExibeErroProps {
  erros: Erro[]
  nomeInput: string
}

export function ExibeErro({ erros, nomeInput }: ExibeErroProps) {
  const erroExistente = erros.find(erro => erro.nomeInput === nomeInput)

  if (erroExistente) {
    return (
      <span className="erro">
        {erroExistente.mensagemErro}
      </span>
    )
  }
  return null
}
