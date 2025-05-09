"use client";

import CustomerCard from "@/components/CustomerCard";
import { CpfInput, PhoneInput } from "@/components/Input";
import LoadingLogo from "@/components/LoadingLogo";
import imgCliente from "@/images/client.png";
import { parseDate } from "@/models/stringToDate";
import { Customer } from "@/models/customer";
import { errorMessage } from "@/models/toast";
import { CustomerService } from "@/services/customerService";
import { Search } from "lucide-react";
import Image from "next/image";
import "@/styles/card.css";
import { useEffect, useState } from "react";

export default function ListCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [hasInitialData, setHasInitialData] = useState<boolean>(false);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [searchInputValue, setSearchInputValue] = useState<string>("");

  const [selectedField, setSelectedField] = useState<string>("");

  const { filterCustomer } = CustomerService();

  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const checkboxSelectionToggle = (value: string) => {
    setSelectedValue(value === selectedValue ? null : value);
  };

  useEffect(() => {
    if (selectedValue === "antigo") {
      const sortedRecentCustomers = [...customers].sort(
        (a: Customer, b: Customer) =>
          parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime()
      );
      setCustomers(sortedRecentCustomers);
    } else if (selectedValue === "recente") {
      const sortedRecentCustomers = [...customers].sort(
        (a: Customer, b: Customer) =>
          parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime()
      );
      setCustomers(sortedRecentCustomers);
    }
  }, [selectedValue]);

  useEffect(() => {
    const findByCpf = async () => {
      try {
        const customerResponse = await filterCustomer(
          selectedField,
          searchInputValue
        );
        if (customerResponse) {
          const customerData = customerResponse.data as Customer[];
          setCustomers(customerData);
          if (customerData && customerData.length > 0) {
            setHasInitialData(true);
          }
        }
      } catch (error: any) {
        errorMessage("Erro ao tentar buscar cliente.");
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
          customers.length > 1 ? (
            <>
              <Image src={imgCliente} width={60} height={60} alt="" />{" "}
              {customers.length} Clientes cadastrados
            </>
          ) : customers.length === 1 ? (
            <>
              <Image src={imgCliente} width={60} height={60} alt="" />{" "}
              {customers.length} Cliente cadastrado
            </>
          ) : (
            "Nenhum Cliente cadastrado no sistema"
          )
        ) : (
          selectedField !== "" &&
          searchInputValue !== "" && (
            <>
              {customers.length === 1 ? (
                <strong>{customers.length} Cliente encontrado</strong>
              ) : customers.length > 1 ? (
                <strong>{customers.length} Clientes encontrados</strong>
              ) : (
                "Nenhum Cliente encontrado"
              )}
            </>
          )
        )}
      </h1>
      {(customers.length > 0 || hasInitialData) && (
        <>
          <div className="div-container-buscar">
            <div className="div-buscar">
              <Search size={60} strokeWidth={3} />
              {selectedField === "" ? (
                <div className="div-msg-busca">
                  <p>Selecione o filtro desejado:</p>
                </div>
              ) : selectedField === "name" ? (
                <input
                  className="input-buscar"
                  placeholder="Digite o Nome"
                  type="search"
                  onChange={(e) => setSearchInputValue(e.target.value)}
                />
              ) : selectedField === "email" ? (
                <input
                  className="input-buscar"
                  placeholder="Digite o Email"
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
              ) : selectedField === "phone" ? (
                <PhoneInput
                  className="input-buscar"
                  placeholder="Digite o Telefone"
                  type="search"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                />
              ) : (
                selectedField === "customerStatus" && (
                  <>
                    <div style={{ marginRight: "2vw" }}>
                      <label className="label-radio" htmlFor="opcaoStatusCliente1">
                        ATIVO
                      </label>
                      <input
                        id="opcaoStatusCliente1"
                        className="input-radio"
                        type="radio"
                        name="status"
                        value={selectedField}
                        onChange={() => setSearchInputValue("ACTIVE")}
                      />
                    </div>
                    <div>
                      <label className="label-radio" htmlFor="opcaoStatusCliente2">
                        INATIVO
                      </label>
                      <input
                        id="opcaoStatusCliente2"
                        className="input-radio"
                        type="radio"
                        name="status"
                        value={selectedField}
                        onChange={() => setSearchInputValue("INACTIVE")}
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
                  onChange={() => setSelectedField("name")}
                  onClick={() => handleRadioClick("name")}
                  checked={selectedField === "name"}
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
                <label className="label-radio" htmlFor="opcaoEmail">
                  Email
                </label>
                <input
                  className="input-radio"
                  type="radio"
                  name="opcao"
                  id="opcaoEmail"
                  value={selectedField}
                  onChange={() => setSelectedField("email")}
                  onClick={() => handleRadioClick("email")}
                  checked={selectedField === "email"}
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
                  onChange={() => setSelectedField("phone")}
                  onClick={() => handleRadioClick("phone")}
                  checked={selectedField === "phone"}
                />
              </div>
              <div className="div-dupla-radio">
                <label className="label-radio" htmlFor="opcaoStatusCliente">
                  Status do Cliente
                </label>
                <input
                  className="input-radio"
                  type="radio"
                  name="opcao"
                  id="opcaoStatusCliente"
                  value={selectedField}
                  onChange={() => setSelectedField("customerStatus")}
                  onClick={() => handleRadioClick("customerStatus")}
                  checked={selectedField === "customerStatus"}
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

          {customers.map((cliente) => {
            return (
              <CustomerCard
                key={cliente.cpf}
                customer={cliente}
                setCustomer={setCustomers}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
