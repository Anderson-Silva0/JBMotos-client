"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/ExibeErro";
import { FormGroup } from "@/components/Form-group";
import { CepInput, CnpjInput, PhoneInput } from "@/components/Input";
import { Address, addressInitialState } from "@/models/endereco";
import { Errors, saveErrors } from "@/models/erros";
import { Supplier, supplierInitialState } from "@/models/fornecedor";
import { errorMessage, successMessage } from "@/models/toast";
import { AddressService } from "@/services/enderecoService";
import { SupplierService } from "@/services/fornecedorService";
import { Save } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

export default function CadastroFornecedor() {
  const { saveSupplier: salvarFornecedor } = SupplierService();

  const { getAddressByCepInBrazil: obterEnderecoPorCepTodoBrasil } = AddressService();

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
    if (endereco.cep.length < 9 || key) {
      setErros([]);
    }
  };

  useEffect(() => {
    obterEnderecoPorCepTodoBrasil(endereco, setEndereco, erros, setErros);
  }, [endereco.cep]);

  const submit = async () => {
    try {
      await salvarFornecedor({ ...fornecedor, address: endereco });
      successMessage("Fornecedor cadastrado com sucesso!");
      setFornecedor(supplierInitialState);
      setEndereco(addressInitialState);
      setErros([]);
    } catch (erro: any) {
      errorMessage("Erro no preenchimento dos campos.");
      saveErrors(erro, erros, setErros);
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
            value={fornecedor.name}
            onChange={(e) => setPropsFornecedor("nome", e)}
            id="nome"
            type="text"
          />
          {<DisplayError errors={erros} inputName="nome" />}
        </FormGroup>
        <FormGroup label="CNPJ: *" htmlFor="cnpj">
          <CnpjInput
            value={fornecedor.cnpj}
            onChange={(e) => setPropsFornecedor("cnpj", e)}
          />
          {<DisplayError errors={erros} inputName="cnpj" />}
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
          Cadastrar Fornecedor
        </button>
      </div>
    </div>
  );
}
