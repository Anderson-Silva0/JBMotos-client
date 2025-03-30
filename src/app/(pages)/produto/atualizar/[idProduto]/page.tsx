"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/ExibeErro";
import { FormGroup } from "@/components/Form-group";
import {
  selectionOptions,
  selectionOptionsInitialState,
} from "@/models/Selecoes";
import { Errors, saveErrors } from "@/models/erros";
import { Stock, stockInitialState } from "@/models/estoque";
import { formatToBRL } from "@/models/formatadorReal";
import { Supplier } from "@/models/fornecedor";
import { Product, productInitialState } from "@/models/produto";
import { selectStyles } from "@/models/selectStyles";
import { errorMessage, successMessage } from "@/models/toast";
import { StockService } from "@/services/estoqueService";
import { SupplierService } from "@/services/fornecedorService";
import { ProductService } from "@/services/produtoService";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";

interface AtualizarProdutoProps {
  params: {
    idProduto: number;
  };
}

export default function AtualizarProduto({ params }: AtualizarProdutoProps) {
  const router = useRouter();

  const { findStockById: buscarEstoquePorId, updateStock: atualizarEstoque } = StockService();
  const { findProductById: buscarProdutoPorId, updateProduct: atualizarProduto } = ProductService();
  const { findSupplierByCnpj: buscarFornecedorPorCnpj, findAllSupplier: buscarTodosFornecedores } =
    SupplierService();

  const [erros, setErros] = useState<Errors[]>([]);

  const [estoque, setEstoque] = useState<Stock>(stockInitialState);

  const [produto, setProduto] = useState<Product>(productInitialState);

  const [fornecedores, setFornecedores] = useState<Supplier[]>([]);

  const [opcaoSelecionadaFornecedor, setOpcaoSelecionadaFornecedor] =
    useState<selectionOptions>(selectionOptionsInitialState);

  const setPropsProdutoMoney = (
    key: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value.replace(/\D/g, "")) / 100;
    const limitedValue = Math.min(value, 100000);
    setProduto({ ...produto, [key]: limitedValue });
    setErros([]);
  };

  const setPropsProduto = (
    key: string,
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setProduto({ ...produto, [key]: e.target.value });
    setErros([]);
  };

  const setPropsEstoque = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setEstoque({ ...estoque, [key]: e.target.value });
    setErros([]);
  };

  useEffect(() => {
    const buscar = async () => {
      const produtoResponse = (await buscarProdutoPorId(params.idProduto))
        .data as Product;
      setProduto(produtoResponse);

      const fornecedorResponse = (
        await buscarFornecedorPorCnpj(produtoResponse.supplierCNPJ)
      ).data as Supplier;
      const opcaoSelecao = {
        label: fornecedorResponse.name,
        value: fornecedorResponse.cnpj,
      };
      setOpcaoSelecionadaFornecedor(opcaoSelecao);

      const estoqueResponse = (
        await buscarEstoquePorId(produtoResponse.stockId)
      ).data as Stock;
      setEstoque(estoqueResponse);
    };
    buscar();
  }, []);

  useEffect(() => {
    const buscarFornecedores = async () => {
      try {
        const todosFornecedoresResponse = await buscarTodosFornecedores();
        const todosFornecedores = todosFornecedoresResponse.data;
        const fornecedoresAtivos = todosFornecedores.filter(
          (f: Supplier) => f.supplierStatus === "ATIVO"
        );
        setFornecedores(fornecedoresAtivos);
      } catch (erro: any) {
        errorMessage(erro.response.data);
      }
    };
    buscarFornecedores();
  }, []);

  useEffect(() => {
    setProduto({
      ...produto,
      supplierCNPJ: String(opcaoSelecionadaFornecedor.value),
    });
  }, [opcaoSelecionadaFornecedor]);

  const submit = async () => {
    try {
      await atualizarProduto(produto.id, produto);
      await atualizarEstoque(estoque.id, estoque);
      successMessage("Produto e Estoque atualizados com sucesso.");
      router.push("/produto/listar");
    } catch (error: any) {
      saveErrors(error, erros, setErros);
      errorMessage("Erro no preenchimento dos campos.");
    }
  };

  return (
    <div className="div-form-container">
      <Card title="Informações do Produto">
        <FormGroup label="Nome: *" htmlFor="nome">
          <input
            value={produto.name}
            onChange={(e) => setPropsProduto("nome", e)}
            id="nome"
            type="text"
          />
          {<DisplayError errors={erros} inputName="nome" />}
        </FormGroup>
        <FormGroup label="Preço de Custo: *" htmlFor="precoCusto">
          <input
            value={formatToBRL(produto.costPrice)}
            onChange={(e) => setPropsProdutoMoney("precoCusto", e)}
            id="precoCusto"
            type="text"
          />
          {<DisplayError errors={erros} inputName="precoCusto" />}
        </FormGroup>
        <FormGroup label="Preço de Venda: *" htmlFor="precoVenda">
          <input
            value={formatToBRL(produto.salePrice)}
            onChange={(e) => setPropsProdutoMoney("precoVenda", e)}
            id="precoVenda"
            type="text"
          />
          {<DisplayError errors={erros} inputName="precoVenda" />}
        </FormGroup>
        <FormGroup label="Marca: *" htmlFor="marca">
          <input
            value={produto.brand}
            onChange={(e) => setPropsProduto("marca", e)}
            id="marca"
            type="text"
          />
          {<DisplayError errors={erros} inputName="marca" />}
        </FormGroup>
        <FormGroup label="Selecione o Fornecedor: *" htmlFor="cnpjFornecedor">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={opcaoSelecionadaFornecedor}
            onChange={(option: any) => setOpcaoSelecionadaFornecedor(option)}
            options={fornecedores.map(
              (fornecedor) =>
                ({
                  label: fornecedor.name,
                  value: fornecedor.cnpj,
                } as selectionOptions)
            )}
            instanceId="select-cnpjFornecedor"
          />
          {<DisplayError errors={erros} inputName="cnpjFornecedor" />}
        </FormGroup>
        <FormGroup label="Estoque Mínimo: *" htmlFor="estoqueMinimo">
          <input
            className="input-number-form"
            value={estoque.minStock}
            onChange={(e) => setPropsEstoque("estoqueMinimo", e)}
            id="estoqueMinimo"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<DisplayError errors={erros} inputName="estoqueMinimo" />}
        </FormGroup>
        <FormGroup label="Estoque Máximo: *" htmlFor="estoqueMaximo">
          <input
            className="input-number-form"
            value={estoque.maxStock}
            onChange={(e) => setPropsEstoque("estoqueMaximo", e)}
            id="estoqueMaximo"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<DisplayError errors={erros} inputName="estoqueMaximo" />}
        </FormGroup>
        <FormGroup label="Quantidade: *" htmlFor="quantidade">
          <input
            className="input-number-form"
            value={estoque.quantity}
            onChange={(e) => setPropsEstoque("quantidade", e)}
            id="quantidade"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<DisplayError errors={erros} inputName="quantidade" />}
        </FormGroup>
      </Card>
      <div className="divBotaoCadastrar">
        <button onClick={submit} type="submit">
          Atualizar Produto
        </button>
      </div>
    </div>
  );
}
