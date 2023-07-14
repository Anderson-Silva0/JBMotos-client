'use client'

import Image from "next/image"
import { useState } from "react"
import imgVisivel from "@/images/olho.png"
import imgNaoVisivel from "@/images/visivel.png"

interface OlhoProp {
  lucroVenda: string
}

export function Olho({ lucroVenda }: OlhoProp) {
  const [estaVisivel, setEstaVisivel] = useState<boolean>(false)

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
        <div >••••••</div>
      </>
    )
  )
}