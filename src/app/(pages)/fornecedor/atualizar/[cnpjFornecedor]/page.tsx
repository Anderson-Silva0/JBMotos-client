'use client'

import { Card } from '@/components/Card'
import { ExibeErro } from '@/components/ExibeErro'
import { FormGroup } from '@/components/Form-group'
import { InputCep, InputTelefone } from '@/components/Input'
import { Endereco, estadoInicialEndereco } from '@/models/endereco'
import { Erros, salvarErros } from '@/models/erros'
import { Fornecedor, estadoInicialFornecedor } from '@/models/fornecedor'
import { mensagemErro, mensagemSucesso } from '@/models/toast'
import { EnderecoService } from '@/services/enderecoService'
import { FornecedorService } from '@/services/fornecedorService'
import { Edit3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'

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
    buscarEnderecoPorId,
    obterEnderecoPorCepTodoBrasil
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
    if (endereco.cep.length < 9 || erros) {
      setErros([])
    }
  }

  useEffect(() => {
    obterEnderecoPorCepTodoBrasil(endereco, setEndereco, erros, setErros)
  }, [endereco.cep])

  useEffect(() => {
    const buscar = async () => {
      const fornecedorResponse = (await buscarFornecedorPorCnpj(params.cnpjFornecedor)).data as Fornecedor
      setFornecedor(fornecedorResponse)

      if (fornecedorResponse.endereco) {
        const enderecoResponse = (await buscarEnderecoPorId(fornecedorResponse.endereco.id)).data as Endereco
        setEndereco(enderecoResponse)
      }
    }
    buscar()
  }, [])

  const submit = async () => {
    try {
      await atualizarFornecedor(fornecedor.cnpj, { ...fornecedor, endereco })
      mensagemSucesso('Fornecedor atualizado com sucesso.')
      router.push('/fornecedor/listar')
    } catch (error: any) {
      salvarErros(error, erros, setErros)
      mensagemErro('Erro no preenchimento dos campos.')
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
          Atualizar Fornecedor
        </button>
      </div>
    </div>
  )
}