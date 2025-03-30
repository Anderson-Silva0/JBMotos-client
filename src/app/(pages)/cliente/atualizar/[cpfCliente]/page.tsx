"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/ExibeErro";
import { FormGroup } from "@/components/Form-group";
import { CepInput, PhoneInput } from "@/components/Input";
import { Customer, customerInitialState } from "@/models/cliente";
import { Address, addressInitialState } from "@/models/endereco";
import { Errors, saveErrors } from "@/models/erros";
import { errorMessage, successMessage } from "@/models/toast";
import { CustomerService } from "@/services/clienteService";
import { AddressService } from "@/services/enderecoService";
import { Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

interface AtualizarClienteProps {
  params: {
    cpfCliente: string;
  };
}

export default function AtualizarCliente({ params }: AtualizarClienteProps) {
  const router = useRouter();

  const { updateCustomer: atualizarCliente, findCustomerByCpf: buscarClientePorCpf } = CustomerService();
  const { findAddressById: buscarEnderecoPorId, getAddressByCep: obterEnderecoPorCep } = AddressService();

  const [erros, setErros] = useState<Errors[]>([]);

  const [cliente, setCliente] = useState<Customer>(customerInitialState);

  const [endereco, setEndereco] = useState<Address>(addressInitialState);

  const setPropsCliente = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setCliente({ ...cliente, [key]: e.target.value });
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
      const clienteResponse = (await buscarClientePorCpf(params.cpfCliente))
        .data as Customer;
      setCliente(clienteResponse);

      if (clienteResponse.address) {
        const enderecoResponse = (
          await buscarEnderecoPorId(clienteResponse.address.id)
        ).data as Address;
        setEndereco(enderecoResponse);
      }
    };
    buscar();
  }, []);

  const submit = async () => {
    try {
      await atualizarCliente(cliente.cpf, { ...cliente, address: endereco });
      successMessage("Cliente atualizado com sucesso.");
      router.push("/cliente/listar");
    } catch (error: any) {
      saveErrors(error, erros, setErros);
      errorMessage("Erro no preenchimento dos campos.");
    }
  };

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Edit3 size="6vh" strokeWidth={3} /> Atualização de Cliente
      </h1>
      <Card title="Dados do Cliente">
        <FormGroup label="Nome: *" htmlFor="nome">
          <input
            value={cliente.name}
            onChange={(e) => setPropsCliente("nome", e)}
            id="nome"
            type="text"
          />
          {<DisplayError errors={erros} inputName="nome" />}
        </FormGroup>
        <FormGroup label="Email: *" htmlFor="email">
          <input
            value={cliente.email}
            onChange={(e) => setPropsCliente("email", e)}
            id="email"
            type="email"
          />
          {<DisplayError errors={erros} inputName="email" />}
        </FormGroup>
        <FormGroup label="Celular: *" htmlFor="telefone">
          <PhoneInput
            value={cliente.phone}
            onChange={(e) => setPropsCliente("telefone", e)}
          />
          {<DisplayError errors={erros} inputName="telefone" />}
        </FormGroup>
      </Card>
      <Card title="Endereço do Cliente">
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
          Atualizar Cliente
        </button>
      </div>
    </div>
  );
}
