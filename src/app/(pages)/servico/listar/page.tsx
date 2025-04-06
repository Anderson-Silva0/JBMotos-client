"use client";

import { CpfInput, PlateInput } from "@/components/Input";
import LoadingLogo from "@/components/LoadingLogo";
import RepairCard from "@/components/RepairCard";
import imgSale from "@/images/vendas.png";
import { Repair } from "@/models/repair";
import { parseDate } from "@/models/stringToDate";
import { errorMessage } from "@/models/toast";
import { RepairService } from "@/services/repairService";
import { Search } from "lucide-react";
import Image from "next/image";
import "@/styles/card.css";
import { useEffect, useState } from "react";

export default function ListRepair() {
  const { filterRepair } = RepairService();

  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const checkboxSelectionToggle = (value: string) => {
    setSelectedValue(value === selectedValue ? null : value);
  };

  useEffect(() => {
    if (selectedValue === "antiga") {
      const sortedRecentSales = [...repairs].sort(
        (a: Repair, b: Repair) =>
          parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime()
      );
      setRepairs(sortedRecentSales);
    } else if (selectedValue === "recente") {
      const sortedRecentSales = [...repairs].sort(
        (a: Repair, b: Repair) =>
          parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime()
      );
      setRepairs(sortedRecentSales);
    }
  }, [selectedValue]);

  useEffect(() => {
    const findById = async () => {
      try {
        const repairResponse = await filterRepair(
          selectedField,
          searchInputValue
        );
        setRepairs(repairResponse.data);
      } catch (error: any) {
        errorMessage("Erro ao tentar buscar Serviço.");
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
          repairs.length > 1 ? (
            <>
              <Image src={imgSale} width={60} height={60} alt="" />{" "}
              {repairs.length} Serviços Realizados
            </>
          ) : repairs.length === 1 ? (
            <>
              <Image src={imgSale} width={60} height={60} alt="" />{" "}
              {repairs.length} Serviço Realizado
            </>
          ) : (
            "Nenhum Serviço realizado no sistema"
          )
        ) : (
          selectedField !== "" &&
          searchInputValue !== "" && (
            <>
              {repairs.length === 1 ? (
                <strong>{repairs.length} Serviço encontrado</strong>
              ) : repairs.length > 1 ? (
                <strong>{repairs.length} Serviços encontrados</strong>
              ) : (
                "Nenhum Serviço encontrado"
              )}
            </>
          )
        )}
      </h1>
      <div className="div-container-buscar">
        <div className="div-buscar">
          <Search size={60} strokeWidth={3} />
          {selectedField === "" ? (
            <div className="div-msg-busca">
              <p>Selecione o filtro desejado:</p>
            </div>
          ) : selectedField === "cpfCliente" ? (
            <CpfInput
              className="input-buscar"
              placeholder="Digite o CPF"
              type="search"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
            />
          ) : selectedField === "cpfFuncionario" ? (
            <CpfInput
              className="input-buscar"
              placeholder="Digite o CPF"
              type="search"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
            />
          ) : selectedField === "placa" ? (
            <PlateInput
              className="input-buscar"
              placeholder="Digite o Placa"
              type="search"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
            />
          ) : (
            selectedField === "servicosRealizados" && (
              <input
                className="input-buscar"
                placeholder="Digite algum Serviço"
                type="search"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
              />
            )
          )}
        </div>
        <div className="div-radios">
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoCpfCliente">
              CPF do Cliente
            </label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoCpfCliente"
              value={selectedField}
              onChange={() => setSelectedField("cpfCliente")}
              onClick={() => handleRadioClick("cpfCliente")}
              checked={selectedField === "cpfCliente"}
            />
          </div>
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoCpfFuncionario">
              CPF do Funcionário
            </label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoCpfFuncionario"
              value={selectedField}
              onChange={() => setSelectedField("cpfFuncionario")}
              onClick={() => handleRadioClick("cpfFuncionario")}
              checked={selectedField === "cpfFuncionario"}
            />
          </div>
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoPlaca">
              Placa da Moto
            </label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoPlaca"
              value={selectedField}
              onChange={() => setSelectedField("placa")}
              onClick={() => handleRadioClick("placa")}
              checked={selectedField === "placa"}
            />
          </div>
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoRealizados">
              Serviços Realizados
            </label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoRealizados"
              value={selectedField}
              onChange={() => setSelectedField("servicosRealizados")}
              onClick={() => handleRadioClick("servicosRealizados")}
              checked={selectedField === "servicosRealizados"}
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

      {repairs.map((servico) => {
        return (
          <RepairCard
            key={servico.id}
            id={servico.id}
            employeeCpf={servico.employeeCpf}
            createdAt={servico.createdAt}
            observation={servico.observation}
            laborCost={servico.laborCost}
            repairsPerformed={servico.repairsPerformed}
            sale={servico.sale}
            motorcycle={servico.motorcycle}
          />
        );
      })}
    </div>
  );
}
