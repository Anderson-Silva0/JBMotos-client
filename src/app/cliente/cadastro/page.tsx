'use client'

import { Card } from '@/components/Card'
import { ExibeErro } from '@/components/ExibeErro'
import { FormGroup } from '@/components/Form-group'
import { InputCep, InputCpf, InputTelefone } from '@/components/Input'
import { Cliente, estadoInicialCliente } from '@/models/cliente'
import { Endereco, estadoInicialEndereco } from '@/models/endereco'
import { Erros, salvarErros } from '@/models/erros'
import { mensagemErro, mensagemSucesso } from '@/models/toast'
import { ClienteService } from '@/services/clienteService'
import { EnderecoService } from '@/services/enderecoService'
import { Save } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'

export default function CadastroCliente() {
    const {
        salvarCliente,
    } = ClienteService()
    const {
        salvarEndereco,
        deletarEndereco,
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
        if (endereco.cep.length < 9 || key) {
            setErros([])
        }
    }

    useEffect(() => {
        obterEnderecoPorCep(endereco, setEndereco, erros, setErros)
    }, [endereco.cep])

    const exibirErrosCliente = async () => {
        if (erros.length > 0) {
            setErros([])
        }
        try {
            await salvarCliente(cliente)
        } catch (erro: any) {
            salvarErros(erro, erros, setErros)
        }
    }

    const submit = async () => {
        try {
            const responseEndereco = await salvarEndereco(endereco)
            try {
                await salvarCliente({ ...cliente, endereco: responseEndereco.data.id })
                mensagemSucesso("Cliente cadastrado com sucesso!")
                setCliente(estadoInicialCliente)
                setEndereco(estadoInicialEndereco)
                setErros([])
            } catch (erro: any) {
                erros.map(e => e.nomeInput === 'error' && mensagemErro(e.mensagemErro))
                await deletarEndereco(responseEndereco.data.id)
                mensagemErro('Erro no preenchimento dos campos')
                salvarErros(erro, erros, setErros)
            }
        } catch (erro: any) {
            await exibirErrosCliente()
            mensagemErro('Erro no preenchimento dos campos.')
            salvarErros(erro, erros, setErros)
        }
    }

    return (
        <div className='div-form-container'>
            <h1 className="centered-text">
                <Save size='6vh' strokeWidth={3} /> Cadastro de Cliente
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