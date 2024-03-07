import { OpcoesSelecoes } from "@/models/Selecoes";
import { selectStyles } from "@/models/selectStyles";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import Select from "react-select";
import { ExibeErro } from "./ExibeErro";
import { formatarParaReal } from "@/models/formatadorReal";
import { bandeiras, obterParcelas } from "@/models/formasPagamento";
import { Erros } from "@/models/erros";

interface PagamentoCreditoProps {
    erros: Erros[]
    totalTaxasState: string | number
    setTotalTaxaState: Dispatch<SetStateAction<string | number>>
    opcaoSelecionadaParcela: OpcoesSelecoes
    setOpcaoSelecionadaParcela: Dispatch<SetStateAction<OpcoesSelecoes>>
    opcaoSelecionadaBandeira: OpcoesSelecoes
    setOpcaoSelecionadaBandeira: Dispatch<SetStateAction<OpcoesSelecoes>>
}

export function PagamentoCredito(props: PagamentoCreditoProps) {

    const setPropsProdutoMoney = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value.replace(/\D/g, '')) / 100
        const limitedValue = Math.min(value, 100000)
        props.setTotalTaxaState(limitedValue)
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

            <label htmlFor="teste">Bandeira</label>
            <Select
                styles={selectStyles}
                placeholder="Selecione..."
                value={props.opcaoSelecionadaBandeira}
                onChange={(option: any) => props.setOpcaoSelecionadaBandeira(option)}
                options={bandeiras}
                instanceId="select-divisoes"
            />
            {<ExibeErro erros={props.erros} nomeInput="bandeira" />}

            <label htmlFor="precoCusto">Total de Taxas</label>
            <input
                value={formatarParaReal(props.totalTaxasState)}
                onChange={(e) => setPropsProdutoMoney(e)}
                id="precoCusto"
                type="text"
            />
            {<ExibeErro erros={props.erros} nomeInput="totalTaxas" />}
        </div>
    )
}