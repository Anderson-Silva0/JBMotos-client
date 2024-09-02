import { Card } from '@/components/Card'
import '../styles/home.css'
import { LockIcon, User } from 'lucide-react'
import { FormGroup } from '@/components/Form-group'
import { ExibeErro } from '@/components/ExibeErro'

export default function Login() {
  return (
    <div className='div-form-container-login'>
      {/* <h1 className="centered-text">
        <User size='10vh' strokeWidth={3} />
      </h1> */}
      <Card titulo="Login">
        <FormGroup label="" htmlFor="login">
          <div className='div-login-pair'>
            <User size='8vh' strokeWidth={3} />
            <input
              // value={cliente.email}
              value={""}
              // onChange={e => setPropsCliente("email", e)}
              id="login"
              placeholder="Login"
              type="email"
            />
            {/* {<ExibeErro erros={erros} nomeInput='email' />} */}
          </div>
        </FormGroup>
        <FormGroup label="" htmlFor="email">
          <div className='div-login-pair'>
            <LockIcon size='8vh' strokeWidth={3} />
            <input
              // value={cliente.email}
              value={""}
              // onChange={e => setPropsCliente("email", e)}
              id="email"
              placeholder="Senha"
              type="password"
            />
            {/* {<ExibeErro erros={erros} nomeInput='email' />} */}
          </div>
        </FormGroup>
      </Card>
      <div className="divBotaoCadastrarLogin">
        <button
          // onClick={submit}
          type="submit">
          Entrar
        </button>
      </div>
    </div>
  )
}
