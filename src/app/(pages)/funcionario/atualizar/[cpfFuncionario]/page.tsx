"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/ExibeErro";
import { FormGroup } from "@/components/Form-group";
import { CepInput, PhoneInput } from "@/components/Input";
import { Address, addressInitialState } from "@/models/endereco";
import { Errors, saveErrors } from "@/models/erros";
import { Employee, employeeInitialState } from "@/models/funcionario";
import { errorMessage, successMessage } from "@/models/toast";
import { AddressService } from "@/services/enderecoService";
import { EmployeeService } from "@/services/funcionarioService";
import { Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

interface AtualizarFuncionarioProps {
  params: {
    cpfFuncionario: string;
  };
}

export default function AtualizarFuncionario({
  params,
}: AtualizarFuncionarioProps) {
  const router = useRouter();

  const { updateEmployee: atualizarFuncionario, findEmployeeByCpf: buscarFuncionarioPorCpf } =
    EmployeeService();
  const { findAddressById: buscarEnderecoPorId, getAddressByCep: obterEnderecoPorCep } = AddressService();

  const [erros, setErros] = useState<Errors[]>([]);

  const [funcionario, setFuncionario] =
    useState<Employee>(employeeInitialState);

  const [endereco, setEndereco] = useState<Address>(addressInitialState);

  const setPropsFuncionario = (
    key: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFuncionario({ ...funcionario, [key]: e.target.value });
    setErros([]);
  };

  const setPropsEndereco = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setEndereco({ ...endereco, [key]: e.target.value });
    if (endereco.cep.length < 9 || erros) {
      setErros([]);
    }
  };

  useEffect(() => {
    obterEnderecoPorCep(endereco, setEndereco, erros, setErros);
  }, [endereco.cep]);

  useEffect(() => {
    const buscar = async () => {
      const funcionarioResponse = (
        await buscarFuncionarioPorCpf(params.cpfFuncionario)
      ).data as Employee;
      setFuncionario(funcionarioResponse);

      if (funcionarioResponse.address) {
        const enderecoResponse = (
          await buscarEnderecoPorId(funcionarioResponse.address.id)
        ).data as Address;
        setEndereco(enderecoResponse);
      }
    };
    buscar();
  }, []);

  const submit = async () => {
    try {
      await atualizarFuncionario(funcionario.cpf, { ...funcionario, address: endereco });
      successMessage("Funcionário atualizado com sucesso.");
      router.push("/funcionario/listar");
    } catch (error: any) {
      saveErrors(error, erros, setErros);
      errorMessage("Erro no preenchimento dos campos.");
    }
  };

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Edit3 size="6vh" strokeWidth={3} /> Atualização de Funcionário
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
        <FormGroup label="Celular: *" htmlFor="telefone">
          <PhoneInput
            value={funcionario.phone}
            onChange={(e) => setPropsFuncionario("telefone", e)}
          />
          {<DisplayError errors={erros} inputName="telefone" />}
        </FormGroup>
      </Card>
      <Card title="Endereço do Funcionário">
        <FormGroup label="CEP: *" htmlFor="cep">
          <span className="cep-message">
            Digite o CEP para preenchimento automático do endereço.
          </span>
          <cepInput
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
          Atualizar Funcionário
        </button>
      </div>
    </div>
  );
}
