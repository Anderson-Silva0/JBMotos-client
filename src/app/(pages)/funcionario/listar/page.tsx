"use client";

import EmployeeCard from "@/components/EmployeeCard";
import { CpfInput, PhoneInput } from "@/components/Input";
import LoadingLogo from "@/components/LoadingLogo";
import imgFuncionario from "@/images/employee.png";
import { parseDate } from "@/models/stringToDate";
import { Employee } from "@/models/employee";
import { errorMessage } from "@/models/toast";
import { EmployeeService } from "@/services/employeeService";
import { Search } from "lucide-react";
import Image from "next/image";
import "@/styles/card.css";
import { useEffect, useState } from "react";

export default function ListEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [searchInputValue, setSearchInputValue] = useState<string>("");

  const [selectedField, setSelectedField] = useState<string>("");

  const { filterEmployee } = EmployeeService();

  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const checkboxSelectionToggle = (value: string) => {
    setSelectedValue(value === selectedValue ? null : value);
  };

  useEffect(() => {
    if (selectedValue === "antigo") {
      const sortedRecentEmployees = [...employees].sort(
        (a: Employee, b: Employee) =>
          parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime()
      );
      setEmployees(sortedRecentEmployees);
    } else if (selectedValue === "recente") {
      const sortedRecentEmployees = [...employees].sort(
        (a: Employee, b: Employee) =>
          parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime()
      );
      setEmployees(sortedRecentEmployees);
    }
  }, [selectedValue]);

  useEffect(() => {
    const findByCpf = async () => {
      try {
        const employeeResponse = await filterEmployee(
          selectedField,
          searchInputValue
        );
        const employeesList = employeeResponse.data as Employee[];
        const employeesFilter = employeesList.filter(
          (f) => f.cpf !== "710.606.394-08"
        );
        setEmployees(employeesFilter);
      } catch (error: any) {
        errorMessage("Erro ao tentar buscar Funcionário.");
      } finally {
        setIsLoaded(true);
      }
    };
    findByCpf();
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
          employees.length > 1 ? (
            <>
              <Image src={imgFuncionario} width={60} height={60} alt="" />{" "}
              {employees.length} Funcionários cadastrados
            </>
          ) : employees.length === 1 ? (
            <>
              <Image src={imgFuncionario} width={60} height={60} alt="" />{" "}
              {employees.length} Funcionário cadastrado
            </>
          ) : (
            "Nenhum Funcionário cadastrado no sistema"
          )
        ) : (
          selectedField !== "" &&
          searchInputValue !== "" && (
            <>
              {employees.length === 1 ? (
                <strong>{employees.length} Funcionário encontrado</strong>
              ) : employees.length > 1 ? (
                <strong>{employees.length} Funcionários encontrados</strong>
              ) : (
                "Nenhum Funcionário encontrado"
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
          ) : selectedField === "nome" ? (
            <input
              className="input-buscar"
              placeholder="Digite o Nome"
              type="search"
              onChange={(e) => setSearchInputValue(e.target.value)}
            />
          ) : selectedField === "cpf" ? (
            <CpfInput
              className="input-buscar"
              placeholder="Digite o CPF"
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
            selectedField === "statusFuncionario" && (
              <>
                <div style={{ marginRight: "2vw" }}>
                  <label
                    className="label-radio"
                    htmlFor="opcaoStatusFuncionario1"
                  >
                    ATIVO
                  </label>
                  <input
                    id="opcaoStatusFuncionario1"
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
                    htmlFor="opcaoStatusFuncionario2"
                  >
                    INATIVO
                  </label>
                  <input
                    id="opcaoStatusFuncionario2"
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
            <label className="label-radio" htmlFor="opcaoCPF">
              CPF
            </label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoCPF"
              value={selectedField}
              onChange={() => setSelectedField("cpf")}
              onClick={() => handleRadioClick("cpf")}
              checked={selectedField === "cpf"}
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
            <label className="label-radio" htmlFor="opcaoStatusFuncionario">
              Status do Funcionário
            </label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoStatusFuncionario"
              value={selectedField}
              onChange={() => setSelectedField("statusFuncionario")}
              onClick={() => handleRadioClick("statusFuncionario")}
              checked={selectedField === "statusFuncionario"}
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

      {employees.map((funcionario) => {
        return (
          <EmployeeCard
            key={funcionario.cpf}
            employee={funcionario}
            setEmployees={setEmployees}
          />
        );
      })}
    </div>
  );
}
