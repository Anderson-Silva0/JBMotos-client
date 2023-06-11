import React from "react";
import InputMask from "react-input-mask"

interface inputProps {
    value?: string | number | readonly string[] | undefined
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
}

export const InputCep = (props: inputProps) => (
    <InputMask mask="99999-999" value={props.value} onChange={props.onChange} />
)

export const InputCnpj = (props: inputProps) => (
    <InputMask mask="99.999.999/9999-99" value={props.value} onChange={props.onChange} />
)

export const InputCpf = (props: inputProps) => (
    <InputMask mask="999.999.999-99" value={props.value} onChange={props.onChange} />
)


export const InputTelefone = (props: inputProps) => (
    <InputMask mask="(99) 99999-9999" value={props.value} onChange={props.onChange} />
)

