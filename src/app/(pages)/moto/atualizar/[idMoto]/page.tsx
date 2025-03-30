"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/ExibeErro";
import { FormGroup } from "@/components/Form-group";
import { PlateInput } from "@/components/Input";
import {
  selectionOptions,
  selectionOptionsInitialState,
} from "@/models/Selecoes";
import { Customer } from "@/models/cliente";
import { Errors, saveErrors } from "@/models/erros";
import { Motorcycle, motorcycleInitialState } from "@/models/moto";
import { selectStyles } from "@/models/selectStyles";
import { errorMessage, successMessage } from "@/models/toast";
import { CustomerService } from "@/services/clienteService";
import { MotorcycleService } from "@/services/motoService";
import { Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";

interface UpdateMotorcycleProps {
  params: {
    motorcycleId: number;
  };
}

export default function UpdateMotorcycle({ params }: UpdateMotorcycleProps) {
  const router = useRouter();

  const { updateMotorcycle, findMotorcycleById } = MotorcycleService();

  const { findAllCustomer } = CustomerService();

  const [selectedCustomerOption, setSelectedCustomerOption] = useState<selectionOptions>(selectionOptionsInitialState);

  const [errors, setErrors] = useState<Errors[]>([]);

  const [motorcycle, setMotorcycle] = useState<Motorcycle>(motorcycleInitialState);

  const [customers, setCustomers] = useState<Customer[]>([]);

  const setMotorcycleProps = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setMotorcycle({ ...motorcycle, [key]: e.target.value });
    setErrors([]);
  };

  useEffect(() => {
    const search = async () => {
      const motorcycleResponse = (await findMotorcycleById(params.motorcycleId)).data as Motorcycle;
      setMotorcycle(motorcycleResponse);

      setSelectedCustomerOption({
        label: motorcycleResponse.customerCpf,
        value: motorcycleResponse.customerCpf,
      });
    };
    search();
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const allCustomersResponse = await findAllCustomer();
        const allCustomers = allCustomersResponse.data;
        const activeCustomers = allCustomers.filter(
          (c: Customer) => c.customerStatus === "ATIVO"
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
      customerCpf: String(selectedCustomerOption?.value),
    });
    setErrors([]);
  }, [selectedCustomerOption]);

  const update = async () => {
    try {
      await updateMotorcycle(params.motorcycleId, motorcycle);
      successMessage("Moto atualizada com sucesso!");
      router.push("/moto/listar");
    } catch (error: any) {
      saveErrors(error, errors, setErrors);
      errorMessage("Erro no preenchimento dos campos.");
    }
  };

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Edit3 size="6vh" strokeWidth={3} /> Atualização de Moto
      </h1>
      <Card title="Dados da Moto">
        <FormGroup label="Placa: *" htmlFor="placa">
          <PlateInput
            value={motorcycle.plate}
            onChange={(e) => setMotorcycleProps("placa", e)}
            id="placa"
            type="text"
          />
          {<DisplayError errors={errors} inputName="placa" />}
        </FormGroup>
        <FormGroup label="Marca: *" htmlFor="marca">
          <input
            value={motorcycle.brand}
            onChange={(e) => setMotorcycleProps("marca", e)}
            id="marca"
            type="text"
          />
          {<DisplayError errors={errors} inputName="marca" />}
        </FormGroup>
        <FormGroup label="Modelo: *" htmlFor="modelo">
          <input
            value={motorcycle.model}
            onChange={(e) => setMotorcycleProps("modelo", e)}
            id="modelo"
            type="text"
          />
          {<DisplayError errors={errors} inputName="modelo" />}
        </FormGroup>
        <FormGroup label="Ano: *" htmlFor="ano">
          <input
            className="input-number-form"
            value={motorcycle.year}
            onChange={(e) => setMotorcycleProps("ano", e)}
            id="ano"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<DisplayError errors={errors} inputName="ano" />}
        </FormGroup>
        <FormGroup label="Selecione o Cliente: *" htmlFor="cpfCliente">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={selectedCustomerOption}
            onChange={(option: any) => setSelectedCustomerOption(option)}
            options={customers.map(
              (c) => ({ label: c.cpf, value: c.cpf } as selectionOptions)
            )}
            instanceId="select-cpfCliente"
          />
          {<DisplayError errors={errors} inputName="cpfCliente" />}
        </FormGroup>
      </Card>
      <div className="divBotaoCadastrar">
        <button onClick={update} type="submit">
          Atualizar Moto
        </button>
      </div>
    </div>
  );
}
