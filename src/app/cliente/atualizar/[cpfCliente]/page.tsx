'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { Card } from '@/components/Card'
import { FormGroup } from '@/components/Form-group'
import { InputCep, InputTelefone } from '@/components/Input'
import { mensagemErro, mensagemSucesso } from '@/models/toast'
import { Cliente, estadoInicialCliente } from '@/models/cliente'
import { Endereco, estadoInicialEndereco } from '@/models/endereco'
import { ClienteService } from '@/services/clienteService'
import { EnderecoService } from '@/services/enderecoService'
import { ExibeErro } from '@/components/ExibeErro'
import { Erros } from '@/models/erros'
import { Edit3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
    buscarEnderecoPorId
  } = EnderecoService()

  const [erros, setErros] = useState<Erros[]>([])

  const [cliente, setCliente] = useState<Cliente>(estadoInicialCliente)

  const setPropsCliente = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setCliente({ ...cliente, [key]: e.target.value })
    setErros([])
  }

  const [endereco, setEndereco] = useState<Endereco>(estadoInicialEndereco)

  const setPropsEndereco = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setEndereco({ ...endereco, [key]: e.target.value })
    setErros([])
  }

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
      mensagemSucesso('Cliente e Endereço atualizados com sucesso.')
      router.push('/cliente/listar')
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
        <Edit3 className='icones-atualizacao-e-delecao' /> Atualização de Cliente e Endereço
      </h1>
      <Card titulo="Dados do Cliente">
        <form>
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
          <FormGroup label="Telefone: *" htmlFor="telefone">
            <InputTelefone
              value={cliente.telefone}
              onChange={e => setPropsCliente("telefone", e)}
            />
            {<ExibeErro erros={erros} nomeInput='telefone' />}
          </FormGroup>
        </form>
      </Card>
      <Card titulo="Endereço do Cliente">
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
          Atualizar Cliente
        </button>
      </div>
    </div>
  )
}