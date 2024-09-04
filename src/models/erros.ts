import { Dispatch, SetStateAction } from "react"

export interface Erros {
  nomeInput: string
  mensagemErro: string
}

export const salvarErros = (erro: any, erros: Erros[], setErros: Dispatch<SetStateAction<Erros[]>>) => {
  if (erro.response && erro.response.data) {
    const objErro = erro.response.data
    const keys = Object.keys(objErro)
    if (!objErro.error && erros.length <= 8) {
      setErros((errosAntigos) => {
        const novosErros = keys.map((k) => ({ nomeInput: k, mensagemErro: objErro[k] }))
        return [...errosAntigos, ...novosErros]
      })
    }
    const erroIgnorado = "Endereço não encontrado para o Id informado."
    if (objErro.error && objErro.error !== erroIgnorado) {
      setErros((errosAntigos) => [...errosAntigos, { nomeInput: 'error', mensagemErro: objErro.error }])
    }
  }
}