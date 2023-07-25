'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { Card } from '@/components/Card'
import { FormGroup } from '@/components/Form-group'
import { InputCep, InputCnpj, InputTelefone } from '@/components/Input'
import { mensagemErro, mensagemSucesso } from '@/models/toast'
import { Fornecedor, estadoInicialFornecedor } from '@/models/fornecedor'
import { Endereco, estadoInicialEndereco } from '@/models/endereco'
import { FornecedorService } from '@/services/fornecedorService'
import { EnderecoService } from '@/services/enderecoService'
import { ExibeErro } from '@/components/ExibeErro'
import { Erros } from '@/models/erros'
import { Edit3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AtualizarFornecedorProps {
  params: {
    cnpjFornecedor: string
  }
}

export default function AtualizarFornecedor({ params }: AtualizarFornecedorProps) {
  const router = useRouter()

  const {
    atualizarFornecedor,
    buscarFornecedorPorCnpj
  } = FornecedorService()
  const {
    atualizarEndereco,
    buscarEnderecoPorId,
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
    if (endereco.cep.length < 9) {
      setErros([])
    }
  }

  useEffect(() => {
    obterEnderecoPorCep(endereco, setEndereco, erros, setErros)
  }, [endereco.cep])

  useEffect(() => {
    const buscar = async () => {
      const fornecedorResponse = (await buscarFornecedorPorCnpj(params.cnpjFornecedor)).data as Fornecedor
      setFornecedor(fornecedorResponse)

      const enderecoResponse = (await buscarEnderecoPorId(fornecedorResponse.endereco)).data as Endereco
      setEndereco(enderecoResponse)
    }
    buscar()
  }, [])

  const submit = async () => {
    try {
      await atualizarFornecedor(fornecedor.cnpj, fornecedor)
      await atualizarEndereco(endereco.id, endereco)
      mensagemSucesso('Fornecedor atualizado com sucesso.')
      router.push('/fornecedor/listar')
    } catch (erro: any) {
      salvarErros(erro)
      mensagemErro('Erro no preenchimento dos campos.')
    }
  }

  const salvarErros = (erro: any) => {
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

  return (
    <div className='div-form-container'>
      <h1 className="centered-text">
        <Edit3 size='6vh' strokeWidth={3} /> Atualização de Fornecedor
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