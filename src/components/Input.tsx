import React from "react";
import InputMask from "react-input-mask";

interface inputProps {
  value?: string | number | readonly string[] | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  placeholder?: string;
  type?: string;
  id?: string;
  className?: string;
}

export const CepInput = (props: inputProps) => (
  <InputMask
    mask="99999-999"
    placeholder={props.placeholder}
    type={props.type}
    id={props.id}
    className={props.className}
    value={props.value}
    onChange={props.onChange}
    maskChar={null}
  />
);

export const CnpjInput = (props: inputProps) => (
  <InputMask
    mask="99.999.999/9999-99"
    placeholder={props.placeholder}
    type={props.type}
    id={props.id}
    className={props.className}
    value={props.value}
    onChange={props.onChange}
    maskChar={null}
  />
);

export const CpfInput = (props: inputProps) => (
  <InputMask
    mask="999.999.999-99"
    placeholder={props.placeholder}
    type={props.type}
    id={props.id}
    className={props.className}
    value={props.value}
    onChange={props.onChange}
    maskChar={null}
  />
);

export const PhoneInput = (props: inputProps) => (
  <InputMask
    mask="(99) 99999-9999"
    placeholder={props.placeholder}
    type={props.type}
    id={props.id}
    className={props.className}
    value={props.value}
    onChange={props.onChange}
    maskChar={null}
  />
);

export const PlateInput = (props: inputProps) => (
  <InputMask
    mask="aaa-9*99"
    placeholder={props.placeholder}
    type={props.type}
    id={props.id}
    className={props.className}
    value={props.value}
    onChange={props.onChange}
    maskChar={null}
  />
);
