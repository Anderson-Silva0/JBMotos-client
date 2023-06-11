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

export default function CadastroFornecedor() {

  const { salvarFornecedor } = FornecedorService()

  const {
    salvarEndereco,
    deletarEndereco
  } = EnderecoService()

  const [erros, setErros] = useState<Erros[]>([])

  const [fornecedor, setFornecedor] = useState<Fornecedor>(estadoInicialFornecedor)

  const setPropsFornecedor = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setFornecedor({ ...fornecedor, [key]: e.target.value })
  }

  const [endereco, setEndereco] = useState<Endereco>(estadoInicialEndereco)

  const setPropsEndereco = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setEndereco({ ...endereco, [key]: e.target.value })
  }

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
    const salvarFornecedorAtualizado = async () => {
      try {
        await salvarFornecedor(fornecedor)
        mensagemSucesso("Fornecedor e endereço salvos com sucesso!")
        setFornecedor(estadoInicialFornecedor)
        setEndereco(estadoInicialEndereco)
      } catch (erro: any) {
        erros.map(e => e.nomeInput === 'error' && mensagemErro(e.mensagemErro))
        await deletarEndereco(endereco.id)
        setEndereco({ ...endereco, id: 0 })
        setFornecedor({ ...fornecedor, endereco: 0 })
      }
    }
    if (endereco.id !== 0) {
      salvarFornecedorAtualizado()
    }
  }, [fornecedor, deletarEndereco, endereco, salvarFornecedor, erros])

  return (
    <div>
      <div>
        <Card titulo="Dados do Fornecedor">
          <form >
            <FormGroup label="CNPJ: *" htmlFor="cnpj">
              <InputCnpj
                value={fornecedor.cnpj}
                onChange={e => setPropsFornecedor("cnpj", e)}
              />
              {<ExibeErro erros={erros} nomeInput='cnpj' />}
            </FormGroup>
            <FormGroup label="Nome: *" htmlFor="nome">
              <input
                value={fornecedor.nome}
                onChange={e => setPropsFornecedor("nome", e)}
                id="nome"
                type="text"
              />
              {<ExibeErro erros={erros} nomeInput='nome' />}
            </FormGroup>
            <FormGroup label="Telefone: *" htmlFor="telefone">
              <InputTelefone
                value={fornecedor.telefone}
                onChange={e => setPropsFornecedor("telefone", e)}
              />
              {<ExibeErro erros={erros} nomeInput='telefone' />}
            </FormGroup>
          </form>
        </Card>
      </div>
      <div>
        <Card titulo="Endereço do Fornecedor">
          <FormGroup label="Rua: *" htmlFor="rua">
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
      </div>
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