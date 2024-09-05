'use client'

import Image from "next/image"
import { Dispatch, SetStateAction, useState } from "react"
import imgVisivel from "@/images/olho.png"
import imgNaoVisivel from "@/images/visivel.png"

interface OlhoProp {
  lucroVenda?: string
  isLogin: boolean
  estaVisivel?: boolean
  setEstaVisivel?: Dispatch<SetStateAction<boolean>>
}

export function Olho({ estaVisivel, setEstaVisivel, lucroVenda, isLogin }: OlhoProp) {

  const [estaVisivelNotLogin, setEstaVisivelNotLogin] = useState<boolean>(false)

  const atualizarEstadoOlhoNotLogin = () => {
    if (estaVisivelNotLogin) {
      setEstaVisivelNotLogin(false)
    } else {
      setEstaVisivelNotLogin(true)
    }
  }

  const atualizarEstadoOlho = () => {
    if (setEstaVisivel) {
      if (estaVisivel) {
        setEstaVisivel(false)
      } else {
        setEstaVisivel(true)
      }
    }
  }

  if (isLogin) {
    return (
      estaVisivel ? (
        <>
          <div className="div-olho" onClick={atualizarEstadoOlho}>
            <Image src={imgVisivel} width={25} height={25} alt="" />
          </div>
          <div className='div-resultado'>{lucroVenda}</div>
        </>
      ) : (
        <>
          <div className="div-olho" onClick={atualizarEstadoOlho}>
            <Image src={imgNaoVisivel} width={25} height={25} alt="" />
          </div>
        </>
      )
    )
  } else {
    return (
      estaVisivelNotLogin ? (
        <>
          <div className="div-olho" onClick={atualizarEstadoOlhoNotLogin}>
            <Image src={imgVisivel} width={25} height={25} alt="" />
          </div>
          <div className='div-resultado'>{lucroVenda}</div>
        </>
      ) : (
        <>
          <div className="div-olho" onClick={atualizarEstadoOlhoNotLogin}>
            <Image src={imgNaoVisivel} width={25} height={25} alt="" />
          </div>
          <div>••••••</div>
        </>
      )
    )
  }

}