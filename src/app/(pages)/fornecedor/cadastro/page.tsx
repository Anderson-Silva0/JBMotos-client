"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/DisplayError";
import { FormGroup } from "@/components/FormGroup";
import { CepInput, CnpjInput, PhoneInput } from "@/components/Input";
import { Address, addressInitialState } from "@/models/address";
import { Errors, saveErrors } from "@/models/errors";
import { Supplier, supplierInitialState } from "@/models/supplier";
import { errorMessage, successMessage } from "@/models/toast";
import { AddressService } from "@/services/addressService";
import { SupplierService } from "@/services/supplierService";
import { Save } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

export default function RegisterSupplier() {
  const { saveSupplier } = SupplierService();

  const { getAddressByCepInBrazil } = AddressService();

  const [errors, setErrors] = useState<Errors[]>([]);

  const [supplier, setSupplier] = useState<Supplier>(supplierInitialState);

  const [address, setAddress] = useState<Address>(addressInitialState);

  const setSupplierProps = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setSupplier({ ...supplier, [key]: e.target.value });
    setErrors([]);
  };

  const setAddressProps = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [key]: e.target.value });
    if (address.cep.length < 9 || key) {
      setErrors([]);
    }
  };

  useEffect(() => {
    getAddressByCepInBrazil(address, setAddress, errors, setErrors);
  }, [address.cep]);

  const submit = async () => {
    try {
      await saveSupplier({ ...supplier, address: address });
      successMessage("Fornecedor cadastrado com sucesso!");
      setSupplier(supplierInitialState);
      setAddress(addressInitialState);
      setErrors([]);
    } catch (erro: any) {
      errorMessage("Erro no preenchimento dos campos.");
      saveErrors(erro, errors, setErrors);
    }
  };

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Save size="6vh" strokeWidth={3} /> Cadastro de Fornecedor
      </h1>
      <Card title="Dados do Fornecedor">
        <FormGroup label="Nome: *" htmlFor="nome">
          <input
            value={supplier.name}
            onChange={(e) => setSupplierProps("nome", e)}
            id="nome"
            type="text"
          />
          {<DisplayError errors={errors} inputName="nome" />}
        </FormGroup>
        <FormGroup label="CNPJ: *" htmlFor="cnpj">
          <CnpjInput
            value={supplier.cnpj}
            onChange={(e) => setSupplierProps("cnpj", e)}
          />
          {<DisplayError errors={errors} inputName="cnpj" />}
        </FormGroup>
        <FormGroup label="Celular: *" htmlFor="telefone">
          <PhoneInput
            value={supplier.phone}
            onChange={(e) => setSupplierProps("telefone", e)}
          />
          {<DisplayError errors={errors} inputName="telefone" />}
        </FormGroup>
      </Card>
      <Card title="Endereço do Fornecedor">
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
          Cadastrar Fornecedor
        </button>
      </div>
    </div>
  );
}
