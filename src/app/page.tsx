'use client'

import { Card } from '@/components/Card'
import { LockIcon, User } from 'lucide-react'
import { FormGroup } from '@/components/Form-group'
import '@/app/globals.css'
import { ExibeErro } from '@/components/ExibeErro'
import { Olho } from '@/components/Olho'
import { ChangeEvent, useState } from 'react'
import { Erros, salvarErros } from '@/models/erros'
import { Authentication, estadoInicialAuthentication } from '@/models/authentication'
import { mensagemErro, mensagemSucesso } from '@/models/toast'
import { AuthenticationService } from '@/services/authenticationService'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function Login() {

  const router = useRouter()
  const { authLogin } = AuthenticationService()

  const [authentication, setAuthentication] = useState<Authentication>(estadoInicialAuthentication)
  const [erros, setErros] = useState<Erros[]>([])
  const [estaVisivel, setEstaVisivel] = useState<boolean>(false)

  let inputType = "text"
  if (!estaVisivel) {
    inputType = "password"
  }

  const setPropsAuthentication = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setAuthentication({ ...authentication, [key]: e.target.value })
    setErros([])
  }

  const submit = async () => {
    try {
      const response = await authLogin(authentication)
      const token = response.data.token
      Cookies.set('login-token', token)

      mensagemSucesso("Login realizado com sucesso!")
      setAuthentication(estadoInicialAuthentication)
      setErros([])
      router.push('/home')
    } catch (erro: any) {
      salvarErros(erro, erros, setErros)
      console.log(erro)
      if (erro && erro.response && erro.response.data && erro.response.data.loginError) {
        mensagemErro(erro.response.data.loginError)
      }
    }
  }

  return (
    <div className='div-principal'>
      <div className='div-form-container-login'>
        <Card titulo="Login">
          <FormGroup label="" htmlFor="login">
            <div className='div-login-pair'>
              <User size='8vh' strokeWidth={3} />
              <input
                value={authentication.login}
                onChange={e => setPropsAuthentication("login", e)}
                id="login"
                placeholder="Login"
                type="email"
              />
              <div className='div-msg'>
                {<ExibeErro erros={erros} nomeInput='login' />}
              </div>
            </div>
          </FormGroup>
          <FormGroup label="" htmlFor="email">
            <div className='div-login-pair'>
              <LockIcon size='8vh' strokeWidth={3} />
              <input
                value={authentication.senha}
                onChange={e => setPropsAuthentication("senha", e)}
                id="email"
                placeholder="Senha"
                type={inputType}
              />
              <div className='div-msg'>
                {<ExibeErro erros={erros} nomeInput='senha' />}
              </div>
            </div>
          </FormGroup>
          <div id="olho-id">
            <Olho estaVisivel={estaVisivel} setEstaVisivel={setEstaVisivel} isLogin={true} />
          </div>
        </Card>
        <div className="divBotaoCadastrarLogin">
          <button
            onClick={submit}
            type="submit">
            Entrar
          </button>
        </div>
      </div>
    </div>
  )
}
