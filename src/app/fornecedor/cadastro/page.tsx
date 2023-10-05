'use client'

import { Card } from "@/components/Card"
import { ExibeErro } from "@/components/ExibeErro"
import { FormGroup } from "@/components/Form-group"
import { InputCep, InputCnpj, InputTelefone } from "@/components/Input"
import { Endereco, estadoInicialEndereco } from "@/models/endereco"
import { Erros, salvarErros } from "@/models/erros"
import { Fornecedor, estadoInicialFornecedor } from "@/models/fornecedor"
import { mensagemErro, mensagemSucesso } from "@/models/toast"
import { EnderecoService } from "@/services/enderecoService"
import { FornecedorService } from "@/services/fornecedorService"
import { Save } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from "react"

export default function CadastroFornecedor() {
  const { salvarFornecedor } = FornecedorService()

  const {
    salvarEndereco,
    deletarEndereco,
    obterEnderecoPorCep
  } = EnderecoService()

  const [erros, setErros] = useState<Erros[]>([])

  const [fornecedor, setFornecedor] = useState<Fornecedor>(estadoInicialFornecedor)

  const [endereco, setEndereco] = useState<Endereco>(estadoInicialEndereco)

  const setPropsFornecedor = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setFornecedor({ ...fornecedor, [key]: e.target.value })
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

  const exibirErrosFornecedor = async () => {
    if (erros.length > 0) {
      setErros([])
    }
    try {
      await salvarFornecedor(fornecedor)
    } catch (error) {
      salvarErros(error, erros, setErros)
    }
  }

  const submit = async () => {
    try {
      const responseEndereco = await salvarEndereco(endereco)
      try {
        await salvarFornecedor({ ...fornecedor, endereco: responseEndereco.data.id })
        mensagemSucesso("Fornecedor cadastrado com sucesso!")
        setFornecedor(estadoInicialFornecedor)
        setEndereco(estadoInicialEndereco)
        setErros([])
      } catch (erro: any) {
        erros.map(e => e.nomeInput === 'error' && mensagemErro(e.mensagemErro))
        await deletarEndereco(responseEndereco.data.id)
        mensagemErro('Erro no preenchimento dos campos')
        salvarErros(erro, erros, setErros)
      }
    } catch (erro: any) {
      await exibirErrosFornecedor()
      mensagemErro('Erro no preenchimento dos campos.')
      salvarErros(erro, erros, setErros)
    }
  }

  return (
    <div className='div-form-container'>
      <h1 className="centered-text">
        <Save size='6vh' strokeWidth={3} /> Cadastro de Fornecedor
      </h1>
      <Card titulo="Dados do Fornecedor">
        <FormGroup label="Nome: *" htmlFor="nome">
          <input
            value={fornecedor.nome}
            onChange={e => setPropsFornecedor("nome", e)}
            id="nome"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='nome' />}
        </FormGroup>
        <FormGroup label="CNPJ: *" htmlFor="cnpj">
          <InputCnpj
            value={fornecedor.cnpj}
            onChange={e => setPropsFornecedor("cnpj", e)}
          />
          {<ExibeErro erros={erros} nomeInput='cnpj' />}
        </FormGroup>
        <FormGroup label="Celular: *" htmlFor="telefone">
          <InputTelefone
            value={fornecedor.telefone}
            onChange={e => setPropsFornecedor("telefone", e)}
          />
          {<ExibeErro erros={erros} nomeInput='telefone' />}
        </FormGroup>
      </Card>
      <Card titulo="Endereço do Fornecedor">
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
          Cadastrar Fornecedor
        </button>
      </div>
    </div>
  )
}