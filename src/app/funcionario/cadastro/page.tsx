'use client'

import { Card } from "@/components/Card"
import { ExibeErro } from "@/components/ExibeErro"
import { FormGroup } from "@/components/Form-group"
import { InputCep, InputCpf, InputTelefone } from "@/components/Input"
import { Endereco, estadoInicialEndereco } from "@/models/endereco"
import { Erros } from "@/models/erros"
import { Funcionario, estadoInicialFuncionario } from "@/models/funcionario"
import { mensagemSucesso, mensagemErro } from "@/models/toast"
import { EnderecoService } from "@/services/enderecoService"
import { FuncionarioService } from "@/services/funcionarioService"
import { useState, ChangeEvent, useEffect, } from "react"

export default function CadastroFuncionario() {

  const {
    salvarFuncionario
  } = FuncionarioService()
  const {
    salvarEndereco,
    deletarEndereco
  } = EnderecoService()

  const [erros, setErros] = useState<Erros[]>([])

  const [funcionario, setFuncionario] = useState<Funcionario>(estadoInicialFuncionario)

  const setPropsFuncionario = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setFuncionario({ ...funcionario, [key]: e.target.value })
  }

  const [endereco, setEndereco] = useState<Endereco>(estadoInicialEndereco)

  const setPropsEndereco = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setEndereco({ ...endereco, [key]: e.target.value })
  }

  const exibirErrosFuncionario = async () => {
    if (erros.length > 0) {
      setErros([])
    }

    try {
      await salvarFuncionario(funcionario)
    } catch (error) {
      exibirErros(error)
    }
  }

  const submit = async () => {
    try {
      await exibirErrosFuncionario()
      const responseEndereco = await salvarEndereco(endereco)
      setEndereco({ ...endereco, id: responseEndereco.data.id })
      setFuncionario({ ...funcionario, endereco: responseEndereco.data.id })
    } catch (erro: any) {
      exibirErros(erro)
    }
  }

  const exibirErros = (erro: any) => {
    const objErro = erro.response.data
    const keys = Object.keys(objErro)
    if (!objErro.error && erros.length <= 8) {
      setErros((errosAntigos) => {
        const novosErros = keys.map((k) => ({ nomeInput: k, mensagemErro: objErro[k] }));
        return [...errosAntigos, ...novosErros];
      });
    }
    const erroIgnorado = "Endereço não encontrado para o Id informado."
    if (objErro.error && objErro.error !== erroIgnorado) {
      setErros((errosAntigos) => [...errosAntigos, { nomeInput: 'error', mensagemErro: objErro.error }])
    }
  }

  useEffect(() => {
    const salvarFuncionarioAtualizado = async () => {
      try {
        await salvarFuncionario(funcionario)
        mensagemSucesso("Funcionário e endereço salvos com sucesso!")
        setFuncionario(estadoInicialFuncionario)
        setEndereco(estadoInicialEndereco)
      } catch (erro: any) {
        erros.map(e => e.nomeInput === 'error' && mensagemErro(e.mensagemErro))
        await deletarEndereco(endereco.id)
        setEndereco({ ...endereco, id: 0 })
        setFuncionario({ ...funcionario, endereco: 0 })
      }
    }
    if (endereco.id !== 0) {
      salvarFuncionarioAtualizado()
    }
  }, [funcionario, deletarEndereco, endereco, salvarFuncionario, erros])

  return (
    <div className='div-form-container'>
      <Card titulo="Dados do Funcionário">
        <form >
          <FormGroup label="CPF: *" htmlFor="cpf">
            <InputCpf
              value={funcionario.cpf}
              onChange={e => setPropsFuncionario("cpf", e)}
            />
            {<ExibeErro erros={erros} nomeInput='cpf' />}
          </FormGroup>
          <FormGroup label="Nome: *" htmlFor="nome">
            <input
              value={funcionario.nome}
              onChange={e => setPropsFuncionario("nome", e)}
              id="nome"
              type="text"
            />
            {<ExibeErro erros={erros} nomeInput='nome' />}
          </FormGroup>
          <FormGroup label="Telefone: *" htmlFor="telefone">
            <InputTelefone
              value={funcionario.telefone}
              onChange={e => setPropsFuncionario("telefone", e)}
            />
            {<ExibeErro erros={erros} nomeInput='telefone' />}
          </FormGroup>
        </form>
      </Card>
      <Card titulo="Endereço do Funcionario">
        <FormGroup label="Endereço: *" htmlFor="rua">
          <input
            value={endereco.rua}
            onChange={e => setPropsEndereco("rua", e)}
            id="rua"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='rua' />}
        </FormGroup>
        <FormGroup label="CEP: *" htmlFor="cep">
          <InputCep
            value={endereco.cep}
            onChange={e => setPropsEndereco("cep", e)}
          />
          {<ExibeErro erros={erros} nomeInput='cep' />}
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