'use client'

import { Card } from '@/components/Card'
import { ExibeErro } from '@/components/ExibeErro'
import { FormGroup } from '@/components/Form-group'
import { InputCep, InputTelefone } from '@/components/Input'
import { Cliente, estadoInicialCliente } from '@/models/cliente'
import { Endereco, estadoInicialEndereco } from '@/models/endereco'
import { Erros, salvarErros } from '@/models/erros'
import { mensagemErro, mensagemSucesso } from '@/models/toast'
import { ClienteService } from '@/services/clienteService'
import { EnderecoService } from '@/services/enderecoService'
import { Edit3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'

interface AtualizarClienteProps {
  params: {
    cpfCliente: string
  }
}

export default function AtualizarCliente({ params }: AtualizarClienteProps) {
  const router = useRouter()

  const {
    atualizarCliente,
    buscarClientePorCpf
  } = ClienteService()
  const {
    atualizarEndereco,
    buscarEnderecoPorId,
    obterEnderecoPorCep
  } = EnderecoService()

  const [erros, setErros] = useState<Erros[]>([])

  const [cliente, setCliente] = useState<Cliente>(estadoInicialCliente)

  const [endereco, setEndereco] = useState<Endereco>(estadoInicialEndereco)

  const setPropsCliente = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setCliente({ ...cliente, [key]: e.target.value })
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
      const clienteResponse = (await buscarClientePorCpf(params.cpfCliente)).data as Cliente
      setCliente(clienteResponse)

      const enderecoResponse = (await buscarEnderecoPorId(clienteResponse.endereco)).data as Endereco
      setEndereco(enderecoResponse)
    }
    buscar()
  }, [])

  const submit = async () => {
    try {
      await atualizarCliente(cliente.cpf, cliente)
      await atualizarEndereco(endereco.id, endereco)
      mensagemSucesso('Cliente atualizado com sucesso.')
      router.push('/cliente/listar')
    } catch (error: any) {
      salvarErros(error, erros, setErros)
      mensagemErro('Erro no preenchimento dos campos.')
    }
  }

  return (
    <div className='div-form-container'>
      <h1 className="centered-text">
        <Edit3 size='6vh' strokeWidth={3} /> Atualização de Cliente
      </h1>
      <Card titulo="Dados do Cliente">
        <FormGroup label="Nome: *" htmlFor="nome">
          <input
            value={cliente.nome}
            onChange={e => setPropsCliente("nome", e)}
            id="nome"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='nome' />}
        </FormGroup>
        <FormGroup label="Email: *" htmlFor="email">
          <input
            value={cliente.email}
            onChange={e => setPropsCliente("email", e)}
            id="email"
            type="email"
          />
          {<ExibeErro erros={erros} nomeInput='email' />}
        </FormGroup>
        <FormGroup label="Celular: *" htmlFor="telefone">
          <InputTelefone
            value={cliente.telefone}
            onChange={e => setPropsCliente("telefone", e)}
          />
          {<ExibeErro erros={erros} nomeInput='telefone' />}
        </FormGroup>
      </Card>
      <Card titulo="Endereço do Cliente">
        <FormGroup label="CEP: *" htmlFor="cep">
          <span className="cep-message">
            Digite o CEP para preenchimento automático do endereço.
          </span>
          <InputCep
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
          Atualizar Cliente
        </button>
      </div>
    </div>
  )
}