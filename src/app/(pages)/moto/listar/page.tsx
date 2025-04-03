"use client";

import { CpfInput, PlateInput } from "@/components/Input";
import LoadingLogo from "@/components/LoadingLogo";
import MotorcycleCard from "@/components/MotorcycleCard";
import imgMotorcycle from "@/images/moto.png";
import { parseDate } from "@/models/stringToDate";
import { Motorcycle } from "@/models/motorcycle";
import { errorMessage } from "@/models/toast";
import { MotorcycleService } from "@/services/motorcycleService";
import { Search } from "lucide-react";
import Image from "next/image";
import "@/styles/card.css";
import { useEffect, useState } from "react";

export default function ListMotorcycle() {
  const [motorcycle, setMotorcycle] = useState<Motorcycle[]>([]);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [searchInputValue, setSearchInputValue] = useState<string>("");

  const [selectedField, setSelectedField] = useState<string>("");

  const { filterMotorcycle } = MotorcycleService();

  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const checkboxSelectionToggle = (value: string) => {
    setSelectedValue(value === selectedValue ? null : value);
  };

  useEffect(() => {
    if (selectedValue === "antiga") {
      const sortedRecentProducts = [...motorcycle].sort(
        (a: Motorcycle, b: Motorcycle) =>
          parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime()
      );
      setMotorcycle(sortedRecentProducts);
    } else if (selectedValue === "recente") {
      const sortedRecentProducts = [...motorcycle].sort(
        (a: Motorcycle, b: Motorcycle) =>
          parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime()
      );
      setMotorcycle(sortedRecentProducts);
    }
  }, [selectedValue]);

  useEffect(() => {
    const findById = async () => {
      try {
        const motorcycleResponse = await filterMotorcycle(
          selectedField,
          searchInputValue
        );
        setMotorcycle(motorcycleResponse.data);
      } catch (error: any) {
        errorMessage("Erro ao tentar buscar Moto.");
      } finally {
        setIsLoaded(true);
      }
    };
    findById();
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
          motorcycle.length > 1 ? (
            <>
              <Image src={imgMotorcycle} width={60} height={60} alt="" />{" "}
              {motorcycle.length} Motos cadastradas
            </>
          ) : motorcycle.length === 1 ? (
            <>
              <Image src={imgMotorcycle} width={60} height={60} alt="" />{" "}
              {motorcycle.length} Moto cadastrada
            </>
          ) : (
            "Nenhuma Moto cadastrada no sistema"
          )
        ) : (
          selectedField !== "" &&
          searchInputValue !== "" && (
            <>
              {motorcycle.length === 1 ? (
                <strong>{motorcycle.length} Moto encontrada</strong>
              ) : motorcycle.length > 1 ? (
                <strong>{motorcycle.length} Motos encontradas</strong>
              ) : (
                "Nenhuma Moto encontrada"
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
          ) : selectedField === "placa" ? (
            <PlateInput
              className="input-buscar"
              placeholder="Digite a Placa"
              type="search"
              onChange={(e) => setSearchInputValue(e.target.value)}
            />
          ) : selectedField === "marca" ? (
            <input
              className="input-buscar"
              placeholder="Digite a Marca"
              type="search"
              onChange={(e) => setSearchInputValue(e.target.value)}
            />
          ) : selectedField === "modelo" ? (
            <input
              className="input-buscar"
              placeholder="Digite o Modelo"
              type="search"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
            />
          ) : selectedField === "cpfCliente" ? (
            <CpfInput
              className="input-buscar"
              placeholder="Digite o CPF do Cliente"
              type="search"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
            />
          ) : (
            selectedField === "statusMoto" && (
              <>
                <div style={{ marginRight: "2vw" }}>
                  <label className="label-radio" htmlFor="opcaoStatusMoto1">
                    ATIVO
                  </label>
                  <input
                    id="opcaoStatusMoto1"
                    className="input-radio"
                    type="radio"
                    name="status"
                    value={selectedField}
                    onChange={() => setSearchInputValue("ATIVO")}
                  />
                </div>
                <div>
                  <label className="label-radio" htmlFor="opcaoStatusMoto2">
                    INATIVO
                  </label>
                  <input
                    id="opcaoStatusMoto2"
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
            <label className="label-radio" htmlFor="opcaoPlaca">
              Placa
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
            <label className="label-radio" htmlFor="opcaoMarca">
              Marca
            </label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoMarca"
              value={selectedField}
              onChange={() => setSelectedField("marca")}
              onClick={() => handleRadioClick("marca")}
              checked={selectedField === "marca"}
            />
          </div>
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoModelo">
              Modelo
            </label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoModelo"
              value={selectedField}
              onChange={() => setSelectedField("modelo")}
              onClick={() => handleRadioClick("modelo")}
              checked={selectedField === "modelo"}
            />
          </div>
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
            <label className="label-radio" htmlFor="opcaoStatusMoto">
              Status da Moto
            </label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoStatusMoto"
              value={selectedField}
              onChange={() => setSelectedField("statusMoto")}
              onClick={() => handleRadioClick("statusMoto")}
              checked={selectedField === "statusMoto"}
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

      {motorcycle.map((moto) => {
        return (
          <MotorcycleCard
            key={moto.id}
            motorcycle={moto}
            setMotorcycle={setMotorcycle}
          />
        );
      })}
    </div>
  );
}
