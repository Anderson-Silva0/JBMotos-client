'use client'

import { OpcoesSelecoes } from "@/models/Selecoes";
import { selectStyles } from "@/models/selectStyles";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import Select from "react-select";
import { ExibeErro } from "./ExibeErro";
import { formatarParaPercentual, formatarParaReal } from "@/models/formatadorReal";
import { bandeiras, obterParcelas } from "@/models/formasPagamento";
import { Erros } from "@/models/erros";

interface PagamentoCreditoProps {
    erros: Erros[]
    taxaJuros: number
    setTaxaJuros: Dispatch<SetStateAction<number>>
    opcaoSelecionadaParcela: OpcoesSelecoes
    setOpcaoSelecionadaParcela: Dispatch<SetStateAction<OpcoesSelecoes>>
    opcaoSelecionadaBandeira: OpcoesSelecoes
    setOpcaoSelecionadaBandeira: Dispatch<SetStateAction<OpcoesSelecoes>>
}

export function PagamentoCredito(props: PagamentoCreditoProps) {

    const atualizarTaxaJuros = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value.replace(/\D/g, '')) / 100
        const limitedValue = Math.min(value, 100000)
        props.setTaxaJuros(limitedValue)
    }

    return (
        <div className="config-pagamentos">
            <label htmlFor="select-divisoes">Parcelas</label>
            <Select
                styles={selectStyles}
                placeholder="Selecione..."
                value={props.opcaoSelecionadaParcela}
                onChange={(option: any) => props.setOpcaoSelecionadaParcela(option)}
                options={obterParcelas()}
                instanceId="select-divisoes"
                id="select-divisoes"
            />
            {<ExibeErro erros={props.erros} nomeInput="parcela" />}

            <label htmlFor="select-bandeiras">Bandeira</label>
            <Select
                styles={selectStyles}
                placeholder="Selecione..."
                value={props.opcaoSelecionadaBandeira}
                onChange={(option: any) => props.setOpcaoSelecionadaBandeira(option)}
                options={bandeiras}
                instanceId="select-divisoes"
                id="select-bandeiras"
            />
            {<ExibeErro erros={props.erros} nomeInput="bandeira" />}

            <label htmlFor="taxaJuros">Taxa de Juros (Ton)</label>
            <input
                value={formatarParaPercentual(props.taxaJuros)}
                onChange={(e) => atualizarTaxaJuros(e)}
                type="text"
                id="taxaJuros"
            />
            {<ExibeErro erros={props.erros} nomeInput="totalTaxas" />}
        </div>
    )
}