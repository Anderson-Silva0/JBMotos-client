'use client'

import { Card } from "@/components/Card";
import { ExibeErro } from "@/components/ExibeErro";
import { FormGroup } from "@/components/Form-group";
import { OpcoesSelecoes, estadoInicialOpcoesSelecoes } from "@/models/Selecoes";
import { Cliente } from "@/models/cliente";
import { Erros } from "@/models/erros";
import { formatarParaReal } from "@/models/formatadorReal";
import { Funcionario } from "@/models/funcionario";
import { Moto } from "@/models/moto";
import { selectStyles } from "@/models/selectStyles";
import { Servico, estadoInicialServico } from "@/models/servico";
import { mensagemErro } from "@/models/toast";
import { ClienteService } from "@/services/clienteService";
import { FuncionarioService } from "@/services/funcionarioService";
import { MotoService } from "@/services/motoService";
import { Save } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";

export default function CadastroServico() {
    const { buscarTodosFuncionarios } = FuncionarioService()
    const { buscarTodosClientes } = ClienteService()
    const { buscarMotosPorCpfCliente } = MotoService()

    const [servico, setServico] = useState<Servico>(estadoInicialServico)
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
    const [motosCliente, setMotosCliente] = useState<Moto[]>([])
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [erros, setErros] = useState<Erros[]>([])

    const [
        opcaoSelecionadaFuncionario,
        setOpcaoSelecionadaFuncionario
    ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

    const [
        opcaoSelecionadaCliente,
        setOpcaoSelecionadaCliente
    ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

    const [
        opcaoSelecionadaMoto,
        setOpcaoSelecionadaMoto
    ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

    const setPropsProdutoMoney = (key: string, e: ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value.replace(/\D/g, '')) / 100
        const limitedValue = Math.min(value, 100000)
        setServico({ ...servico, [key]: limitedValue })
        setErros([])
    }

    const buscarTodos = async () => {
        try {
            const todosFuncionariosResponse = await buscarTodosFuncionarios()
            const todosFuncionarios = todosFuncionariosResponse.data
            const funcionariosAtivos = todosFuncionarios.filter((f: Funcionario) => f.statusFuncionario === 'ATIVO')
            setFuncionarios(funcionariosAtivos)

            const todosClientesResponse = await buscarTodosClientes()
            const todosClientes = todosClientesResponse.data
            const clientesAtivos = todosClientes.filter((c: Cliente) => c.statusCliente === 'ATIVO')
            setClientes(clientesAtivos)
        } catch (erro: any) {
            mensagemErro(erro.response.data)
        } finally {
            //   setFoiCarregado(true)
        }
    }

    useEffect(() => {
        buscarTodos()
    }, [])

    useEffect(() => {
        const buscarMotosCliente = async () => {
            try {
                const motosClienteResponse = await buscarMotosPorCpfCliente(String(opcaoSelecionadaCliente.value))
                const motosCliente = motosClienteResponse.data
                const motosClienteAtivas = motosCliente.filter((m: Moto) => m.statusMoto === 'ATIVO')
                setMotosCliente(motosClienteAtivas)

                if (opcaoSelecionadaMoto.value) {
                    setOpcaoSelecionadaMoto(estadoInicialOpcoesSelecoes)
                }
            } catch (error: any) {
                mensagemErro(error.response.data.error)
                setMotosCliente([])
                setOpcaoSelecionadaMoto(estadoInicialOpcoesSelecoes)
            }
        }
        if (opcaoSelecionadaCliente.value) {
            buscarMotosCliente()
        }
    }, [opcaoSelecionadaCliente])

    useEffect(() => {
        setServico(
            {
                ...servico,
                cpfFuncionario: String(opcaoSelecionadaFuncionario?.value),
                idMoto: Number(opcaoSelecionadaMoto.value)
            }
        )
        setErros([])
    }, [opcaoSelecionadaFuncionario, opcaoSelecionadaCliente, opcaoSelecionadaMoto])

    const submit = () => {
        console.log(servico)
    }

    return (
        <div className='div-form-container'>
            <h1 className="centered-text">
                <Save size='6vh' strokeWidth={3} /> Cadastro de Serviço
            </h1>
            <Card titulo="Dados do Serviço">
                <FormGroup label="Selecione o Funcionário*" htmlFor="cpfFuncionario">
                    <Select
                        styles={selectStyles}
                        placeholder="Selecione..."
                        value={opcaoSelecionadaFuncionario}
                        onChange={(option: any) => setOpcaoSelecionadaFuncionario(option)}
                        options={funcionarios.map(f => ({ label: f.nome, value: f.cpf }) as OpcoesSelecoes)}
                        instanceId="select-cpfFuncionario"
                    />
                    {<ExibeErro erros={erros} nomeInput="cpfFuncionario" />}
                </FormGroup>

                <FormGroup label="Selecione o Cliente*" htmlFor="cpfCliente">
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

                <FormGroup label="Selecione a Moto*" htmlFor="moto">
                    <Select
                        isDisabled={!motosCliente.length}
                        styles={selectStyles}
                        placeholder="Selecione..."
                        value={opcaoSelecionadaMoto}
                        onChange={(option: any) => setOpcaoSelecionadaMoto(option)}
                        options={motosCliente.map(m => ({ label: `${m.placa} | ${m.marca} ${m.modelo}`, value: m.id }) as OpcoesSelecoes)}
                        instanceId="select-idMoto"
                    />
                    {<ExibeErro erros={erros} nomeInput="moto" />}
                </FormGroup>

                <FormGroup label="Serviços Realizados: *" htmlFor="servicosRealizados">
                    <input
                        value={servico.servicosRealizados}
                        onChange={e => setServico({ ...servico, servicosRealizados: e.target.value })}
                        id="servicosRealizados"
                        type="text"
                    />
                    {<ExibeErro erros={erros} nomeInput='servicosRealizados' />}
                </FormGroup>

                <FormGroup label="Observação: *" htmlFor="observacao">
                    <input
                        value={servico.observacao}
                        onChange={e => setServico({ ...servico, observacao: e.target.value })}
                        id="observacao"
                        type="text"
                    />
                    {<ExibeErro erros={erros} nomeInput='observacao' />}
                </FormGroup>

                <FormGroup label="Preço de Mão de Obra: *" htmlFor="precoMaoDeObra">
                    <input
                        value={formatarParaReal(servico.precoMaoDeObra)}
                        onChange={e => setPropsProdutoMoney('precoMaoDeObra', e)}
                        id="precoMaoDeObra"
                        type="text"
                    />
                    {<ExibeErro erros={erros} nomeInput='precoMaoDeObra' />}
                </FormGroup>

            </Card>

            <div className="divBotaoCadastrar">
                <button
                    onClick={submit}
                    type="submit">
                    Realizar Serviço
                </button>
            </div>
        </div>
    )
}