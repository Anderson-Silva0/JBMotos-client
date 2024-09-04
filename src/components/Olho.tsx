'use client'

import Image from "next/image"
import { Dispatch, SetStateAction, useState } from "react"
import imgVisivel from "@/images/olho.png"
import imgNaoVisivel from "@/images/visivel.png"

interface OlhoProp {
  lucroVenda?: string
  isLogin: boolean
  estaVisivel: boolean
  setEstaVisivel: Dispatch<SetStateAction<boolean>>
}

export function Olho({ estaVisivel, setEstaVisivel, lucroVenda, isLogin }: OlhoProp) {

  const atualizarEstadoOlho = () => {
    if (estaVisivel) {
      setEstaVisivel(false)
    } else {
      setEstaVisivel(true)
    }
  }

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
        {!isLogin &&
          <div>••••••</div>
        }
      </>
    )
  )
}