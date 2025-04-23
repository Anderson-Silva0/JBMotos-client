"use client";

import SupplierCard from "@/components/SupplierCard";
import { CnpjInput, PhoneInput } from "@/components/Input";
import LoadingLogo from "@/components/LoadingLogo";
import imgFornecedor from "@/images/supplier.png";
import { parseDate } from "@/models/stringToDate";
import { Supplier } from "@/models/supplier";
import { errorMessage } from "@/models/toast";
import { SupplierService } from "@/services/supplierService";
import { Search } from "lucide-react";
import Image from "next/image";
import "@/styles/card.css";
import { useEffect, useState } from "react";

export default function ListSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [hasInitialData, setHasInitialData] = useState<boolean>(false);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [searchInputValue, setSearchInputValue] = useState<string>("");

  const [selectedField, setSelectedField] = useState<string>("");

  const { filterSupplier } = SupplierService();

  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const checkboxSelectionToggle = (value: string) => {
    setSelectedValue(value === selectedValue ? null : value);
  };

  useEffect(() => {
    if (selectedValue === "antigo") {
      const sortedRecentSuppliers = [...suppliers].sort(
        (a: Supplier, b: Supplier) =>
          parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime()
      );
      setSuppliers(sortedRecentSuppliers);
    } else if (selectedValue === "recente") {
      const sortedRecentSuppliers = [...suppliers].sort(
        (a: Supplier, b: Supplier) =>
          parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime()
      );
      setSuppliers(sortedRecentSuppliers);
    }
  }, [selectedValue]);

  useEffect(() => {
    const findByCnpj = async () => {
      try {
        const supplierResponse = await filterSupplier(
          selectedField,
          searchInputValue
        );
        if (supplierResponse) {
          const supplierData = supplierResponse.data as Supplier[];
          setSuppliers(supplierData);
          if (supplierData && supplierData.length > 0) {
            setHasInitialData(true);
          }
        }
      } catch (error: any) {
        errorMessage("Erro ao tentar buscar Fornecedor.");
      } finally {
        setIsLoaded(true);
      }
    };
    findByCnpj();
  }, [searchInputValue, selectedField]);

  useEffect(() => {
    setSearchInputValue("");
  }, [selectedField]);

  const handleRadioClick = (campo: string) => {
    if (selectedField === campo) {
      setSelectedField("");
    }
  };

  if (!isLoaded) {
    return <LoadingLogo description="Carregando" />;
  }

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        {selectedField === "" ? (
          suppliers.length > 1 ? (
            <>
              <Image src={imgFornecedor} width={60} height={60} alt="" />{" "}
              {suppliers.length} Fornecedores cadastrados
            </>
          ) : suppliers.length === 1 ? (
            <>
              <Image src={imgFornecedor} width={60} height={60} alt="" />{" "}
              {suppliers.length} Fornecedor cadastrado
            </>
          ) : (
            "Nenhum Fornecedor cadastrado no sistema"
          )
        ) : (
          selectedField !== "" &&
          searchInputValue !== "" && (
            <>
              {suppliers.length === 1 ? (
                <strong>{suppliers.length} Fornecedor encontrado</strong>
              ) : suppliers.length > 1 ? (
                <strong>{suppliers.length} Fornecedores encontrados</strong>
              ) : (
                "Nenhum Fornecedor encontrado"
              )}
            </>
          )
        )}
      </h1>
      {(suppliers.length > 0 || hasInitialData) && (
        <>
          <div className="div-container-buscar">
            <div className="div-buscar">
              <Search size={60} strokeWidth={3} />
              {selectedField === "" ? (
                <div className="div-msg-busca">
                  <p>Selecione o filtro desejado:</p>
                </div>
              ) : selectedField === "nome" ? (
                <input
                  className="input-buscar"
                  placeholder="Digite o Nome"
                  type="search"
                  onChange={(e) => setSearchInputValue(e.target.value)}
                />
              ) : selectedField === "cnpj" ? (
                <CnpjInput
                  className="input-buscar"
                  placeholder="Digite o CNPJ"
                  type="search"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                />
              ) : selectedField === "telefone" ? (
                <PhoneInput
                  className="input-buscar"
                  placeholder="Digite o Telefone"
                  type="search"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                />
              ) : (
                selectedField === "statusFornecedor" && (
                  <>
                    <div style={{ marginRight: "2vw" }}>
                      <label
                        className="label-radio"
                        htmlFor="opcaoStatusFornecedor1"
                      >
                        ATIVO
                      </label>
                      <input
                        id="opcaoStatusFornecedor1"
                        className="input-radio"
                        type="radio"
                        name="status"
                        value={selectedField}
                        onChange={() => setSearchInputValue("ATIVO")}
                      />
                    </div>
                    <div>
                      <label
                        className="label-radio"
                        htmlFor="opcaoStatusFornecedor2"
                      >
                        INATIVO
                      </label>
                      <input
                        id="opcaoStatusFornecedor2"
                        className="input-radio"
                        type="radio"
                        name="status"
                        value={selectedField}
                        onChange={() => setSearchInputValue("INATIVO")}
                      />
                    </div>
                  </>
                )
              )}
            </div>
            <div className="div-radios">
              <div className="div-dupla-radio">
                <label className="label-radio" htmlFor="opcaoNome">
                  Nome
                </label>
                <input
                  className="input-radio"
                  type="radio"
                  name="opcao"
                  id="opcaoNome"
                  value={selectedField}
                  onChange={() => setSelectedField("nome")}
                  onClick={() => handleRadioClick("nome")}
                  checked={selectedField === "nome"}
                />
              </div>
              <div className="div-dupla-radio">
                <label className="label-radio" htmlFor="opcaoCnpj">
                  CNPJ
                </label>
                <input
                  className="input-radio"
                  type="radio"
                  name="opcao"
                  id="opcaoCnpj"
                  value={selectedField}
                  onChange={() => setSelectedField("cnpj")}
                  onClick={() => handleRadioClick("cnpj")}
                  checked={selectedField === "cnpj"}
                />
              </div>
              <div className="div-dupla-radio">
                <label className="label-radio" htmlFor="opcaoTelefone">
                  Telefone
                </label>
                <input
                  className="input-radio"
                  type="radio"
                  name="opcao"
                  id="opcaoTelefone"
                  value={selectedField}
                  onChange={() => setSelectedField("telefone")}
                  onClick={() => handleRadioClick("telefone")}
                  checked={selectedField === "telefone"}
                />
              </div>
              <div className="div-dupla-radio">
                <label className="label-radio" htmlFor="opcaoStatusFornecedor">
                  Status do Fornecedor
                </label>
                <input
                  className="input-radio"
                  type="radio"
                  name="opcao"
                  id="opcaoStatusFornecedor"
                  value={selectedField}
                  onChange={() => setSelectedField("statusFornecedor")}
                  onClick={() => handleRadioClick("statusFornecedor")}
                  checked={selectedField === "statusFornecedor"}
                />
              </div>
            </div>
          </div>
          <div className="div-dupla-check">
            <div
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                fontWeight: "bolder",
              }}
            >
              <label className="label-radio" htmlFor="recente">
                Mais recente
              </label>
              <input
                className="input-check"
                type="checkbox"
                name="filtroData"
                id="recente"
                value="recente"
                checked={selectedValue === "recente"}
                onChange={() => checkboxSelectionToggle("recente")}
              />
            </div>
            <div style={{ display: "flex", whiteSpace: "nowrap" }}>
              <label className="label-radio" htmlFor="antigo">
                Mais antigo
              </label>
              <input
                className="input-check"
                type="checkbox"
                name="filtroData"
                id="antigo"
                value="antigo"
                checked={selectedValue === "antigo"}
                onChange={() => checkboxSelectionToggle("antigo")}
              />
            </div>
          </div>

          {suppliers.map((fornecedor) => {
            return (
              <SupplierCard
                key={fornecedor.cnpj}
                supplier={fornecedor}
                setSupplier={setSuppliers}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
