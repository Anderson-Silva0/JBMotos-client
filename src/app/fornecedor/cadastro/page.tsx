'use client'

import { Card } from "@/components/Card"
import { ExibeErro } from "@/components/ExibeErro"
import { FormGroup } from "@/components/Form-group"
import { InputCep, InputCnpj, InputTelefone } from "@/components/Input"
import { Endereco, estadoInicialEndereco } from "@/models/endereco"
import { Erros } from "@/models/erros"
import { Fornecedor, estadoInicialFornecedor } from "@/models/fornecedor"
import { mensagemSucesso, mensagemErro } from "@/models/toast"
import { EnderecoService } from "@/services/enderecoService"
import { FornecedorService } from "@/services/fornecedorService"
import { useState, ChangeEvent, useEffect } from "react"
import { Save } from 'lucide-react'

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
    setErros([])
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
      exibirErros(error)
    }
  }

  const submit = async () => {
    try {
      await exibirErrosFornecedor()
      const responseEndereco = await salvarEndereco(endereco)
      setEndereco({ ...endereco, id: responseEndereco.data.id })
      setFornecedor({ ...fornecedor, endereco: responseEndereco.data.id })
    } catch (erro: any) {
      mensagemErro('Erro no preenchimento dos campos.')
      exibirErros(erro)
    }
  }

  useEffect(() => {
    const salvarFornecedorAtualizado = async () => {
      try {
        await salvarFornecedor(fornecedor)
        mensagemSucesso("Fornecedor cadastrado com sucesso!")
        setFornecedor(estadoInicialFornecedor)
        setEndereco(estadoInicialEndereco)
      } catch (erro: any) {
        erros.map(e => e.nomeInput === 'error' && mensagemErro(e.mensagemErro))
        await deletarEndereco(endereco.id)
        setEndereco({ ...endereco, id: 0 })
        setFornecedor({ ...fornecedor, endereco: 0 })
        mensagemErro('Erro no preenchimento dos campos.')
      }
    }
    if (endereco.id !== 0) {
      salvarFornecedorAtualizado()
    }
  }, [fornecedor])

  const exibirErros = (erro: any) => {
    const objErro = erro.response.data
    const keys = Object.keys(objErro)
    if (!objErro.error && erros.length <= 8) {
      setErros((errosAntigos) => {
        const novosErros = keys.map((k) => ({ nomeInput: k, mensagemErro: objErro[k] }))
        return [...errosAntigos, ...novosErros]
      })
    }
    const erroIgnorado = "Endereço não encontrado para o Id informado."
    if (objErro.error && objErro.error !== erroIgnorado) {
      setErros((errosAntigos) => [...errosAntigos, { nomeInput: 'error', mensagemErro: objErro.error }])
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