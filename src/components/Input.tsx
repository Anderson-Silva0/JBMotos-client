import React from "react"
import InputMask from "react-input-mask"

interface inputProps {
    value?: string | number | readonly string[] | undefined
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
    placeholder?: string
    type?: string
}

export const InputCep = (props: inputProps) => (
    <InputMask
        mask="99999-999"
        placeholder={props.placeholder}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        maskChar={null}
    />
)

export const InputCnpj = (props: inputProps) => (
    <InputMask
        mask="99.999.999/9999-99"
        placeholder={props.placeholder}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        maskChar={null}
    />
)

export const InputCpf = (props: inputProps) => (
    <InputMask
        mask="999.999.999-99"
        placeholder={props.placeholder}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        maskChar={null}
    />
)


export const InputTelefone = (props: inputProps) => (
    <InputMask
        mask="(99) 99999-9999"
        placeholder={props.placeholder}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        maskChar={null}
    />
)

