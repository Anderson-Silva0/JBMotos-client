'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { Card } from '@/components/Card'
import { FormGroup } from '@/components/Form-group'
import { InputCep, InputTelefone } from '@/components/Input'
import { mensagemErro, mensagemSucesso } from '@/models/toast'
import { Endereco, estadoInicialEndereco } from '@/models/endereco'
import { EnderecoService } from '@/services/enderecoService'
import { ExibeErro } from '@/components/ExibeErro'
import { Erros } from '@/models/erros'
import { Edit3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FuncionarioService } from '@/services/funcionarioService'
import { Funcionario, estadoInicialFuncionario } from '@/models/funcionario'

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
    buscarEnderecoPorCep
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
    if (endereco.cep.length < 9 && endereco.rua || endereco.cidade || endereco.bairro) {
      setEndereco({ ...endereco, rua: '', bairro: '', cidade: '' })
    }
    const buscarEndereco = async () => {
      try {
        const enderecoResponse = await buscarEnderecoPorCep(endereco.cep)
        if (enderecoResponse.data.erro) {
          setErros([...erros, {
            nomeInput: 'cep',
            mensagemErro: 'CEP inexistente. Verifique e corrija.',
          }])
        } else {
          setEndereco({
            ...endereco,
            rua: enderecoResponse.data.logradouro,
            bairro: enderecoResponse.data.bairro,
            cidade: enderecoResponse.data.localidade
          })
        }
      } catch (error: any) {
        mensagemErro('Erro ao tentar buscar Endereço por CEP.')
      }
    }
    if (endereco.cep.length === 9) {
      buscarEndereco()
    }
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