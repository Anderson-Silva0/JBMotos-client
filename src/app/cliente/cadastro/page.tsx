'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { Card } from '@/components/Card'
import { FormGroup } from '@/components/Form-group'
import { InputCep, InputCpf, InputTelefone } from '@/components/Input'
import { mensagemErro, mensagemSucesso } from '@/models/toast'
import { Cliente, estadoInicialCliente } from '@/models/cliente'
import { Endereco, estadoInicialEndereco } from '@/models/endereco'
import { ClienteService } from '@/services/clienteService'
import { EnderecoService } from '@/services/enderecoService'
import { ExibeErro } from '@/components/ExibeErro'
import { Erros } from '@/models/erros'

export default function CadastroCliente() {
    const {
        salvarCliente,
    } = ClienteService()
    const {
        salvarEndereco,
        deletarEndereco,
        buscarEnderecoPorCep
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
        const buscarEndereco = async () => {
            console.log('teste')
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

    const exibirErrosCliente = async () => {
        if (erros.length > 0) {
            setErros([])
        }
        try {
            await salvarCliente(cliente)
        } catch (error) {
            salvarErros(error)
        }
    }

    const submit = async () => {
        try {
            await exibirErrosCliente()
            const responseEndereco = await salvarEndereco(endereco)
            setEndereco({ ...endereco, id: responseEndereco.data.id })
            setCliente({ ...cliente, endereco: responseEndereco.data.id })
        } catch (erro: any) {
            mensagemErro('Erro no preenchimento dos campos.')
            salvarErros(erro)
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

    useEffect(() => {
        const salvarClienteAtualizado = async () => {
            try {
                await salvarCliente(cliente)
                mensagemSucesso("Cliente e endereço salvos com sucesso!")
                setCliente(estadoInicialCliente)
                setEndereco(estadoInicialEndereco)
            } catch (erro: any) {
                erros.map(e => e.nomeInput === 'error' && mensagemErro(e.mensagemErro))
                await deletarEndereco(endereco.id)
                setEndereco({ ...endereco, id: 0 })
                setCliente({ ...cliente, endereco: 0 })
                mensagemErro('Erro no preenchimento dos campos')
            }
        }
        if (endereco.id !== 0) {
            salvarClienteAtualizado()
        }
    }, [cliente, endereco])

    return (
        <div className='div-form-container'>
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
                <FormGroup label="CPF: *" htmlFor="cpf">
                    <InputCpf
                        id='cpf'
                        value={cliente.cpf}
                        onChange={e => setPropsCliente("cpf", e)}
                    />
                    {<ExibeErro erros={erros} nomeInput='cpf' />}
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
                        id='telefone'
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
                    Cadastrar Cliente
                </button>
            </div>
        </div>
    )
}