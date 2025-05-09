"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/DisplayError";
import { FormGroup } from "@/components/FormGroup";
import {
  selectionOptions,
  selectionOptionsInitialState,
} from "@/models/selectionOptions";
import { Errors, saveErrors } from "@/models/errors";
import { Stock, stockInitialState } from "@/models/stock";
import { formatToBRL } from "@/models/currencyFormatters";
import { Supplier } from "@/models/supplier";
import { Product, productInitialState } from "@/models/product";
import { selectStyles } from "@/models/selectStyles";
import { errorMessage, successMessage } from "@/models/toast";
import { StockService } from "@/services/stockService";
import { SupplierService } from "@/services/supplierService";
import { ProductService } from "@/services/productService";
import { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";

export default function RegisterProduct() {
  const { saveProduct } = ProductService();

  const { saveStock, deleteStock } = StockService();

  const { findAllSupplier } = SupplierService();

  const [errors, setErrors] = useState<Errors[]>([]);

  const [stock, setStock] = useState<Stock>(stockInitialState);

  const [product, setProduct] = useState<Product>(productInitialState);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [selectedSupplierOption, setSelectedSupplierOption] = useState<selectionOptions>(selectionOptionsInitialState);

  const setProductMoneyProps = (
    key: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value.replace(/\D/g, "")) / 100;
    const limitedValue = Math.min(value, 100000);
    setProduct({ ...product, [key]: limitedValue });
    setErrors([]);
  };

  const setProductProps = (
    key: string,
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setProduct({ ...product, [key]: e.target.value });
    setErrors([]);
  };

  const setStockProps = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setStock({ ...stock, [key]: e.target.value });
    setErrors([]);
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const allSuppliersResponse = await findAllSupplier();
        const allSuppliers = allSuppliersResponse.data;
        const activeSuppliers = allSuppliers.filter(
          (f: Supplier) => f.supplierStatus === "ACTIVE"
        );
        setSuppliers(activeSuppliers);
      } catch (erro: any) {
        errorMessage(erro.response.data);
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    setProduct({
      ...product,
      supplierCnpj: String(selectedSupplierOption?.value),
    });
    setErrors([]);
  }, [selectedSupplierOption]);

  const showProductErrors = async () => {
    if (errors.length > 0) {
      setErrors([]);
    }
    try {
      await saveProduct(product);
    } catch (error) {
      saveErrors(error, errors, setErrors);
    }
  };

  const submit = async () => {
    try {
      const stockResponse = await saveStock(stock);
      try {
        await saveProduct({ ...product, stockId: stockResponse.data.id });
        successMessage("Produto cadastrado com sucesso!");
        setProduct(productInitialState);
        setSelectedSupplierOption(selectionOptionsInitialState);
        setStock(stockInitialState);
        setErrors([]);
      } catch (erro: any) {
        errors.map(
          (e) => e.inputName === "error" && errorMessage(e.errorMessage)
        );
        await deleteStock(stockResponse.data.id);
        errorMessage("Erro no preenchimento dos campos");
        saveErrors(erro, errors, setErrors);
      }
    } catch (erro: any) {
      await showProductErrors();
      errorMessage("Erro no preenchimento dos campos.");
      saveErrors(erro, errors, setErrors);
    }
  };

  return (
    <div className="div-form-container">
      <Card title="Informações do Produto">
        <FormGroup label="Nome: *" htmlFor="name">
          <input
            value={product.name}
            onChange={(e) => setProductProps("name", e)}
            id="name"
            type="text"
          />
          {<DisplayError errors={errors} inputName="name" />}
        </FormGroup>
        <FormGroup label="Preço de Custo: *" htmlFor="costPrice">
          <input
            value={formatToBRL(product.costPrice)}
            onChange={(e) => setProductMoneyProps("costPrice", e)}
            id="costPrice"
            type="text"
          />
          {<DisplayError errors={errors} inputName="costPrice" />}
        </FormGroup>
        <FormGroup label="Preço de Venda: *" htmlFor="salePrice">
          <input
            value={formatToBRL(product.salePrice)}
            onChange={(e) => setProductMoneyProps("salePrice", e)}
            id="salePrice"
            type="text"
          />
          {<DisplayError errors={errors} inputName="salePrice" />}
        </FormGroup>
        <FormGroup label="Marca: *" htmlFor="brand">
          <input
            value={product.brand}
            onChange={(e) => setProductProps("brand", e)}
            id="brand"
            type="text"
          />
          {<DisplayError errors={errors} inputName="brand" />}
        </FormGroup>
        <FormGroup label="Selecione o Fornecedor: *" htmlFor="supplierCnpj">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={selectedSupplierOption}
            onChange={(option: any) => setSelectedSupplierOption(option)}
            options={suppliers.map(
              (fornecedor) =>
                ({
                  label: fornecedor.name,
                  value: fornecedor.cnpj,
                } as selectionOptions)
            )}
            instanceId="select-supplierCnpj"
          />
          {<DisplayError errors={errors} inputName="supplierCnpj" />}
        </FormGroup>
        <FormGroup label="Estoque Mínimo: *" htmlFor="minStock">
          <input
            className="input-number-form"
            value={stock.minStock}
            onChange={(e) => setStockProps("minStock", e)}
            id="minStock"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<DisplayError errors={errors} inputName="minStock" />}
        </FormGroup>
        <FormGroup label="Estoque Máximo: *" htmlFor="maxStock">
          <input
            className="input-number-form"
            value={stock.maxStock}
            onChange={(e) => setStockProps("maxStock", e)}
            id="maxStock"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<DisplayError errors={errors} inputName="maxStock" />}
        </FormGroup>
        <FormGroup label="Quantidade: *" htmlFor="quantity">
          <input
            className="input-number-form"
            value={stock.quantity}
            onChange={(e) => setStockProps("quantity", e)}
            id="quantity"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<DisplayError errors={errors} inputName="quantity" />}
        </FormGroup>
      </Card>
      <div className="divBotaoCadastrar">
        <button onClick={submit} type="submit">
          Cadastrar Produto
        </button>
      </div>
    </div>
  );
}
