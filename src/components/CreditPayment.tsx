"use client";

import { selectionOptions } from "@/models/selectionOptions";
import { selectStyles } from "@/models/selectStyles";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import Select from "react-select";
import { DisplayError } from "./DisplayError";
import { formatToPercentage } from "@/models/currencyFormatters";
import { cardFlags, getInstallments } from "@/models/paymentMethods";
import { Errors } from "@/models/errors";

interface CreditPaymentProps {
  errors: Errors[];
  interestRate: number;
  setInterestRate: Dispatch<SetStateAction<number>>;
  selectedInstallmentOption: selectionOptions;
  setSelectedInstallmentOption: Dispatch<SetStateAction<selectionOptions>>;
  selectedCardFlagOption: selectionOptions;
  setSelectedCardFlagOption: Dispatch<SetStateAction<selectionOptions>>;
}

export function CreditPayment(props: CreditPaymentProps) {
  const updateInterestRate = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/\D/g, "")) / 100;
    const limitedValue = Math.min(value, 100000);
    props.setInterestRate(limitedValue);
  };

  return (
    <div className="config-pagamentos">
      <label htmlFor="select-divisoes">Parcelas</label>
      <Select
        styles={selectStyles}
        placeholder="Selecione..."
        value={props.selectedInstallmentOption}
        onChange={(option: any) => props.setSelectedInstallmentOption(option)}
        options={getInstallments()}
        instanceId="select-divisoes"
        id="select-divisoes"
      />
      {<DisplayError errors={props.errors} inputName="parcela" />}

      <label htmlFor="select-bandeiras">Bandeira</label>
      <Select
        styles={selectStyles}
        placeholder="Selecione..."
        value={props.selectedCardFlagOption}
        onChange={(option: any) => props.setSelectedCardFlagOption(option)}
        options={cardFlags}
        instanceId="select-divisoes"
        id="select-bandeiras"
      />
      {<DisplayError errors={props.errors} inputName="bandeira" />}

      <label htmlFor="taxaJuros">Taxa de Juros (Ton)</label>
      <input
        value={formatToPercentage(props.interestRate)}
        onChange={(e) => updateInterestRate(e)}
        type="text"
        id="taxaJuros"
      />
      {<DisplayError errors={props.errors} inputName="totalTaxas" />}
    </div>
  );
}
