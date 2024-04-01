'use client'

import { IdProdutoEIdLinha, ProdutoSelecionadoProps, ValoresTotaisProps } from "@/app/venda/cadastro/page";
import { Card } from "@/components/Card";
import { ExibeErro } from "@/components/ExibeErro";
import { FormGroup } from "@/components/Form-group";
import { PagamentoCredito } from "@/components/PagamentoCredito";
import ProdutoServico from "@/components/ProdutoServico";
import { OpcoesSelecoes, estadoInicialOpcoesSelecoes } from "@/models/Selecoes";
import { Cliente } from "@/models/cliente";
import { Erros, salvarErros } from "@/models/erros";
import { formasPagamentos } from "@/models/formasPagamento";
import { formatarParaReal } from "@/models/formatadorReal";
import { Funcionario } from "@/models/funcionario";
import { Moto } from "@/models/moto";
import { PagamentoCartao, estadoInicialPagamentoCartao } from "@/models/pagamentoCartao";
import { Produto } from "@/models/produto";
import { selectStyles } from "@/models/selectStyles";
import { Servico, estadoInicialServico } from "@/models/servico";
import { mensagemAlerta, mensagemErro, mensagemSucesso } from "@/models/toast";
import { Venda, estadoInicialVenda } from "@/models/venda";
import { VendaService } from "@/services/VendaService";
import { ClienteService } from "@/services/clienteService";
import { FuncionarioService } from "@/services/funcionarioService";
import { MotoService } from "@/services/motoService";
import { PagamentoCartaoService } from "@/services/pagamentoCartaoService";
import { ProdutoService } from "@/services/produtoService";
import { ServicoService } from "@/services/servicoService";
import { Save } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import imgAddProduto from "@/images/icons8-add-product-66.png";
import imgARemoveProduto from "@/images/icons8-remove-product-64.png";
import Select from "react-select";

export default function CadastroServico() {
    const { buscarTodosFuncionarios } = FuncionarioService()
    const { buscarTodosClientes } = ClienteService()
    const { buscarMotosPorCpfCliente } = MotoService()
    const { salvarServico } = ServicoService()
    const { buscarTodosProdutos } = ProdutoService()
    const { salvarPagamentoCartao } = PagamentoCartaoService()
    const { salvarVenda, deletarVenda } = VendaService()

    const [foiCarregado, setFoiCarregado] = useState<boolean>(false)
    const [servico, setServico] = useState<Servico>(estadoInicialServico)
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
    const [motosCliente, setMotosCliente] = useState<Moto[]>([])
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [erros, setErros] = useState<Erros[]>([])
    const [adicaoProduto, setAdicaoProduto] = useState<boolean>(false)
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [todosProdutos, setTodosProdutos] = useState<Produto[]>([])
    const [venda, setVenda] = useState<Venda>(estadoInicialVenda)
    const [ocorrenciasErros, setOcorrenciasErros] = useState<string[]>([])
    const [idVendaState, setIdVendaState] = useState<number>(0)
    const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionadoProps[]>([])
    const [pagamentoCartao, setPagamentoCartao] = useState<PagamentoCartao>(estadoInicialPagamentoCartao)
    const [opcaoSelecionadaParcela, setOpcaoSelecionadaParcela] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)
    const [opcaoSelecionadaBandeira, setOpcaoSelecionadaBandeira] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)
    const [idProdutoIdLinhaSelecionado, setIdProdutoIdLinhaSelecionado] = useState<IdProdutoEIdLinha[]>([])
    const [valoresTotais, setValoresTotais] = useState<ValoresTotaisProps[]>([])
    const [qtdLinha, setQtdLinha] = useState<number[]>([1])
    const [totalTaxasState, setTotalTaxaState] = useState<number | string>(0)

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

    const [
        opcaoSelecionadaFormaDePagamento,
        setOpcaoSelecionadaFormaDePagamento
    ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

    const setPropsProdutoMoney = (key: string, e: ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value.replace(/\D/g, '')) / 100
        const limitedValue = Math.min(value, 100000)
        setServico({ ...servico, [key]: limitedValue })
        const filteredValoresTotais = valoresTotais.filter(vt => vt.idLinha !== 300);
        setValoresTotais([...filteredValoresTotais, { idLinha: 300, valorTotal: limitedValue }]);
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

            const todosProdutosResponse = await buscarTodosProdutos()
            setProdutos(todosProdutosResponse.data)
            setTodosProdutos(todosProdutosResponse.data)
        } catch (erro: any) {
            mensagemErro(erro.response.data)
        } finally {
            setFoiCarregado(true)
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
        if (opcaoSelecionadaFuncionario.value && opcaoSelecionadaMoto.value) {
            setServico(
                {
                    ...servico,
                    cpfFuncionario: String(opcaoSelecionadaFuncionario.value),
                    idMoto: Number(opcaoSelecionadaMoto.value)
                }
            )
        }
        if (opcaoSelecionadaFuncionario.value && opcaoSelecionadaCliente.value && opcaoSelecionadaMoto.value) {
            setVenda(
                {
                    ...venda,
                    cpfFuncionario: String(opcaoSelecionadaFuncionario.value),
                    cpfCliente: String(opcaoSelecionadaCliente.value),
                    formaDePagamento: String(opcaoSelecionadaFormaDePagamento.value)
                }
            )
        }
        setErros([])
    }, [opcaoSelecionadaFuncionario, opcaoSelecionadaCliente, opcaoSelecionadaFormaDePagamento, opcaoSelecionadaMoto])

    useEffect(() => {
        const definirPagamentoCartao = () => {
            if (opcaoSelecionadaFormaDePagamento.label === "Cartão de Crédito") {
                if (opcaoSelecionadaParcela.value || opcaoSelecionadaBandeira.value || totalTaxasState) {
                    setPagamentoCartao(
                        {
                            parcela: opcaoSelecionadaParcela.value,
                            bandeira: opcaoSelecionadaBandeira.value,
                            totalTaxas: totalTaxasState,
                            idVenda: 0
                        }
                    )
                }
            } else {
                setPagamentoCartao(estadoInicialPagamentoCartao)
                setOpcaoSelecionadaParcela(estadoInicialOpcoesSelecoes)
                setOpcaoSelecionadaBandeira(estadoInicialOpcoesSelecoes)
                setTotalTaxaState(0)
            }

            setErros([])
        }

        definirPagamentoCartao()
    }, [opcaoSelecionadaParcela, opcaoSelecionadaBandeira, totalTaxasState, opcaoSelecionadaFormaDePagamento])

    const definirEstadoInicialPagamentoCartao = () => {
        setPagamentoCartao(estadoInicialPagamentoCartao)
        setOpcaoSelecionadaParcela(estadoInicialOpcoesSelecoes)
        setOpcaoSelecionadaBandeira(estadoInicialOpcoesSelecoes)
        setTotalTaxaState(0)
    }

    const definirEstadoInicialSelecaoVenda = () => {
        setOpcaoSelecionadaFormaDePagamento(estadoInicialOpcoesSelecoes)
        setVenda({ ...venda, observacao: '' })
    }

    const exibirResultados = async () => {
        if (ocorrenciasErros.includes('sucesso') && !ocorrenciasErros.includes('erro')) {
            resetarVenda()
        } else if (ocorrenciasErros.includes('erro')) {
            if (idVendaState) {
                console.log('ocorrenciasErros: ', ocorrenciasErros)
                console.log('idVendaState: ', idVendaState)
                // Está sendo executado quando eu tento salvar o serviço completo e venda completa apenas sem a informaçáo de 
                // Total Taxas do pagamento cartão de crédito.
                await deletarVenda(idVendaState)
            }
            mensagemAlerta('Ocorreram erros. Por favor, tente novamente.')
        }

        setIdVendaState(0)
        setOcorrenciasErros([])
    }

    useEffect(() => {
        if (ocorrenciasErros.length === qtdLinha.length) {
            exibirResultados()
        }
    }, [ocorrenciasErros])

    const validarCamposMotoECliente = () => {
        if (!opcaoSelecionadaCliente.value) {
            erros.push({ nomeInput: 'cpfCliente', mensagemErro: 'O campo CPF do Cliente é obrigatório.' })
        }
        if (!opcaoSelecionadaMoto.value) {
            erros.push({ nomeInput: 'moto', mensagemErro: 'A seleção da Moto é obrigatória.' })
        }
    }

    const resetarVenda = () => {
        setAdicaoProduto(false)
        definirEstadoInicialPagamentoCartao()
        setIdProdutoIdLinhaSelecionado([])
        definirEstadoInicialSelecaoVenda()
        setVenda(estadoInicialVenda)
        setProdutosSelecionados([])
        setValoresTotais([])
        setQtdLinha([1])
        buscarTodos()
        setErros([])
    }

    const resetarServico = () => {
        setServico(estadoInicialServico)
        setErros([])
        setOpcaoSelecionadaFuncionario(estadoInicialOpcoesSelecoes)
        setOpcaoSelecionadaCliente(estadoInicialOpcoesSelecoes)
        setOpcaoSelecionadaMoto(estadoInicialOpcoesSelecoes)
        setAdicaoProduto(false)
    }

    const cadastrarPagamentoCartao = () => {
        
    }

    const cadastrarVenda = async () => {
        let result = []
        if (produtosSelecionados.length) {
            try {
                const vendaResponse = await salvarVenda(venda)
                result.push(vendaResponse.data.id)
                if (opcaoSelecionadaFormaDePagamento.value === "Cartão de Crédito") {
                    try {
                        await salvarPagamentoCartao({ ...pagamentoCartao, idVenda: vendaResponse.data.id })
                        result.push(0)
                    } catch (error: any) {
                        await deletarVenda(vendaResponse.data.id)
                        salvarErros(error, erros, setErros)
                    }
                }
            } catch (error: any) {
                salvarErros(error, erros, setErros)
            }
        } else {
            mensagemAlerta("Selecione algum produto.")
        }

        return result
    }

    const submit = async () => {
        let resultSize = []
        let idVenda = null
        try {
            if (adicaoProduto) {
                const responseIdVenda = await cadastrarVenda()
                resultSize = responseIdVenda
                idVenda = resultSize.filter(res => res !== 0)[0]
                if (opcaoSelecionadaFormaDePagamento.value === "Cartão de Crédito" && resultSize.length === 1) {
                    mensagemErro('Erro no preenchimento dos campos.')
                } else if (opcaoSelecionadaFormaDePagamento.value !== "Cartão de Crédito" && resultSize.length === 1) {
                    setIdVendaState(idVenda)
                } else {
                    setIdVendaState(idVenda)
                }
            }
            if (resultSize.length === 2 || resultSize.length === 0) {
                await salvarServico({ ...servico, idVenda })
                resetarServico()
                resetarVenda()
                mensagemSucesso('Serviço cadastrado com sucesso!')
                definirEstadoInicialPagamentoCartao()
            }
        } catch (error) {
            if (idVenda) {
                try {
                    await deletarVenda(idVenda)
                } catch (error) {
                }

                idVenda = null
            }
            salvarErros(error, erros, setErros)
            validarCamposMotoECliente()
            mensagemErro('Erro no preenchimento dos campos.')
        }
    }

    const alternarEstadoAdicaoProduto = () => {
        if (adicaoProduto) {
            setAdicaoProduto(false)
            resetarVenda()
            setValoresTotais(valoresTotais)
        } else {
            setAdicaoProduto(true)
            setValoresTotais([{ idLinha: 300, valorTotal: servico.precoMaoDeObra }])
        }
    }

    if (!foiCarregado) {
        return <h1 className="carregando">Carregando...</h1>
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
                    <textarea
                        value={servico.servicosRealizados}
                        onChange={e => { setErros([]); setServico({ ...servico, servicosRealizados: e.target.value }) }}
                        id="servicosRealizados"
                    />
                    {<ExibeErro erros={erros} nomeInput='servicosRealizados' />}
                </FormGroup>

                <FormGroup label="Observação: *" htmlFor="observacao">
                    <input
                        value={servico.observacao}
                        onChange={e => { setErros([]); setServico({ ...servico, observacao: e.target.value }) }}
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
                {adicaoProduto &&
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
                        {
                            opcaoSelecionadaFormaDePagamento.value === "Cartão de Crédito" && (

                                <PagamentoCredito
                                    erros={erros}
                                    totalTaxasState={totalTaxasState}
                                    setTotalTaxaState={setTotalTaxaState}
                                    opcaoSelecionadaBandeira={opcaoSelecionadaBandeira}
                                    setOpcaoSelecionadaBandeira={setOpcaoSelecionadaBandeira}
                                    opcaoSelecionadaParcela={opcaoSelecionadaParcela}
                                    setOpcaoSelecionadaParcela={setOpcaoSelecionadaParcela}
                                />

                            )
                        }
                    </FormGroup>
                }
            </Card>

            {adicaoProduto ? (
                <button onClick={alternarEstadoAdicaoProduto} title="Remover Produto"
                    style={{ cursor: "pointer", border: "none", margin: "2vw" }}>
                    <Image src={imgARemoveProduto} width={70} height={65} alt="" />
                </button>
            ) : (
                <button onClick={alternarEstadoAdicaoProduto} title="Adicionar Produto"
                    style={{ cursor: "pointer", border: "none", margin: "2vw 0 1vw 0" }}>
                    <Image src={imgAddProduto} width={70} height={60} alt="" />
                </button>
            )
            }

            {
                adicaoProduto && (
                    <ProdutoServico
                        produtos={produtos}
                        setProdutos={setProdutos}
                        todosProdutos={todosProdutos}
                        setOcorrenciasErros={setOcorrenciasErros}
                        idVendaState={idVendaState}
                        qtdLinha={qtdLinha}
                        setQtdLinha={setQtdLinha}
                        valoresTotais={valoresTotais}
                        setValoresTotais={setValoresTotais}
                        produtosSelecionados={produtosSelecionados}
                        setProdutosSelecionados={setProdutosSelecionados}
                        idProdutoIdLinhaSelecionado={idProdutoIdLinhaSelecionado}
                        setIdProdutoIdLinhaSelecionado={setIdProdutoIdLinhaSelecionado}
                    />
                )
            }

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