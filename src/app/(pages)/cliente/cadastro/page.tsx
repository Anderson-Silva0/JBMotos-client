"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/DisplayError";
import { FormGroup } from "@/components/FormGroup";
import { CepInput, CpfInput, PhoneInput } from "@/components/Input";
import { Customer, customerInitialState } from "@/models/customer";
import { Address, addressInitialState } from "@/models/address";
import { Errors, saveErrors } from "@/models/errors";
import { errorMessage, successMessage } from "@/models/toast";
import { CustomerService } from "@/services/customerService";
import { AddressService } from "@/services/addressService";
import { Save } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

export default function CadastroCliente() {
  const { saveCustomer } = CustomerService();
  const { getAddressByCep } = AddressService();

  const [errors, setErrors] = useState<Errors[]>([]);

  const [customer, setCustomer] = useState<Customer>(customerInitialState);

  const [address, setAddress] = useState<Address>(addressInitialState);

  const setCustomerProps = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [key]: e.target.value });
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

  const submit = async () => {
    try {
      await saveCustomer({ ...customer, address: address });
      successMessage("Cliente cadastrado com sucesso!");
      setCustomer(customerInitialState);
      setAddress(addressInitialState);
      setErrors([]);
    } catch (error: any) {
      errorMessage("Erro no preenchimento dos campos.");
      saveErrors(error, errors, setErrors);
    }
  };

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Save size="6vh" strokeWidth={3} /> Cadastro de Cliente
      </h1>
      <Card title="Dados do Cliente">
        <FormGroup label="Nome: *" htmlFor="name">
          <input
            value={customer.name}
            onChange={(e) => setCustomerProps("name", e)}
            id="name"
            type="text"
          />
          {<DisplayError errors={errors} inputName="name" />}
        </FormGroup>
        <FormGroup label="CPF: *" htmlFor="cpf">
          <CpfInput
            id="cpf"
            value={customer.cpf}
            onChange={(e) => setCustomerProps("cpf", e)}
          />
          {<DisplayError errors={errors} inputName="cpf" />}
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
        <FormGroup label="Celular: *" htmlFor="phone">
          <PhoneInput
            id="phone"
            value={customer.phone}
            onChange={(e) => setCustomerProps("phone", e)}
          />
          {<DisplayError errors={errors} inputName="phone" />}
        </FormGroup>
      </Card>
      <Card title="Endereço do Cliente">
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
          Cadastrar Cliente
        </button>
      </div>
    </div>
  );
}
