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

interface AtualizarMotoProps {
  params: {
    idMoto: number;
  };
}

export default function AtualizarMoto({ params }: AtualizarMotoProps) {
  const router = useRouter();

  const { updateMotorcycle: atualizarMoto, findMotorcycleById: buscarMotoPorId } = MotorcycleService();

  const { findAllCustomer: buscarTodosClientes } = CustomerService();

  const [opcaoSelecionadaCliente, setOpcaoSelecionadaCliente] =
    useState<selectionOptions>(selectionOptionsInitialState);

  const [erros, setErros] = useState<Errors[]>([]);

  const [moto, setMoto] = useState<Motorcycle>(motorcycleInitialState);

  const [clientes, setClientes] = useState<Customer[]>([]);

  const setPropsMoto = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setMoto({ ...moto, [key]: e.target.value });
    setErros([]);
  };

  useEffect(() => {
    const buscar = async () => {
      const motoResponse = (await buscarMotoPorId(params.idMoto)).data as Motorcycle;
      setMoto(motoResponse);

      setOpcaoSelecionadaCliente({
        label: motoResponse.customerCpf,
        value: motoResponse.customerCpf,
      });
    };
    buscar();
  }, []);

  useEffect(() => {
    const buscarTodos = async () => {
      try {
        const todosClientesResponse = await buscarTodosClientes();
        const todosClientes = todosClientesResponse.data;
        const clientesAtivos = todosClientes.filter(
          (c: Customer) => c.customerStatus === "ATIVO"
        );
        setClientes(clientesAtivos);
      } catch (erro: any) {
        errorMessage(erro.response.data);
      }
    };
    buscarTodos();
  }, []);

  useEffect(() => {
    setMoto({
      ...moto,
      customerCpf: String(opcaoSelecionadaCliente?.value),
    });
    setErros([]);
  }, [opcaoSelecionadaCliente]);

  const atualizar = async () => {
    try {
      await atualizarMoto(params.idMoto, moto);
      successMessage("Moto atualizada com sucesso!");
      router.push("/moto/listar");
    } catch (error: any) {
      saveErrors(error, erros, setErros);
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
            value={moto.plate}
            onChange={(e) => setPropsMoto("placa", e)}
            id="placa"
            type="text"
          />
          {<DisplayError errors={erros} inputName="placa" />}
        </FormGroup>
        <FormGroup label="Marca: *" htmlFor="marca">
          <input
            value={moto.brand}
            onChange={(e) => setPropsMoto("marca", e)}
            id="marca"
            type="text"
          />
          {<DisplayError errors={erros} inputName="marca" />}
        </FormGroup>
        <FormGroup label="Modelo: *" htmlFor="modelo">
          <input
            value={moto.model}
            onChange={(e) => setPropsMoto("modelo", e)}
            id="modelo"
            type="text"
          />
          {<DisplayError errors={erros} inputName="modelo" />}
        </FormGroup>
        <FormGroup label="Ano: *" htmlFor="ano">
          <input
            className="input-number-form"
            value={moto.year}
            onChange={(e) => setPropsMoto("ano", e)}
            id="ano"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<DisplayError errors={erros} inputName="ano" />}
        </FormGroup>
        <FormGroup label="Selecione o Cliente: *" htmlFor="cpfCliente">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={opcaoSelecionadaCliente}
            onChange={(option: any) => setOpcaoSelecionadaCliente(option)}
            options={clientes.map(
              (c) => ({ label: c.cpf, value: c.cpf } as selectionOptions)
            )}
            instanceId="select-cpfCliente"
          />
          {<DisplayError errors={erros} inputName="cpfCliente" />}
        </FormGroup>
      </Card>
      <div className="divBotaoCadastrar">
        <button onClick={atualizar} type="submit">
          Atualizar Moto
        </button>
      </div>
    </div>
  );
}
