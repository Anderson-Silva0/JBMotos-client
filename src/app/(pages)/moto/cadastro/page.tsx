"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/DisplayError";
import { FormGroup } from "@/components/FormGroup";
import { PlateInput } from "@/components/Input";
import {
  selectionOptions,
  selectionOptionsInitialState,
} from "@/models/selectionOptions";
import { Customer } from "@/models/customer";
import { Errors, saveErrors } from "@/models/errors";
import { Motorcycle, motorcycleInitialState } from "@/models/motorcycle";
import { selectStyles } from "@/models/selectStyles";
import { errorMessage, successMessage } from "@/models/toast";
import { CustomerService } from "@/services/customerService";
import { MotorcycleService } from "@/services/motorcycleService";
import { Save } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";

export default function RegisterMotorcycle() {
  const { saveMotorcycle } = MotorcycleService();
  const { findAllCustomer } = CustomerService();

  const [selectedCustomerOption, setSelectedCustomerOption] = useState<selectionOptions>(selectionOptionsInitialState);

  const [errors, setErrors] = useState<Errors[]>([]);

  const [motorcycle, setMotorcycle] = useState<Motorcycle>(motorcycleInitialState);

  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const allCustomersResponse = await findAllCustomer();
        const allCustomers = allCustomersResponse.data;
        const activeCustomers = allCustomers.filter((c: Customer) =>
          c.customerStatus === "ACTIVE"
        );
        setCustomers(activeCustomers);
      } catch (erro: any) {
        errorMessage(erro.response.data);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    setMotorcycle({
      ...motorcycle,
      customer: {cpf: String(selectedCustomerOption?.value)} as Customer,
    });
    setErrors([]);
  }, [selectedCustomerOption]);

  const setMotorcycleProps = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setMotorcycle({ ...motorcycle, [key]: e.target.value });
    setErrors([]);
  };

  const submit = async () => {
    try {
      await saveMotorcycle(motorcycle);
      successMessage("Moto cadastrada com sucesso!");
      setMotorcycle(motorcycleInitialState);
      setSelectedCustomerOption(selectionOptionsInitialState);
    } catch (error: any) {
      errorMessage("Erro no preenchimento dos campos.");
      saveErrors(error, errors, setErrors);
    }
  };

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Save size="6vh" strokeWidth={3} /> Cadastro de Moto
      </h1>
      <Card title="Dados da Moto">
        <FormGroup label="Placa: *" htmlFor="plate">
          <PlateInput
            value={motorcycle.plate}
            onChange={(e) => setMotorcycleProps("plate", e)}
            id="plate"
            type="text"
          />
          {<DisplayError errors={errors} inputName="plate" />}
        </FormGroup>
        <FormGroup label="Marca: *" htmlFor="brand">
          <input
            value={motorcycle.brand}
            onChange={(e) => setMotorcycleProps("brand", e)}
            id="brand"
            type="text"
          />
          {<DisplayError errors={errors} inputName="brand" />}
        </FormGroup>
        <FormGroup label="Modelo: *" htmlFor="model">
          <input
            value={motorcycle.model}
            onChange={(e) => setMotorcycleProps("model", e)}
            id="model"
            type="text"
          />
          {<DisplayError errors={errors} inputName="model" />}
        </FormGroup>
        <FormGroup label="Ano: *" htmlFor="year">
          <input
            className="input-number-form"
            value={motorcycle.year}
            onChange={(e) => setMotorcycleProps("year", e)}
            id="year"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<DisplayError errors={errors} inputName="year" />}
        </FormGroup>
        <FormGroup label="Selecione o Cliente: *" htmlFor="cpf">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={selectedCustomerOption}
            onChange={(option: any) => setSelectedCustomerOption(option)}
            options={
              customers.map((customer) => {
                const namesList = customer.name.split(" ");
                if (namesList && namesList.length > 0) {
                  const firstName = namesList[0];
                  return { label: `${firstName} • ${customer.cpf}`, value: customer.cpf } as selectionOptions;
                }
              })
            }
            instanceId="select-customerCpf"
            id="cpf"
          />
          {<DisplayError errors={errors} inputName="cpf" />}
        </FormGroup>
      </Card>
      <div className="divBotaoCadastrar">
        <button onClick={submit} type="submit">
          Cadastrar Moto
        </button>
      </div>
    </div>
  );
}
