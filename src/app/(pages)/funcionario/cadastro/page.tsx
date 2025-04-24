"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/DisplayError";
import { FormGroup } from "@/components/FormGroup";
import { CepInput, CpfInput, PhoneInput } from "@/components/Input";
import {
  AuthRegisterModelEmployee,
  authRegisterModelEmployeeInitialState,
  roleSelectOptions,
} from "@/models/authRegisterModel";
import { Address, addressInitialState } from "@/models/address";
import { Errors, saveErrors } from "@/models/errors";
import { employeeInitialState, Employee } from "@/models/employee";
import { selectionOptionsInitialState, selectionOptions } from "@/models/selectionOptions";
import { selectStyles } from "@/models/selectStyles";
import { errorMessage, successMessage } from "@/models/toast";
import { AuthenticationService } from "@/services/authenticationService";
import { AddressService } from "@/services/addressService";
import { Save } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";

export default function RegisterEmployee() {
  const { authRegisterEmployee } = AuthenticationService();
  const { getAddressByCep } = AddressService();

  const [errors, setErrors] = useState<Errors[]>([]);
  const [employeeAuth, setEmployeeAuth] = useState<AuthRegisterModelEmployee>(authRegisterModelEmployeeInitialState);
  const [employee, setEmployee] = useState<Employee>(employeeInitialState);
  const [address, setAddress] = useState<Address>(addressInitialState);
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [selectedRoleOption, setSelectedRoleOption] = useState<selectionOptions>(selectionOptionsInitialState);

  const setPropsAuthFuncionario = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setEmployeeAuth({ ...employeeAuth, [key]: e.target.value });
    setErrors([]);
  };

  const setEmployeeProps = (
    key: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setEmployee({ ...employee, [key]: e.target.value });
    setErrors([]);
  };

  const setAddressProps = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [key]: e.target.value });
    if (address.cep.length < 9 || key) {
      setErrors([]);
    }
  };

  useEffect(() => {
    getAddressByCep(address, setAddress, errors, setErrors);
  }, [address.cep]);

  useEffect(() => {
    setEmployeeAuth({
      ...employeeAuth,
      role: String(selectedRoleOption?.value),
    });
    setErrors([]);
  }, [selectedRoleOption]);

  const submit = async () => {
    try {
      if (confirmPassword === employeeAuth.password) {
        await authRegisterEmployee({
          ...employeeAuth,
          employee: { ...employee, address: address },
        });
      } else {
        throw new Error();
      }
      successMessage("Funcionário cadastrado com sucesso!");
      setEmployeeAuth(authRegisterModelEmployeeInitialState);
      setEmployee(employeeInitialState);
      setAddress(addressInitialState);
      setConfirmPassword("");
      setSelectedRoleOption(selectionOptionsInitialState);
      setErrors([]);
    } catch (erro: any) {
      errorMessage("Erro no preenchimento dos campos.");
      if (confirmPassword != employeeAuth.password) {
        errorMessage("As senhas não estão iguais.");
      }
      saveErrors(erro, errors, setErrors);
    }
  };

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Save size="6vh" strokeWidth={3} /> Cadastro de Funcionário
      </h1>
      <Card title="Dados do Funcionário">
        <FormGroup label="Nome: *" htmlFor="name">
          <input
            value={employee.name}
            onChange={(e) => setEmployeeProps("name", e)}
            id="name"
            type="text"
          />
          {<DisplayError errors={errors} inputName="name" />}
        </FormGroup>
        <FormGroup label="CPF: *" htmlFor="cpf">
          <CpfInput
            value={employee.cpf}
            onChange={(e) => setEmployeeProps("cpf", e)}
          />
          {<DisplayError errors={errors} inputName="cpf" />}
        </FormGroup>
        <FormGroup label="Celular: *" htmlFor="phone">
          <PhoneInput
            value={employee.phone}
            onChange={(e) => setEmployeeProps("phone", e)}
          />
          {<DisplayError errors={errors} inputName="phone" />}
        </FormGroup>
        <FormGroup label="Login: *" htmlFor="login">
          <input
            value={employeeAuth.login}
            id="email"
            onChange={(e) => setPropsAuthFuncionario("login", e)}
            type="text"
          />
          {<DisplayError errors={errors} inputName="login" />}
          {<DisplayError errors={errors} inputName="loginError" />}
        </FormGroup>
        <FormGroup label="Senha: *" htmlFor="password">
          <input
            value={employeeAuth.password}
            onChange={(e) => setPropsAuthFuncionario("password", e)}
            id="password"
            type="password"
          />
          {<DisplayError errors={errors} inputName="password" />}
        </FormGroup>
        <FormGroup label="Confirmar senha: *" htmlFor="confirmar-senha">
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="confirmar-senha"
            type="password"
          />
          {<DisplayError errors={errors} inputName="confirmarSenha" />}
        </FormGroup>
        <FormGroup label="Permissão no Sistema: *" htmlFor="formaDePagamento">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={selectedRoleOption}
            onChange={(option: any) => setSelectedRoleOption(option)}
            options={roleSelectOptions}
            instanceId="select-divisoes"
          />
          {<DisplayError errors={errors} inputName="role" />}
        </FormGroup>
      </Card>
      <Card title="Endereço do Funcionário">
        <FormGroup label="CEP: *" htmlFor="cep">
          <span className="cep-message">
            Digite o CEP para preenchimento automático do endereço.
          </span>
          <CepInput
            id="cep"
            value={address.cep}
            onChange={(e) => setAddressProps("cep", e)}
          />
          {<DisplayError errors={errors} inputName="cep" />}
        </FormGroup>
        <FormGroup label="Logradouro: *" htmlFor="road">
          <input
            value={address.road}
            onChange={(e) => setAddressProps("road", e)}
            id="road"
            type="text"
          />
          {<DisplayError errors={errors} inputName="road" />}
        </FormGroup>
        <FormGroup label="Número: *" htmlFor="number">
          <input
            className="input-number-form"
            value={address.number}
            onChange={(e) => setAddressProps("number", e)}
            id="number"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<DisplayError errors={errors} inputName="number" />}
        </FormGroup>
        <FormGroup label="Bairro: *" htmlFor="neighborhood">
          <input
            value={address.neighborhood}
            onChange={(e) => setAddressProps("neighborhood", e)}
            id="neighborhood"
            type="text"
          />
          {<DisplayError errors={errors} inputName="neighborhood" />}
        </FormGroup>
        <FormGroup label="Cidade: *" htmlFor="city">
          <input
            value={address.city}
            onChange={(e) => setAddressProps("city", e)}
            id="city"
            type="text"
          />
          {<DisplayError errors={errors} inputName="city" />}
        </FormGroup>
      </Card>
      <div className="divBotaoCadastrar">
        <button onClick={submit} type="submit">
          Cadastrar Funcionário
        </button>
      </div>
    </div>
  );
}
