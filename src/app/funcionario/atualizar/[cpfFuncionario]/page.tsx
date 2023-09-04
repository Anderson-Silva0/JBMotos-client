'use client'

import { Card } from '@/components/Card'
import { ExibeErro } from '@/components/ExibeErro'
import { FormGroup } from '@/components/Form-group'
import { InputCep, InputTelefone } from '@/components/Input'
import { Endereco, estadoInicialEndereco } from '@/models/endereco'
import { Erros, salvarErros } from '@/models/erros'
import { Funcionario, estadoInicialFuncionario } from '@/models/funcionario'
import { mensagemErro, mensagemSucesso } from '@/models/toast'
import { EnderecoService } from '@/services/enderecoService'
import { FuncionarioService } from '@/services/funcionarioService'
import { Edit3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'

interface AtualizarFuncionarioProps {
  params: {
    cpfFuncionario: string
  }
}

export default function AtualizarFuncionario({ params }: AtualizarFuncionarioProps) {
  const router = useRouter()

  const {
    atualizarFuncionario,
    buscarFuncionarioPorCpf
  } = FuncionarioService()
  const {
    atualizarEndereco,
    buscarEnderecoPorId,
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

  useEffect(() => {
    const buscar = async () => {
      const funcionarioResponse = (await buscarFuncionarioPorCpf(params.cpfFuncionario)).data as Funcionario
      setFuncionario(funcionarioResponse)

      const enderecoResponse = (await buscarEnderecoPorId(funcionarioResponse.endereco)).data as Endereco
      setEndereco(enderecoResponse)
    }
    buscar()
  }, [])

  const submit = async () => {
    try {
      await atualizarFuncionario(funcionario.cpf, funcionario)
      await atualizarEndereco(endereco.id, endereco)
      mensagemSucesso('Funcionário atualizado com sucesso.')
      router.push('/funcionario/listar')
    } catch (error: any) {
      salvarErros(error, erros, setErros)
      mensagemErro('Erro no preenchimento dos campos.')
    }
  }

  return (
    <div className='div-form-container'>
      <h1 className="centered-text">
        <Edit3 size='6vh' strokeWidth={3} /> Atualização de Funcionário
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
          Atualizar Funcionário
        </button>
      </div>
    </div>
  )
}