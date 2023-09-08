'use client'

import { Card } from "@/components/Card"
import { ExibeErro } from "@/components/ExibeErro"
import { FormGroup } from "@/components/Form-group"
import { InputPlaca } from "@/components/Input"
import { OpcoesSelecoes, estadoInicialOpcoesSelecoes } from "@/models/Selecoes"
import { Cliente } from "@/models/cliente"
import { Erros, salvarErros } from "@/models/erros"
import { Moto, estadoInicialMoto } from "@/models/moto"
import { selectStyles } from "@/models/selectStyles"
import { mensagemErro, mensagemSucesso } from "@/models/toast"
import { ClienteService } from "@/services/clienteService"
import { MotoService } from "@/services/motoService"
import { Edit3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChangeEvent, useEffect, useState } from "react"
import Select from "react-select"

interface AtualizarMotoProps {
    params: {
        idMoto: number
    }
}

export default function AtualizarMoto({ params }: AtualizarMotoProps) {
    const router = useRouter()

    const {
        atualizarMoto,
        buscarMotoPorId
    } = MotoService()

    const {
        buscarTodosClientes
    } = ClienteService()

    const [
        opcaoSelecionadaCliente,
        setOpcaoSelecionadaCliente
    ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

    const [erros, setErros] = useState<Erros[]>([])

    const [moto, setMoto] = useState<Moto>(estadoInicialMoto)

    const [clientes, setClientes] = useState<Cliente[]>([])

    const setPropsMoto = (key: string, e: ChangeEvent<HTMLInputElement>) => {
        setMoto({ ...moto, [key]: e.target.value })
        setErros([])
    }

    useEffect(() => {
        const buscar = async () => {
            const motoResponse = (await buscarMotoPorId(params.idMoto)).data as Moto
            setMoto(motoResponse)

            setOpcaoSelecionadaCliente({
                label: motoResponse.cpfCliente,
                value: motoResponse.cpfCliente
            })
        }
        buscar()
    }, [])

    useEffect(() => {
        const buscarTodos = async () => {
            try {
                const todosClientesResponse = await buscarTodosClientes()
                const todosClientes = todosClientesResponse.data
                const clientesAtivos = todosClientes.filter((c: Cliente) => c.statusCliente === 'ATIVO')
                setClientes(clientesAtivos)
            } catch (erro: any) {
                mensagemErro(erro.response.data)
            }
        }
        buscarTodos()
    }, [])

    useEffect(() => {
        setMoto(
            {
                ...moto,
                cpfCliente: String(opcaoSelecionadaCliente?.value)
            }
        )
        setErros([])
    }, [opcaoSelecionadaCliente])

    const atualizar = async () => {
        try {
            await atualizarMoto(params.idMoto, moto)
            mensagemSucesso("Moto atualizada com sucesso!")
            router.push('/moto/listar')
        } catch (error: any) {
            salvarErros(error, erros, setErros)
            mensagemErro('Erro no preenchimento dos campos.')
        }
    }

    return (
        <div className="div-form-container">
            <h1 className="centered-text">
                <Edit3 size='6vh' strokeWidth={3} /> Atualização de Moto
            </h1>
            <Card titulo="Dados da Moto">
                <FormGroup label="Placa: *" htmlFor="placa">
                    <InputPlaca
                        value={moto.placa}
                        onChange={(e) => setPropsMoto('placa', e)}
                        id="placa"
                        type="text"
                    />
                    {<ExibeErro erros={erros} nomeInput='placa' />}
                </FormGroup>
                <FormGroup label="Marca: *" htmlFor="marca">
                    <input
                        value={moto.marca}
                        onChange={e => setPropsMoto("marca", e)}
                        id="marca"
                        type="text"
                    />
                    {<ExibeErro erros={erros} nomeInput='marca' />}
                </FormGroup>
                <FormGroup label="Modelo: *" htmlFor="modelo">
                    <input
                        value={moto.modelo}
                        onChange={e => setPropsMoto("modelo", e)}
                        id="modelo"
                        type="text"
                    />
                    {<ExibeErro erros={erros} nomeInput='modelo' />}
                </FormGroup>
                <FormGroup label="Ano: *" htmlFor="ano">
                    <input
                        className='input-number-form'
                        value={moto.ano}
                        onChange={e => setPropsMoto("ano", e)}
                        id="ano"
                        type="number"
                        onWheel={(e) => e.currentTarget.blur()}
                    />
                    {<ExibeErro erros={erros} nomeInput='ano' />}
                </FormGroup>
                <FormGroup label="Selecione o Cliente: *" htmlFor="cpfCliente">
                    <Select
                        styles={selectStyles}
                        placeholder="Selecione..."
                        value={opcaoSelecionadaCliente}
                        onChange={(option: any) => setOpcaoSelecionadaCliente(option)}
                        options={clientes.map(c => ({ label: c.cpf, value: c.cpf }) as OpcoesSelecoes)}
                        instanceId="select-cpfCliente"
                    />
                    {<ExibeErro erros={erros} nomeInput="cpfCliente" />}
                </FormGroup>
            </Card>
            <div className="divBotaoCadastrar">
                <button
                    onClick={atualizar}
                    type="submit">
                    Atualizar Moto
                </button>
            </div>
        </div>
    )
}