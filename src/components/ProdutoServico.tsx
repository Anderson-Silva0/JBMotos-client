'use client'

import TabelaVenda from "./TabelaVenda";
import { LinhaTabela } from "./LinhaTabela";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Produto } from "@/models/produto";
import { IdProdutoEIdLinha, ProdutoSelecionadoProps, ProdutoVendaIdLinhaProps, RegistroProdutoSelecionadoProps, ValoresTotaisProps } from "@/app/(pages)/venda/cadastro/page";
import { mensagemAlerta } from "@/models/toast";
import { formatarParaReal } from "@/models/formatadorReal";
import imgRemoverLinha from '@/images/icons8-delete-row-100.png';
import imgAdicionarLinha from '@/images/icons8-insert-row-48.png';
import Image from "next/image";
import { OpcoesSelecoes } from "@/models/Selecoes";

interface ProdutoServicoProps {
    produtos: Produto[]
    setProdutos: Dispatch<SetStateAction<Produto[]>>
    todosProdutos: Produto[]
    produtosSelecionados: ProdutoSelecionadoProps[]
    setProdutosSelecionados: Dispatch<SetStateAction<ProdutoSelecionadoProps[]>>
    idProdutoIdLinhaSelecionado: IdProdutoEIdLinha[]
    setIdProdutoIdLinhaSelecionado: Dispatch<SetStateAction<IdProdutoEIdLinha[]>>
    qtdLinha: number[]
    setQtdLinha: Dispatch<SetStateAction<number[]>>
    valoresTotais: ValoresTotaisProps[]
    setValoresTotais: Dispatch<SetStateAction<ValoresTotaisProps[]>>
    setProdutoVendaIdLinha: Dispatch<SetStateAction<ProdutoVendaIdLinhaProps[]>>
    produtoVendaIdLinha: ProdutoVendaIdLinhaProps[]
    precoServico: number
    setPrecoServico: Dispatch<SetStateAction<number>>
    taxaJuros: number
    setTaxaJuros: Dispatch<SetStateAction<number>>
    opcaoSelecionadaFormaDePagamento: OpcoesSelecoes
    setOpcaoSelecionadaFormaDePagamento: (value: SetStateAction<OpcoesSelecoes>) => void
}

export default function ProdutoServico(props: ProdutoServicoProps) {

    const [registrosProdutosVenda, setRegistrosProdutosVenda] = useState<RegistroProdutoSelecionadoProps[]>([])
    const [valorTotalServico, setValorTotalServico] = useState<number>(0)
    const [descontoTonReais, setDescontoTonReais] = useState<number>(0)
    const [valorLiquido, setValorLiquido] = useState<number>(0)

    const atualizarElemento = (indice: number, idProduto: number, idLinha: number) => {
        props.setIdProdutoIdLinhaSelecionado(prevState => {
            const novaLista = [...prevState]
            if (indice >= 0 && indice < novaLista.length) {
                novaLista[indice] = { idProduto, idLinha }
            }
            return novaLista
        })
    }

    const atualizarIdProdutoIdLinhaSelecionado = (idProduto: number, idLinhaAtual: number) => {
        const indiceIdProdutoIdLinha = props.idProdutoIdLinhaSelecionado.findIndex((idprodutoIdLinha) => idprodutoIdLinha.idLinha === idLinhaAtual)

        if (props.idProdutoIdLinhaSelecionado[indiceIdProdutoIdLinha]?.idLinha) {
            atualizarElemento(indiceIdProdutoIdLinha, idProduto, idLinhaAtual)
        } else {
            props.setIdProdutoIdLinhaSelecionado([...props.idProdutoIdLinhaSelecionado, { idProduto: idProduto, idLinha: idLinhaAtual }])
        }
    }

    const adicionarLinha = () => {
        const produtosAtivos = props.todosProdutos.filter(p => p.statusProduto === 'ATIVO')
        if (props.qtdLinha.length < produtosAtivos.length) {
            const newId = Math.floor(Math.random() * 1000000)
            props.setQtdLinha([...props.qtdLinha, newId])
        } else if (props.qtdLinha.length === produtosAtivos.length) {
            mensagemAlerta(gerarMensagemAlertaProdutosAtivos(produtosAtivos))
        }
    }

    const removerLinha = () => {
        const novasLinhas = [...props.qtdLinha]
        if (props.qtdLinha.length > 1) {
            novasLinhas.pop()
            if (props.qtdLinha.length === props.idProdutoIdLinhaSelecionado.length) {
                const produtoExcluido = props.idProdutoIdLinhaSelecionado.pop()
                if (produtoExcluido) {
                    const produtoExcluidoNoPop = props.produtosSelecionados.filter(produto => produto.produto.id === produtoExcluido.idProduto)[0].produto

                    const novosValoresTotais = props.valoresTotais.filter(valor => valor.idLinha !== produtoExcluido.idLinha)
                    props.setValoresTotais(novosValoresTotais)

                    const indiceParaRemover = props.produtoVendaIdLinha.findIndex((item) => item.produtoVenda.idProduto === produtoExcluido.idProduto)
                    if (indiceParaRemover >= 0) {
                        props.produtoVendaIdLinha.splice(indiceParaRemover, 1)
                    }

                    props.setProdutos([...props.produtos, produtoExcluidoNoPop])
                }
            }
        }
        props.setQtdLinha(novasLinhas)
    }

    const gerarMensagemAlertaProdutosAtivos = (produtosAtivos: Produto[]) => {
        let mensagem = ''

        if (props.todosProdutos.length > 1 && produtosAtivos.length > 1) {
            mensagem = `Não é possível adicionar mais linhas, pois existem  
          ${props.todosProdutos.length} produtos no total`
        } else if (props.todosProdutos.length > 1 && produtosAtivos.length === 1) {
            mensagem = `Não é possível adicionar mais linhas, pois existem  
          ${props.todosProdutos.length} produtos no total`
        } else if (props.todosProdutos.length === 1) {
            mensagem = `Não é possível adicionar mais linhas, pois existe  
          ${props.todosProdutos.length} produto no total, e ${produtosAtivos.length} ativo.`
        }

        if (produtosAtivos.length < props.todosProdutos.length && produtosAtivos.length > 1) {
            mensagem += `, mas apenas ${produtosAtivos.length} estão ativos.`
        } else if (produtosAtivos.length < props.todosProdutos.length && produtosAtivos.length == 1 && props.todosProdutos.length > 1) {
            mensagem += `, mas apenas ${produtosAtivos.length} ativo.`
        }

        return mensagem
    }

    useEffect(() => {
        const totalServico = props.valoresTotais.reduce((acumulador, valor) => acumulador + valor.valorTotal, 0) + props.precoServico
        setValorTotalServico(totalServico)
    }, [props.valoresTotais, props.precoServico])

    useEffect(() => {
        setDescontoTonReais(props.taxaJuros / 100 * valorTotalServico)
        setValorLiquido(valorTotalServico - descontoTonReais)
    }, [valorTotalServico, props.taxaJuros, descontoTonReais])

    return (
        <div className="div-form-container">
            <TabelaVenda >
                {
                    props.qtdLinha.map(idLinha => {
                        return (
                            <LinhaTabela key={idLinha}
                                idLinha={idLinha}
                                produtos={props.produtos}
                                qtdLinha={props.qtdLinha}
                                produtoVendaIdLinha={props.produtoVendaIdLinha}
                                setProdutoVendaIdLinha={props.setProdutoVendaIdLinha}
                                atualizarIdProdutoIdLinhaSelecionado={atualizarIdProdutoIdLinhaSelecionado}
                                valoresTotais={props.valoresTotais}
                                setValoresTotais={props.setValoresTotais}
                                setProdutos={props.setProdutos}
                                produtosSelecionados={props.produtosSelecionados}
                                setProdutosSelecionados={props.setProdutosSelecionados}
                                registrosProdutosVenda={registrosProdutosVenda}
                                setRegistrosProdutosVenda={setRegistrosProdutosVenda}
                            />
                        )
                    })
                }
            </TabelaVenda>

            <div style={{ display: 'flex', justifyContent: 'space-around', width: '50vw' }}>
                <div id="valor-total-venda">
                    <span>Valor Bruto</span>
                    <span>
                        {formatarParaReal(valorTotalServico)}
                    </span>
                </div>
                {
                    props.opcaoSelecionadaFormaDePagamento.value === "Cartão de Crédito" && (
                        <>
                            <div id="valor-total-venda" >
                                <span style={{ color: 'red' }}>Desconto Ton</span>
                                <span style={{ color: 'red' }}>
                                    {formatarParaReal(descontoTonReais)}
                                </span>
                            </div>
                            <div id="valor-total-venda">
                                <span>Valor Líquido</span>
                                <span>
                                    {formatarParaReal(valorLiquido)}
                                </span>
                            </div>
                        </>
                    )
                }
            </div>
            <div className="div-botoes-line">
                <button onClick={adicionarLinha} className="botao-add-line">
                    <Image src={imgAdicionarLinha} width={40} height={40} alt={""} />
                </button>
                <button onClick={removerLinha} className="botao-remove-line">
                    <Image src={imgRemoverLinha} width={40} height={40} alt={""} />
                </button>
            </div>
        </div>
    )
} 