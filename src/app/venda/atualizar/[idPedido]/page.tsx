'use client'

import { Card } from '@/components/Card'
import { ExibeErro } from '@/components/ExibeErro'
import { FormGroup } from '@/components/Form-group'
import { OpcoesSelecoes, estadoInicialOpcoesSelecoes } from '@/models/Selecoes'
import { Cliente } from '@/models/cliente'
import { Erros, salvarErros } from '@/models/erros'
import { formasPagamentos } from '@/models/formasPagamento'
import { Funcionario } from '@/models/funcionario'
import { Pedido, estadoInicialPedido } from '@/models/pedido'
import { selectStyles } from '@/models/selectStyles'
import { mensagemErro, mensagemSucesso } from '@/models/toast'
import { PedidoService } from '@/services/PedidoService'
import { ClienteService } from '@/services/clienteService'
import { FuncionarioService } from '@/services/funcionarioService'
import { Edit3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Select from 'react-select'

interface AtualizarVendaProps {
    params: {
        idPedido: number
    }
}

export default function AtualizarVenda({ params }: AtualizarVendaProps) {
    const router = useRouter()

    const { buscarTodosClientes } = ClienteService()
    const { buscarFuncionarioPorCpf, buscarTodosFuncionarios } = FuncionarioService()

    const [pedido, setPedido] = useState<Pedido>(estadoInicialPedido)
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
    const [erros, setErros] = useState<Erros[]>([])

    const [opcaoSelecionadaCliente,
        setOpcaoSelecionadaCliente
    ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

    const [
        opcaoSelecionadaFuncionario,
        setOpcaoSelecionadaFuncionario
    ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

    const [
        opcaoSelecionadaFormaDePagamento,
        setOpcaoSelecionadaFormaDePagamento
    ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

    const { buscarPedidoPorId, atualizarPedido } = PedidoService()

    useEffect(() => {
        const buscarFuncionariosEClientes = async () => {
            try {
                const todosClientesResponse = await buscarTodosClientes()
                const todosClientes = todosClientesResponse.data
                const clientesAtivos = todosClientes.filter((c: Cliente) => c.statusCliente === 'ATIVO')
                setClientes(clientesAtivos)

                const todosFuncionariosResponse = await buscarTodosFuncionarios()
                const todosFuncionarios = todosFuncionariosResponse.data
                const funcionariosAtivos = todosFuncionarios.filter((f: Funcionario) => f.statusFuncionario === 'ATIVO') as Funcionario[]
                setFuncionarios(funcionariosAtivos)
            } catch (erro: any) {
                mensagemErro("Erro ao tentar buscar Funcionários ou Clientes.")
            }
        }

        const buscarInformacoesPedido = async () => {
            try {
                const pedidoResponse = (await buscarPedidoPorId(params.idPedido)).data as Pedido
                setPedido(pedidoResponse)

                const funcionarioDoPedido = (await buscarFuncionarioPorCpf(pedidoResponse.cpfFuncionario)).data as Funcionario

                setOpcaoSelecionadaCliente({ label: pedidoResponse.cpfCliente, value: pedidoResponse.cpfCliente })
                setOpcaoSelecionadaFuncionario({
                    label: funcionarioDoPedido.nome,
                    value: pedidoResponse.cpfFuncionario,
                })

                setOpcaoSelecionadaFormaDePagamento({ label: pedidoResponse.formaDePagamento, value: pedidoResponse.formaDePagamento })
            } catch (erro: any) {
                mensagemErro(erro.response.data)
            }
        }

        buscarFuncionariosEClientes()
        buscarInformacoesPedido()
    }, [])

    useEffect(() => {
        setPedido(
            {
                ...pedido,
                cpfCliente: String(opcaoSelecionadaCliente?.value),
                cpfFuncionario: String(opcaoSelecionadaFuncionario?.value),
                formaDePagamento: String(opcaoSelecionadaFormaDePagamento?.value)
            }
        )
        setErros([])
    }, [opcaoSelecionadaCliente, opcaoSelecionadaFuncionario, opcaoSelecionadaFormaDePagamento])

    const atualizar = async () => {
        try {
            await atualizarPedido(pedido.id, pedido)
            mensagemSucesso('Venda atualizada com sucesso.')
            router.push('/venda/listar')
        } catch (error: any) {
            salvarErros(error, erros, setErros)
            mensagemErro('Erro no preenchimento dos campos.')
        }
    }

    return (
        <div className="div-form-container">
            <h1 className="centered-text">
                <Edit3 size='6vh' strokeWidth={3} /> Atualização de Venda
            </h1>
            <Card titulo="Detalhes da Venda">
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
                <FormGroup label="Selecione o Funcionário (Vendedor): *" htmlFor="cpfFuncionario">
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
                <FormGroup label="Selecione a forma de pagamento*" htmlFor="formaDePagamento">
                    <Select
                        styles={selectStyles}
                        placeholder="Selecione..."
                        value={opcaoSelecionadaFormaDePagamento}
                        onChange={(option: any) => setOpcaoSelecionadaFormaDePagamento(option)}
                        options={formasPagamentos}
                        instanceId="select-formaDePagamento"
                    />
                    {<ExibeErro erros={erros} nomeInput="formaDePagamento" />}
                </FormGroup>
                <FormGroup label="Observação:" htmlFor="observacao">
                    <input
                        maxLength={100}
                        value={pedido.observacao}
                        onChange={(e) => { setErros([]); setPedido({ ...pedido, observacao: e.target.value }) }}
                        id="observacao"
                        type="text"
                    />
                    {<ExibeErro erros={erros} nomeInput='observacao' />}
                </FormGroup>
            </Card>
            <div className="divBotaoCadastrar">
                <button
                    onClick={atualizar}
                    type="button">
                    Atualizar Venda
                </button>
            </div>
        </div>
    )
}