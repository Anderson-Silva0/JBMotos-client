'use client'

import {
    IdProdutoEIdLinha,
    ProdutoSelecionadoProps,
    ProdutoVendaIdLinhaProps,
    ValoresTotaisProps
} from "@/app/(pages)/venda/cadastro/page";
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
import { estadoInicialMoto, Moto } from "@/models/moto";
import { PagamentoCartao, estadoInicialPagamentoCartao } from "@/models/pagamentoCartao";
import { Produto } from "@/models/produto";
import { selectStyles } from "@/models/selectStyles";
import { Servico, estadoInicialServico } from "@/models/servico";
import { mensagemAlerta, mensagemErro, mensagemSucesso } from "@/models/toast";
import { Venda, estadoInicialVenda } from "@/models/venda";
import { ClienteService } from "@/services/clienteService";
import { MotoService } from "@/services/motoService";
import { ProdutoService } from "@/services/produtoService";
import { ServicoService } from "@/services/servicoService";
import { Save } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import imgAddProduto from "@/images/icons8-add-product-66.png";
import imgARemoveProduto from "@/images/icons8-remove-product-64.png";
import Cookies from 'js-cookie'
import { decode } from 'jsonwebtoken'
import Select from "react-select";
import { DecodedToken } from "@/middleware";
import { ConfirmarDecisao } from "@/components/ConfirmarDecisao";
import LoadingLogo from "@/components/LoadingLogo";

export default function CadastroServico() {
    const { buscarTodosClientes } = ClienteService()
    const { buscarMotosPorCpfCliente } = MotoService()
    const { salvarServico } = ServicoService()
    const { buscarTodosProdutos } = ProdutoService()

    const [cpfUser, setCpfUser] = useState<string>('')

    useEffect(() => {
        const token = Cookies.get('login-token')
        if (token) {
            const decodedToken = decode(token) as DecodedToken
            setCpfUser(decodedToken.userCpf)
        }
    }, [])

    const [foiCarregado, setFoiCarregado] = useState<boolean>(false)
    const [servico, setServico] = useState<Servico>(estadoInicialServico)
    const [motosCliente, setMotosCliente] = useState<Moto[]>([])
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [erros, setErros] = useState<Erros[]>([])
    const [adicaoProduto, setAdicaoProduto] = useState<boolean>(false)
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [todosProdutos, setTodosProdutos] = useState<Produto[]>([])
    const [venda, setVenda] = useState<Venda>(estadoInicialVenda)
    const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionadoProps[]>([])
    const [pagamentoCartao, setPagamentoCartao] = useState<PagamentoCartao>(estadoInicialPagamentoCartao)
    const [opcaoSelecionadaParcela, setOpcaoSelecionadaParcela] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)
    const [opcaoSelecionadaBandeira, setOpcaoSelecionadaBandeira] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)
    const [idProdutoIdLinhaSelecionado, setIdProdutoIdLinhaSelecionado] = useState<IdProdutoEIdLinha[]>([])
    const [precoServico, setPrecoServico] = useState<number>(0)
    const [valoresTotais, setValoresTotais] = useState<ValoresTotaisProps[]>([])
    const [qtdLinha, setQtdLinha] = useState<number[]>([1])
    const [taxaJuros, setTaxaJuros] = useState<number>(0)
    const [produtosVendaIdLinha, setProdutoVendaIdLinha] = useState<ProdutoVendaIdLinhaProps[]>([])

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
        setPrecoServico(limitedValue)
        setErros([])
    }

    const buscarTodos = async () => {
        try {
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
        let motoResult = estadoInicialMoto
        motoResult.id = Number(opcaoSelecionadaMoto.value)
        setServico(
            {
                ...servico,
                cpfFuncionario: cpfUser,
                moto: motoResult
            }
        )
        setVenda(
            {
                ...venda,
                cpfFuncionario: cpfUser,
                cpfCliente: String(opcaoSelecionadaCliente.value),
                formaDePagamento: String(opcaoSelecionadaFormaDePagamento.value)
            }
        )
        setErros([])
    }, [opcaoSelecionadaCliente, opcaoSelecionadaFormaDePagamento, opcaoSelecionadaMoto])

    useEffect(() => {
        const definirPagamentoCartao = () => {
            if (opcaoSelecionadaFormaDePagamento.label === "Cartão de Crédito") {
                if (opcaoSelecionadaParcela.value || opcaoSelecionadaBandeira.value || taxaJuros) {
                    setPagamentoCartao(
                        {
                            parcela: opcaoSelecionadaParcela.value,
                            bandeira: opcaoSelecionadaBandeira.value,
                            totalTaxas: taxaJuros,
                            idVenda: 0
                        }
                    )
                }
            } else {
                setPagamentoCartao(estadoInicialPagamentoCartao)
                setOpcaoSelecionadaParcela(estadoInicialOpcoesSelecoes)
                setOpcaoSelecionadaBandeira(estadoInicialOpcoesSelecoes)
                setTaxaJuros(0)
            }

            setErros([])
        }

        definirPagamentoCartao()
    }, [opcaoSelecionadaParcela, opcaoSelecionadaBandeira, taxaJuros, opcaoSelecionadaFormaDePagamento])

    const definirEstadoInicialPagamentoCartao = () => {
        setPagamentoCartao(estadoInicialPagamentoCartao)
        setOpcaoSelecionadaParcela(estadoInicialOpcoesSelecoes)
        setOpcaoSelecionadaBandeira(estadoInicialOpcoesSelecoes)
        setTaxaJuros(0)
    }

    const definirEstadoInicialSelecaoVenda = () => {
        setOpcaoSelecionadaFormaDePagamento(estadoInicialOpcoesSelecoes)
        setVenda({ ...venda, observacao: '' })
    }

    const resetarVenda = () => {
        setAdicaoProduto(false)
        definirEstadoInicialPagamentoCartao()
        setIdProdutoIdLinhaSelecionado([])
        definirEstadoInicialSelecaoVenda()
        setVenda(estadoInicialVenda)
        setProdutosSelecionados([])
        setValoresTotais([])
        setPrecoServico(0)
        setQtdLinha([1])
        buscarTodos()
        setErros([])
    }

    const resetarServico = () => {
        setServico(estadoInicialServico)
        setErros([])
        setOpcaoSelecionadaCliente(estadoInicialOpcoesSelecoes)
        setOpcaoSelecionadaMoto(estadoInicialOpcoesSelecoes)
        setAdicaoProduto(false)
    }

    const submit = async () => {
        try {
            const produtosVenda = produtosVendaIdLinha.map(item => item.produtoVenda)

            if (adicaoProduto) {
                if (produtosSelecionados.length) {
                    if (venda.formaDePagamento === "Cartão de Crédito") {
                        await salvarServico({ ...servico, venda: { ...venda, pagamentoCartao, produtosVenda, observacao: "Venda de Serviço" } })
                    } else {
                        await salvarServico({ ...servico, venda: { ...venda, produtosVenda, observacao: "Venda de Serviço" } })
                    }
                    resetarServico()
                    resetarVenda()
                    mensagemSucesso('Serviço cadastrado com sucesso!')
                } else {
                    mensagemAlerta("Selecione algum produto.")
                }
            } else {
                await salvarServico({ ...servico })
                mensagemSucesso('Serviço cadastrado com sucesso!')
                resetarServico()
                resetarVenda()
            }
        } catch (error) {
            mensagemErro('Erro no preenchimento dos campos')
            exibeErroCampoCliente()
            salvarErros(error, erros, setErros)
        }
    }

    const handlerRealizarServico = () => {
        ConfirmarDecisao("Confirmação de Serviço", "Tem certeza de que deseja realizar este serviço?", submit)
    }

    const exibeErroCampoCliente = () => {
        if (!opcaoSelecionadaCliente.value) {
            setErros([...erros, {
                nomeInput: "cpfCliente",
                mensagemErro: "O campo CPF do Cliente é obrigatório."
            }])
        }
    }

    const alternarEstadoAdicaoProduto = () => {
        if (adicaoProduto) {
            setAdicaoProduto(false)
            resetarVenda()
            setValoresTotais([])
        } else {
            setAdicaoProduto(true)
            setPrecoServico(servico.precoMaoDeObra)
        }
    }

    if (!foiCarregado) {
        return <LoadingLogo descricao='Carregando' />
    }

    return (
        <div className='div-form-container'>
            <h1 className="centered-text">
                <Save size='6vh' strokeWidth={3} /> Cadastro de Serviço
            </h1>
            <Card titulo="Dados do Serviço">
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
                        options={motosCliente.map(m => ({ label: `${m.marca} ${m.modelo} - [ ${m.placa} ]`, value: m.id }) as OpcoesSelecoes)}
                        instanceId="select-idMoto"
                    />
                    {<ExibeErro erros={erros} nomeInput="idMoto" />}
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
                                    taxaJuros={taxaJuros}
                                    setTaxaJuros={setTaxaJuros}
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
                        qtdLinha={qtdLinha}
                        setQtdLinha={setQtdLinha}
                        precoServico={precoServico}
                        setPrecoServico={setPrecoServico}
                        valoresTotais={valoresTotais}
                        setValoresTotais={setValoresTotais}
                        produtosSelecionados={produtosSelecionados}
                        setProdutosSelecionados={setProdutosSelecionados}
                        idProdutoIdLinhaSelecionado={idProdutoIdLinhaSelecionado}
                        setIdProdutoIdLinhaSelecionado={setIdProdutoIdLinhaSelecionado}
                        produtoVendaIdLinha={produtosVendaIdLinha}
                        setProdutoVendaIdLinha={setProdutoVendaIdLinha}
                        taxaJuros={taxaJuros}
                        setTaxaJuros={setTaxaJuros}
                        opcaoSelecionadaFormaDePagamento={opcaoSelecionadaFormaDePagamento}
                        setOpcaoSelecionadaFormaDePagamento={setOpcaoSelecionadaFormaDePagamento}
                    />
                )
            }

            <div className="divBotaoCadastrar">
                <button
                    onClick={handlerRealizarServico}
                    type="submit">
                    Realizar Serviço
                </button>
            </div>
        </div>
    )
}