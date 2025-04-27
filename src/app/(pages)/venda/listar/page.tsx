"use client";

import { CpfInput } from "@/components/Input";
import LoadingLogo from "@/components/LoadingLogo";
import SaleCard from "@/components/SaleCard";
import imgSale from "@/images/vendas.png";
import { parseDate } from "@/models/stringToDate";
import { errorMessage } from "@/models/toast";
import { Sale } from "@/models/sale";
import { SaleService } from "@/services/saleService";
import { Search } from "lucide-react";
import Image from "next/image";
import "@/styles/card.css";
import { useEffect, useState } from "react";

export default function ListSales() {
  const { filterSale } = SaleService();

  const [sales, setSales] = useState<Sale[]>([]);
  const [hasInitialData, setHasInitialData] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const checkboxSelectionToggle = (value: string) => {
    setSelectedValue(value === selectedValue ? null : value);
  };

  useEffect(() => {
    if (selectedValue === "antiga") {
      const setSortedRecentSales = [...sales].sort(
        (a: Sale, b: Sale) =>
          parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime()
      );
      setSales(setSortedRecentSales);
    } else if (selectedValue === "recente") {
      const setSortedRecentSales = [...sales].sort(
        (a: Sale, b: Sale) =>
          parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime()
      );
      setSales(setSortedRecentSales);
    }
  }, [selectedValue]);

  useEffect(() => {
    const findById = async () => {
      try {
        const saleResponse = await filterSale(
          selectedField,
          searchInputValue
        );
        if (saleResponse) {
          const saleData = saleResponse.data as Sale[];
          setSales(saleData);
          if (saleData && saleData.length > 0) {
            setHasInitialData(true);
          }
        }
      } catch (error: any) {
        errorMessage("Erro ao tentar buscar Venda.");
      } finally {
        setIsLoaded(true);
      }
    };
    findById();
  }, [searchInputValue, selectedField]);

  useEffect(() => {
    setSearchInputValue("");
  }, [selectedField]);

  const handleRadioClick = (field: string) => {
    if (selectedField === field) {
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
          sales.length > 1 ? (
            <>
              <Image src={imgSale} width={60} height={60} alt="" />{" "}
              {sales.length} Vendas Realizadas
            </>
          ) : sales.length === 1 ? (
            <>
              <Image src={imgSale} width={60} height={60} alt="" />{" "}
              {sales.length} Venda Realizada
            </>
          ) : (
            "Nenhuma Venda realizada no sistema"
          )
        ) : (
          selectedField !== "" &&
          searchInputValue !== "" && (
            <>
              {sales.length === 1 ? (
                <strong>{sales.length} venda encontrada</strong>
              ) : sales.length > 1 ? (
                <strong>{sales.length} Vendas encontradas</strong>
              ) : (
                "Nenhuma Venda encontrada"
              )}
            </>
          )
        )}
      </h1>
      {(sales.length > 0 || hasInitialData) && (
        <>
          <div className="div-container-buscar">
            <div className="div-buscar">
              <Search size={60} strokeWidth={3} />
              {selectedField === "" ? (
                <div className="div-msg-busca">
                  <p>Selecione o filtro desejado:</p>
                </div>
              ) : selectedField === "customerCpf" ? (
                <CpfInput
                  className="input-buscar"
                  placeholder="Digite o CPF"
                  type="search"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                />
              ) : (
                selectedField === "employeeCpf" && (
                  <CpfInput
                    className="input-buscar"
                    placeholder="Digite o CPF"
                    type="search"
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                  />
                )
              )}
            </div>
            <div className="div-radios">
              <div className="div-dupla-radio">
                <label className="label-radio" htmlFor="opcaoNome">
                  CPF do Cliente
                </label>
                <input
                  className="input-radio"
                  type="radio"
                  name="opcao"
                  id="opcaoNome"
                  value={selectedField}
                  onChange={() => setSelectedField("customerCpf")}
                  onClick={() => handleRadioClick("customerCpf")}
                  checked={selectedField === "customerCpf"}
                />
              </div>
              <div className="div-dupla-radio">
                <label className="label-radio" htmlFor="opcaoMarca">
                  CPF do Funcionário
                </label>
                <input
                  className="input-radio"
                  type="radio"
                  name="opcao"
                  id="opcaoMarca"
                  value={selectedField}
                  onChange={() => setSelectedField("employeeCpf")}
                  onClick={() => handleRadioClick("employeeCpf")}
                  checked={selectedField === "employeeCpf"}
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
              <label className="label-radio" htmlFor="antiga">
                Mais antiga
              </label>
              <input
                className="input-check"
                type="checkbox"
                name="filtroData"
                id="antiga"
                value="antiga"
                checked={selectedValue === "antiga"}
                onChange={() => checkboxSelectionToggle("antiga")}
              />
            </div>
          </div>

          {sales.map((sale) => {
            return (
              <SaleCard
                key={sale.id}
                id={sale.id}
                cardPayment={sale.cardPayment}
                productsOfSale={sale.productsOfSale}
                customer={sale.customer}
                employee={sale.employee}
                createdAt={sale.createdAt}
                observation={sale.observation}
                paymentMethod={sale.paymentMethod}
                totalSaleValue={sale.totalSaleValue}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
