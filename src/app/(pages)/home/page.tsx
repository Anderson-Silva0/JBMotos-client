'use client'

import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { decode } from 'jsonwebtoken'
import { DecodedToken } from '@/middleware'

export default function HomePage() {

  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const token = Cookies.get('login-token')
    if (token) {
      const decodedToken = decode(token) as DecodedToken
      setUserName(decodedToken.userName)
    }
  }, [])

  return (
    <div style={{textAlign: 'center'}}>
      <h1>Olá {userName}!</h1>
      <h2>Bem-vindo ao sistema <span style={{fontSize: '1.2em', fontWeight: 'bolder'}}>JB Motos</span></h2>
      <h3>Utilize as ferramentas para acessar as funcionalidades do sistema.</h3>
    </div>
  )
}
