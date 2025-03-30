"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/ExibeErro";
import { FormGroup } from "@/components/Form-group";
import { CepInput, PhoneInput } from "@/components/Input";
import { Address, addressInitialState } from "@/models/endereco";
import { Errors, saveErrors } from "@/models/erros";
import { Supplier, supplierInitialState } from "@/models/fornecedor";
import { errorMessage, successMessage } from "@/models/toast";
import { AddressService } from "@/services/enderecoService";
import { SupplierService } from "@/services/fornecedorService";
import { Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

interface UpdateSupplierProps {
  params: {
    supplierCnpj: string;
  };
}

export default function UpdateSupplier({ params }: UpdateSupplierProps) {
  const router = useRouter();

  const { updateSupplier, findSupplierByCnpj } = SupplierService();
  const { findAddressById, getAddressByCepInBrazil } = AddressService();

  const [errors, setErrors] = useState<Errors[]>([]);

  const [supplier, setSupplier] = useState<Supplier>(supplierInitialState);

  const [address, setAddress] = useState<Address>(addressInitialState);

  const setSupplierProps = (
    key: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setSupplier({ ...supplier, [key]: e.target.value });
    setErrors([]);
  };

  const setAddressProps = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [key]: e.target.value });
    if (address.cep.length < 9 || errors) {
      setErrors([]);
    }
  };

  useEffect(() => {
    getAddressByCepInBrazil(address, setAddress, errors, setErrors);
  }, [address.cep]);

  useEffect(() => {
    const search = async () => {
      const supplierResponse = (await findSupplierByCnpj(params.supplierCnpj)).data as Supplier;
      setSupplier(supplierResponse);

      if (supplierResponse.address) {
        const addressResponse = (
          await findAddressById(supplierResponse.address.id)
        ).data as Address;
        setAddress(addressResponse);
      }
    };
    search();
  }, []);

  const submit = async () => {
    try {
      await updateSupplier(supplier.cnpj, { ...supplier, address: address });
      successMessage("Fornecedor atualizado com sucesso.");
      router.push("/fornecedor/listar");
    } catch (error: any) {
      saveErrors(error, errors, setErrors);
      errorMessage("Erro no preenchimento dos campos.");
    }
  };

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Edit3 size="6vh" strokeWidth={3} /> Atualização de Fornecedor
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
          Atualizar Fornecedor
        </button>
      </div>
    </div>
  );
}
