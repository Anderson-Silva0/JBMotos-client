"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/ExibeErro";
import { FormGroup } from "@/components/Form-group";
import { CepInput, CpfInput, PhoneInput } from "@/components/Input";
import {
  AuthRegisterModelEmployee,
  authRegisterModelEmployeeInitialState,
  ROLE,
  roleSelectOptions,
} from "@/models/authRegisterModel";
import { Address, addressInitialState } from "@/models/endereco";
import { Errors, saveErrors } from "@/models/erros";
import { employeeInitialState, Employee } from "@/models/funcionario";
import {
  selectionOptionsInitialState,
  selectionOptions,
} from "@/models/Selecoes";
import { selectStyles } from "@/models/selectStyles";
import { errorMessage, successMessage } from "@/models/toast";
import { AuthenticationService } from "@/services/authenticationService";
import { AddressService } from "@/services/enderecoService";
import { Save } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";

export default function CadastroFuncionario() {
  const { authRegisterEmployee: authRegisterFuncionario } = AuthenticationService();
  const { getAddressByCep: obterEnderecoPorCep } = AddressService();

  const [erros, setErros] = useState<Errors[]>([]);
  const [authFuncionario, setAuthFuncionario] =
    useState<AuthRegisterModelEmployee>(authRegisterModelEmployeeInitialState);
  const [funcionario, setFuncionario] =
    useState<Employee>(employeeInitialState);
  const [endereco, setEndereco] = useState<Address>(addressInitialState);
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");

  const [opcaoSelecionadaRole, setOpcaoSelecionadaRole] =
    useState<selectionOptions>(selectionOptionsInitialState);

  const setPropsAuthFuncionario = (
    key: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setAuthFuncionario({ ...authFuncionario, [key]: e.target.value });
    setErros([]);
  };

  const setPropsFuncionario = (
    key: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFuncionario({ ...funcionario, [key]: e.target.value });
    setErros([]);
  };

  const setPropsEndereco = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setEndereco({ ...endereco, [key]: e.target.value });
    if (endereco.cep.length < 9 || key) {
      setErros([]);
    }
  };

  useEffect(() => {
    obterEnderecoPorCep(endereco, setEndereco, erros, setErros);
  }, [endereco.cep]);

  useEffect(() => {
    setAuthFuncionario({
      ...authFuncionario,
      role: String(opcaoSelecionadaRole?.value),
    });
    setErros([]);
  }, [opcaoSelecionadaRole]);

  const submit = async () => {
    try {
      if (confirmarSenha === authFuncionario.password) {
        await authRegisterFuncionario({
          ...authFuncionario,
          employee: { ...funcionario, address: endereco },
        });
      } else {
        throw new Error();
      }
      successMessage("Funcionário cadastrado com sucesso!");
      setAuthFuncionario(authRegisterModelEmployeeInitialState);
      setFuncionario(employeeInitialState);
      setEndereco(addressInitialState);
      setConfirmarSenha("");
      setOpcaoSelecionadaRole(selectionOptionsInitialState);
      setErros([]);
    } catch (erro: any) {
      errorMessage("Erro no preenchimento dos campos.");
      if (confirmarSenha != authFuncionario.password) {
        errorMessage("As senhas não estão iguais.");
      }
      saveErrors(erro, erros, setErros);
    }
  };

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Save size="6vh" strokeWidth={3} /> Cadastro de Funcionário
      </h1>
      <Card title="Dados do Funcionário">
        <FormGroup label="Nome: *" htmlFor="nome">
          <input
            value={funcionario.name}
            onChange={(e) => setPropsFuncionario("nome", e)}
            id="nome"
            type="text"
          />
          {<DisplayError errors={erros} inputName="nome" />}
        </FormGroup>
        <FormGroup label="CPF: *" htmlFor="cpf">
          <CpfInput
            value={funcionario.cpf}
            onChange={(e) => setPropsFuncionario("cpf", e)}
          />
          {<DisplayError errors={erros} inputName="cpf" />}
        </FormGroup>
        <FormGroup label="Celular: *" htmlFor="telefone">
          <PhoneInput
            value={funcionario.phone}
            onChange={(e) => setPropsFuncionario("telefone", e)}
          />
          {<DisplayError errors={erros} inputName="telefone" />}
        </FormGroup>
        <FormGroup label="Login: *" htmlFor="login">
          <input
            value={authFuncionario.login}
            id="email"
            onChange={(e) => setPropsAuthFuncionario("login", e)}
            type="text"
          />
          {<DisplayError errors={erros} inputName="login" />}
          {<DisplayError errors={erros} inputName="loginError" />}
        </FormGroup>
        <FormGroup label="Senha: *" htmlFor="senha">
          <input
            value={authFuncionario.password}
            onChange={(e) => setPropsAuthFuncionario("senha", e)}
            id="senha"
            type="password"
          />
          {<DisplayError errors={erros} inputName="senha" />}
        </FormGroup>
        <FormGroup label="Confirmar senha: *" htmlFor="confirmar-senha">
          <input
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            id="confirmar-senha"
            type="password"
          />
          {<DisplayError errors={erros} inputName="confirmarSenha" />}
        </FormGroup>
        <FormGroup label="Permissão no Sistema: *" htmlFor="formaDePagamento">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={opcaoSelecionadaRole}
            onChange={(option: any) => setOpcaoSelecionadaRole(option)}
            options={roleSelectOptions}
            instanceId="select-divisoes"
          />
          {<DisplayError errors={erros} inputName="role" />}
        </FormGroup>
      </Card>
      <Card title="Endereço do Funcionário">
        <FormGroup label="CEP: *" htmlFor="cep">
          <span className="cep-message">
            Digite o CEP para preenchimento automático do endereço.
          </span>
          <cepInput
            id="cep"
            value={endereco.cep}
            onChange={(e) => setPropsEndereco("cep", e)}
          />
          {<DisplayError errors={erros} inputName="cep" />}
        </FormGroup>
        <FormGroup label="Logradouro: *" htmlFor="rua">
          <input
            value={endereco.road}
            onChange={(e) => setPropsEndereco("rua", e)}
            id="rua"
            type="text"
          />
          {<DisplayError errors={erros} inputName="rua" />}
        </FormGroup>
        <FormGroup label="Número: *" htmlFor="numero">
          <input
            className="input-number-form"
            value={endereco.number}
            onChange={(e) => setPropsEndereco("numero", e)}
            id="numero"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<DisplayError errors={erros} inputName="numero" />}
        </FormGroup>
        <FormGroup label="Bairro: *" htmlFor="bairro">
          <input
            value={endereco.neighborhood}
            onChange={(e) => setPropsEndereco("bairro", e)}
            id="bairro"
            type="text"
          />
          {<DisplayError errors={erros} inputName="bairro" />}
        </FormGroup>
        <FormGroup label="Cidade: *" htmlFor="cidade">
          <input
            value={endereco.city}
            onChange={(e) => setPropsEndereco("cidade", e)}
            id="cidade"
            type="text"
          />
          {<DisplayError errors={erros} inputName="cidade" />}
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
