"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/DisplayError";
import { FormGroup } from "@/components/FormGroup";
import { CepInput, PhoneInput } from "@/components/Input";
import { Customer, customerInitialState } from "@/models/customer";
import { Address, addressInitialState } from "@/models/address";
import { Errors, saveErrors } from "@/models/errors";
import { errorMessage, successMessage } from "@/models/toast";
import { CustomerService } from "@/services/customerService";
import { AddressService } from "@/services/addressService";
import { Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

interface UpdateCustomerProps {
  params: {
    customerCpf: string;
  };
}

export default function UpdateCustomer({ params }: UpdateCustomerProps) {
  const router = useRouter();

  const { updateCustomer, findCustomerByCpf } = CustomerService();
  const { findAddressById, getAddressByCep } = AddressService();

  const [errors, setErrors] = useState<Errors[]>([]);

  const [customer, setCustomer] = useState<Customer>(customerInitialState);

  const [address, setAddress] = useState<Address>(addressInitialState);

  const setCustomerProps = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [key]: e.target.value });
    setErrors([]);
  };

  const setAddressProps = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [key]: e.target.value });
    if (address.cep.length < 9 || errors) {
      setErrors([]);
    }
  };

  useEffect(() => {
    getAddressByCep(address, setAddress, errors, setErrors);
  }, [address.cep]);

  useEffect(() => {
    async function search() {
      const customerResponse = (await findCustomerByCpf(params.customerCpf)).data as Customer;
      setCustomer(customerResponse);

      if (customerResponse.address) {
        const addressResponse = (
          await findAddressById(customerResponse.address.id)
        ).data as Address;
        setAddress(addressResponse);
      }
    }
    search();
  }, []);

  const submit = async () => {
    try {
      await updateCustomer(customer.cpf, { ...customer, address: address });
      successMessage("Cliente atualizado com sucesso.");
      router.push("/cliente/listar");
    } catch (error: any) {
      saveErrors(error, errors, setErrors);
      errorMessage("Erro no preenchimento dos campos.");
    }
  };

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Edit3 size="6vh" strokeWidth={3} /> 
        Atualização de Cliente
      </h1>
      <Card title="Dados do Cliente">
        <FormGroup label="Nome: *" htmlFor="nome">
          <input
            value={customer.name}
            onChange={(e) => setCustomerProps("nome", e)}
            id="nome"
            type="text"
          />
          {<DisplayError errors={errors} inputName="nome" />}
        </FormGroup>
        <FormGroup label="Email: *" htmlFor="email">
          <input
            value={customer.email}
            onChange={(e) => setCustomerProps("email", e)}
            id="email"
            type="email"
          />
          {<DisplayError errors={errors} inputName="email" />}
        </FormGroup>
        <FormGroup label="Celular: *" htmlFor="telefone">
          <PhoneInput
            value={customer.phone}
            onChange={(e) => setCustomerProps("telefone", e)}
          />
          {<DisplayError errors={errors} inputName="telefone" />}
        </FormGroup>
      </Card>
      <Card title="Endereço do Cliente">
        <FormGroup label="CEP: *" htmlFor="cep">
          <span className="cep-message">
            Digite o CEP para preenchimento automático do endereço.
          </span>
          <CepInput
            value={address.cep}
            onChange={(e) => setAddressProps("cep", e)}
          />
          {<DisplayError errors={errors} inputName="cep" />}
        </FormGroup>
        <FormGroup label="Logradouro: *" htmlFor="rua">
          <input
            value={address.road}
            onChange={(e) => setAddressProps("rua", e)}
            id="rua"
            type="text"
          />
          {<DisplayError errors={errors} inputName="rua" />}
        </FormGroup>
        <FormGroup label="Número: *" htmlFor="numero">
          <input
            className="input-number-form"
            value={address.number}
            onChange={(e) => setAddressProps("numero", e)}
            id="numero"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<DisplayError errors={errors} inputName="numero" />}
        </FormGroup>
        <FormGroup label="Bairro: *" htmlFor="bairro">
          <input
            value={address.neighborhood}
            onChange={(e) => setAddressProps("bairro", e)}
            id="bairro"
            type="text"
          />
          {<DisplayError errors={errors} inputName="bairro" />}
        </FormGroup>
        <FormGroup label="Cidade: *" htmlFor="cidade">
          <input
            value={address.city}
            onChange={(e) => setAddressProps("cidade", e)}
            id="cidade"
            type="text"
          />
          {<DisplayError errors={errors} inputName="cidade" />}
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
