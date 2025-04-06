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
        <FormGroup label="Nome: *" htmlFor="name">
          <input
            value={customer.name}
            onChange={(e) => setCustomerProps("name", e)}
            id="name"
            type="text"
          />
          {<DisplayError errors={errors} inputName="name" />}
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
          Atualizar Cliente
        </button>
      </div>
    </div>
  );
}
