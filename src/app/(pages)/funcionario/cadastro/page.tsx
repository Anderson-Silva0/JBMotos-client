'use client'

import { Card } from "@/components/Card"
import { ExibeErro } from "@/components/ExibeErro"
import { FormGroup } from "@/components/Form-group"
import { InputCep, InputCpf, InputTelefone } from "@/components/Input"
import { AuthRegisterModelFuncionario, estadoInicialAuthRegisterModelFuncionario, ROLE, roleSelectOptions } from "@/models/authRegisterModel"
import { Endereco, estadoInicialEndereco } from "@/models/endereco"
import { Erros, salvarErros } from "@/models/erros"
import { estadoInicialFuncionario, Funcionario } from "@/models/funcionario"
import { estadoInicialOpcoesSelecoes, OpcoesSelecoes } from "@/models/Selecoes"
import { selectStyles } from "@/models/selectStyles"
import { mensagemErro, mensagemSucesso } from "@/models/toast"
import { AuthenticationService } from "@/services/authenticationService"
import { EnderecoService } from "@/services/enderecoService"
import { Save } from 'lucide-react'
import { ChangeEvent, useEffect, useState, } from "react"
import Select from 'react-select'

export default function CadastroFuncionario() {

  const {
    authRegisterFuncionario
  } = AuthenticationService()
  const {
    obterEnderecoPorCep
  } = EnderecoService()

  const [erros, setErros] = useState<Erros[]>([])
  const [authFuncionario, setAuthFuncionario] = useState<AuthRegisterModelFuncionario>(estadoInicialAuthRegisterModelFuncionario)
  const [funcionario, setFuncionario] = useState<Funcionario>(estadoInicialFuncionario)
  const [endereco, setEndereco] = useState<Endereco>(estadoInicialEndereco)
  const [confirmarSenha, setConfirmarSenha] = useState<string>('')

  const [opcaoSelecionadaRole,
    setOpcaoSelecionadaRole
  ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

  const setPropsAuthFuncionario = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setAuthFuncionario({ ...authFuncionario, [key]: e.target.value })
    setErros([])
  }

  const setPropsFuncionario = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setFuncionario({ ...funcionario, [key]: e.target.value })
    setErros([])
  }

  const setPropsEndereco = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setEndereco({ ...endereco, [key]: e.target.value })
    if (endereco.cep.length < 9 || key) {
      setErros([])
    }
  }

  useEffect(() => {
    obterEnderecoPorCep(endereco, setEndereco, erros, setErros)
  }, [endereco.cep])

  useEffect(() => {
    setAuthFuncionario(
      {
        ...authFuncionario,
        role: String(opcaoSelecionadaRole?.value)
      }
    )
    setErros([])
  }, [opcaoSelecionadaRole])

  const submit = async () => {
    try {
      if (confirmarSenha === authFuncionario.senha) {
        await authRegisterFuncionario({ ...authFuncionario, funcionario: { ...funcionario, endereco } })
      } else {
        throw new Error()
      }
      mensagemSucesso("Funcionário cadastrado com sucesso!")
      setAuthFuncionario(estadoInicialAuthRegisterModelFuncionario)
      setFuncionario(estadoInicialFuncionario)
      setEndereco(estadoInicialEndereco)
      setErros([])
    } catch (erro: any) {
      mensagemErro('Erro no preenchimento dos campos.')
      if (confirmarSenha != authFuncionario.senha) {
        mensagemErro("As senhas não estão iguais.")
      }
      salvarErros(erro, erros, setErros)
    }
  }

  return (
    <div className='div-form-container'>
      <h1 className="centered-text">
        <Save size='6vh' strokeWidth={3} /> Cadastro de Funcionário
      </h1>
      <Card titulo="Dados do Funcionário">
        <FormGroup label="Nome: *" htmlFor="nome">
          <input
            value={funcionario.nome}
            onChange={e => setPropsFuncionario("nome", e)}
            id="nome"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='nome' />}
        </FormGroup>
        <FormGroup label="CPF: *" htmlFor="cpf">
          <InputCpf
            value={funcionario.cpf}
            onChange={e => setPropsFuncionario("cpf", e)}
          />
          {<ExibeErro erros={erros} nomeInput='cpf' />}
        </FormGroup>
        <FormGroup label="Celular: *" htmlFor="telefone">
          <InputTelefone
            value={funcionario.telefone}
            onChange={e => setPropsFuncionario("telefone", e)}
          />
          {<ExibeErro erros={erros} nomeInput='telefone' />}
        </FormGroup>
        <FormGroup label="Login: *" htmlFor="login">
          <input
            value={authFuncionario.login}
            id="email"
            onChange={e => setPropsAuthFuncionario("login", e)}
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='login' />}
          {<ExibeErro erros={erros} nomeInput='loginError' />}
        </FormGroup>
        <FormGroup label="Senha: *" htmlFor="senha">
          <input
            value={authFuncionario.senha}
            onChange={e => setPropsAuthFuncionario("senha", e)}
            id="senha"
            type="password"
          />
          {<ExibeErro erros={erros} nomeInput='senha' />}
        </FormGroup>
        <FormGroup label="Confirmar senha: *" htmlFor="confirmar-senha">
          <input
            value={confirmarSenha}
            onChange={e => setConfirmarSenha(e.target.value)}
            id="confirmar-senha"
            type="password"
          />
          {<ExibeErro erros={erros} nomeInput='confirmarSenha' />}
        </FormGroup>
        <FormGroup label="Permissão no Sistema: *" htmlFor="formaDePagamento">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={opcaoSelecionadaRole}
            onChange={(option: any) => setOpcaoSelecionadaRole(option)}
            options={roleSelectOptions}
            instanceId="select-divisoes"
          />
          {<ExibeErro erros={erros} nomeInput='role' />}
        </FormGroup>
      </Card>
      <Card titulo="Endereço do Funcionário">
        <FormGroup label="CEP: *" htmlFor="cep">
          <span className="cep-message">
            Digite o CEP para preenchimento automático do endereço.
          </span>
          <InputCep
            id='cep'
            value={endereco.cep}
            onChange={e => setPropsEndereco("cep", e)}
          />
          {<ExibeErro erros={erros} nomeInput='cep' />}
        </FormGroup>
        <FormGroup label="Logradouro: *" htmlFor="rua">
          <input
            value={endereco.rua}
            onChange={e => setPropsEndereco("rua", e)}
            id="rua"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='rua' />}
        </FormGroup>
        <FormGroup label="Número: *" htmlFor="numero">
          <input
            className='input-number-form'
            value={endereco.numero}
            onChange={e => setPropsEndereco("numero", e)}
            id="numero"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<ExibeErro erros={erros} nomeInput='numero' />}
        </FormGroup>
        <FormGroup label="Bairro: *" htmlFor="bairro">
          <input
            value={endereco.bairro}
            onChange={e => setPropsEndereco("bairro", e)}
            id="bairro"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='bairro' />}
        </FormGroup>
        <FormGroup label="Cidade: *" htmlFor="cidade">
          <input
            value={endereco.cidade}
            onChange={e => setPropsEndereco("cidade", e)}
            id="cidade"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='cidade' />}
        </FormGroup>
      </Card>
      <div className="divBotaoCadastrar">
        <button
          onClick={submit}
          type="submit">
          Cadastrar Funcionário
        </button>
      </div>
    </div>
  )
}