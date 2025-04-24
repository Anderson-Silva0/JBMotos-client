"use client";

import { Card } from "@/components/Card";
import { DisplayError } from "@/components/DisplayError";
import { FormGroup } from "@/components/FormGroup";
import { CepInput, PhoneInput } from "@/components/Input";
import { Address, addressInitialState } from "@/models/address";
import { Errors, saveErrors } from "@/models/errors";
import { Employee, employeeInitialState } from "@/models/employee";
import { errorMessage, successMessage } from "@/models/toast";
import { AddressService } from "@/services/addressService";
import { EmployeeService } from "@/services/employeeService";
import { Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

interface UpdateEmployeeProps {
  params: {
    employeeCpf: string;
  };
}

export default function UpdateEmployee({ params }: UpdateEmployeeProps) {
  const router = useRouter();

  const { updateEmployee, findEmployeeByCpf } = EmployeeService();
  const { findAddressById, getAddressByCep } = AddressService();

  const [errors, setErrors] = useState<Errors[]>([]);

  const [employee, setEmployee] = useState<Employee>(employeeInitialState);

  const [address, setAddress] = useState<Address>(addressInitialState);

  const setEmployeeProps = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [key]: e.target.value });
    setErrors([]);
  };

  const setAddressProps = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [key]: e.target.value });
    if (address.cep.length < 9 || errors) {
      setErrors([]);
    }
  };

  useEffect(() => {
    getAddressByCep(address, setAddress, errors, setErrors);
  }, [address.cep]);

  useEffect(() => {
    const search = async () => {
      const employeeResponse = (
        await findEmployeeByCpf(params.employeeCpf)
      ).data as Employee;
      setEmployee(employeeResponse);

      if (employeeResponse.address) {
        const addressResponse = (
          await findAddressById(employeeResponse.address.id)
        ).data as Address;
        setAddress(addressResponse);
      }
    };
    search();
  }, []);

  const submit = async () => {
    try {
      await updateEmployee(employee.cpf, { ...employee, address: address });
      successMessage("Funcionário atualizado com sucesso.");
      router.push("/funcionario/listar");
    } catch (error: any) {
      saveErrors(error, errors, setErrors);
      errorMessage("Erro no preenchimento dos campos.");
    }
  };

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Edit3 size="6vh" strokeWidth={3} /> Atualização de Funcionário
      </h1>
      <Card title="Dados do Funcionário">
        <FormGroup label="Nome: *" htmlFor="name">
          <input
            value={employee.name}
            onChange={(e) => setEmployeeProps("name", e)}
            id="name"
            type="text"
          />
          {<DisplayError errors={errors} inputName="name" />}
        </FormGroup>
        <FormGroup label="Celular: *" htmlFor="phone">
          <PhoneInput
            value={employee.phone}
            onChange={(e) => setEmployeeProps("phone", e)}
          />
          {<DisplayError errors={errors} inputName="phone" />}
        </FormGroup>
      </Card>
      <Card title="Endereço do Funcionário">
        <FormGroup label="CEP: *" htmlFor="cep">
          <span className="cep-message">
            Digite o CEP para preenchimento automático do endereço.
          </span>
          <CepInput
            value={address.cep}
            onChange={(e) => setAddressProps("cep", e)}
          />
          {<DisplayError errors={errors} inputName="cep" />}
        </FormGroup>
        <FormGroup label="Logradouro: *" htmlFor="road">
          <input
            value={address.road}
            onChange={(e) => setAddressProps("road", e)}
            id="road"
            type="text"
          />
          {<DisplayError errors={errors} inputName="road" />}
        </FormGroup>
        <FormGroup label="Número: *" htmlFor="number">
          <input
            className="input-number-form"
            value={address.number}
            onChange={(e) => setAddressProps("number", e)}
            id="number"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<DisplayError errors={errors} inputName="number" />}
        </FormGroup>
        <FormGroup label="Bairro: *" htmlFor="neighborhood">
          <input
            value={address.neighborhood}
            onChange={(e) => setAddressProps("neighborhood", e)}
            id="neighborhood"
            type="text"
          />
          {<DisplayError errors={errors} inputName="neighborhood" />}
        </FormGroup>
        <FormGroup label="Cidade: *" htmlFor="city">
          <input
            value={address.city}
            onChange={(e) => setAddressProps("city", e)}
            id="city"
            type="text"
          />
          {<DisplayError errors={errors} inputName="city" />}
        </FormGroup>
      </Card>
      <div className="divBotaoCadastrar">
        <button onClick={submit} type="submit">
          Atualizar Funcionário
        </button>
      </div>
    </div>
  );
}
