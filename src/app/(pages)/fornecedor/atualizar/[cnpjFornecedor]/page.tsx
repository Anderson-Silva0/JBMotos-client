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

interface AtualizarFornecedorProps {
  params: {
    cnpjFornecedor: string;
  };
}

export default function AtualizarFornecedor({
  params,
}: AtualizarFornecedorProps) {
  const router = useRouter();

  const { updateSupplier: atualizarFornecedor, findSupplierByCnpj: buscarFornecedorPorCnpj } = SupplierService();
  const { findAddressById: buscarEnderecoPorId, getAddressByCepInBrazil: obterEnderecoPorCepTodoBrasil } =
    AddressService();

  const [erros, setErros] = useState<Errors[]>([]);

  const [fornecedor, setFornecedor] = useState<Supplier>(
    supplierInitialState
  );

  const [endereco, setEndereco] = useState<Address>(addressInitialState);

  const setPropsFornecedor = (
    key: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFornecedor({ ...fornecedor, [key]: e.target.value });
    setErros([]);
  };

  const setPropsEndereco = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setEndereco({ ...endereco, [key]: e.target.value });
    if (endereco.cep.length < 9 || erros) {
      setErros([]);
    }
  };

  useEffect(() => {
    obterEnderecoPorCepTodoBrasil(endereco, setEndereco, erros, setErros);
  }, [endereco.cep]);

  useEffect(() => {
    const buscar = async () => {
      const fornecedorResponse = (
        await buscarFornecedorPorCnpj(params.cnpjFornecedor)
      ).data as Supplier;
      setFornecedor(fornecedorResponse);

      if (fornecedorResponse.address) {
        const enderecoResponse = (
          await buscarEnderecoPorId(fornecedorResponse.address.id)
        ).data as Address;
        setEndereco(enderecoResponse);
      }
    };
    buscar();
  }, []);

  const submit = async () => {
    try {
      await atualizarFornecedor(fornecedor.cnpj, { ...fornecedor, address: endereco });
      successMessage("Fornecedor atualizado com sucesso.");
      router.push("/fornecedor/listar");
    } catch (error: any) {
      saveErrors(error, erros, setErros);
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
            value={fornecedor.name}
            onChange={(e) => setPropsFornecedor("nome", e)}
            id="nome"
            type="text"
          />
          {<DisplayError errors={erros} inputName="nome" />}
        </FormGroup>
        <FormGroup label="Celular: *" htmlFor="telefone">
          <PhoneInput
            value={fornecedor.phone}
            onChange={(e) => setPropsFornecedor("telefone", e)}
          />
          {<DisplayError errors={erros} inputName="telefone" />}
        </FormGroup>
      </Card>
      <Card title="Endereço do Fornecedor">
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
          Atualizar Fornecedor
        </button>
      </div>
    </div>
  );
}
