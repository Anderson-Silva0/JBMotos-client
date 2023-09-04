'use client'

import { Card } from "@/components/Card"
import { ExibeErro } from "@/components/ExibeErro"
import { FormGroup } from "@/components/Form-group"
import { InputCep, InputCpf, InputTelefone } from "@/components/Input"
import { Endereco, estadoInicialEndereco } from "@/models/endereco"
import { Erros, salvarErros } from "@/models/erros"
import { Funcionario, estadoInicialFuncionario } from "@/models/funcionario"
import { mensagemErro, mensagemSucesso } from "@/models/toast"
import { EnderecoService } from "@/services/enderecoService"
import { FuncionarioService } from "@/services/funcionarioService"
import { Save } from 'lucide-react'
import { ChangeEvent, useEffect, useState, } from "react"

export default function CadastroFuncionario() {

  const {
    salvarFuncionario
  } = FuncionarioService()
  const {
    salvarEndereco,
    deletarEndereco,
    obterEnderecoPorCep
  } = EnderecoService()

  const [erros, setErros] = useState<Erros[]>([])

  const [funcionario, setFuncionario] = useState<Funcionario>(estadoInicialFuncionario)

  const [endereco, setEndereco] = useState<Endereco>(estadoInicialEndereco)

  const setPropsFuncionario = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setFuncionario({ ...funcionario, [key]: e.target.value })
    setErros([])
  }

  const setPropsEndereco = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setEndereco({ ...endereco, [key]: e.target.value })
    if (endereco.cep.length < 9) {
      setErros([])
    }
  }

  useEffect(() => {
    obterEnderecoPorCep(endereco, setEndereco, erros, setErros)
  }, [endereco.cep])

  const exibirErrosFuncionario = async () => {
    if (erros.length > 0) {
      setErros([])
    }
    try {
      await salvarFuncionario(funcionario)
    } catch (error) {
      salvarErros(error, erros, setErros)
    }
  }

  const submit = async () => {
    try {
      await exibirErrosFuncionario()
      const responseEndereco = await salvarEndereco(endereco)
      setEndereco({ ...endereco, id: responseEndereco.data.id })
      setFuncionario({ ...funcionario, endereco: responseEndereco.data.id })
    } catch (error: any) {
      mensagemErro('Erro no preenchimento dos campos.')
      salvarErros(error, erros, setErros)
    }
  }

  useEffect(() => {
    const salvarFuncionarioAtualizado = async () => {
      try {
        await salvarFuncionario(funcionario)
        mensagemSucesso("Funcionário cadastrado com sucesso!")
        setFuncionario(estadoInicialFuncionario)
        setEndereco(estadoInicialEndereco)
      } catch (erro: any) {
        erros.map(e => e.nomeInput === 'error' && mensagemErro(e.mensagemErro))
        await deletarEndereco(endereco.id)
        setEndereco({ ...endereco, id: 0 })
        setFuncionario({ ...funcionario, endereco: 0 })
        mensagemErro('Erro no preenchimento dos campos')
      }
    }
    if (endereco.id !== 0) {
      salvarFuncionarioAtualizado()
    }
  }, [funcionario.endereco])

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