import { Employee } from "@/models/employee";
import { errorMessage, successMessage } from "@/models/toast";
import { EmployeeService } from "@/services/employeeService";
import { Check, Edit, UserCheck, UserX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Address, addressInitialState } from "../models/address";
import "@/styles/listCard.css";
import { ConfirmDecision } from "./ConfirmDecision";

interface EmployeeCardProps {
  employee: Employee;
  setEmployees: Dispatch<SetStateAction<Employee[]>>;
}

export default function EmployeeCard({
  employee,
  setEmployees,
}: EmployeeCardProps) {
  const router = useRouter();

  const [addressState, setAddressState] = useState<Address>(addressInitialState);

  const { findAllEmployee, toggleStatusEmployee } = EmployeeService();

  useEffect(() => {
    if (employee.address) {
      setAddressState(employee.address);
    }
  }, []);

  const handlerToggle = () => {
    if (employee.employeeStatus === "ACTIVE") {
      ConfirmDecision(
        "Desativar Funcionário",
        "Ao confirmar, o Funcionário será marcado como inativo e suas informações ainda serão mantidas no sistema, mas ele não poderá realizar serviços ou vendas até que seja reativado. Deseja realmente desativar o Funcionário?",
        () => {
          toggleStatus();
        }
      );
    } else if (employee.employeeStatus === "INACTIVE") {
      ConfirmDecision(
        "Ativar Funcionário",
        "Ao confirmar, o Funcionário será marcado como ativo e poderá realizar serviços e vendas normalmente. Deseja realmente ativar o Funcionário?",
        () => {
          toggleStatus();
        }
      );
    }
  };

  const toggleStatus = async () => {
    try {
      const statusResponse = await toggleStatusEmployee(employee.cpf);
      if (statusResponse.data === "ACTIVE") {
        successMessage("Funcionário Ativado com sucesso.");
      } else if (statusResponse.data === "INACTIVE") {
        successMessage("Funcionário Desativado com sucesso.");
      }
    } catch (error) {
      errorMessage("Erro ao tentar definir o Status do Funcionário.");
    }
    await updateListing();
  };

  const updateListing = async () => {
    try {
      const allEmployeesResponse = await findAllEmployee();
      setEmployees(allEmployeesResponse.data);
    } catch (error) {
      errorMessage("Erro ao tentar buscar todos Funcionários.");
    }
  };

  const update = () => {
    router.push(`/funcionario/atualizar/${employee.cpf}`);
  };

  return (
    <div className="cardListagem-container">
      <div className="info-principal">
        <div className="items">
          <span id="info-title">Funcionário</span>
          <div className="div-dados">Nome</div>
          <div className="div-resultado">{employee.name}</div>
          <div className="div-dados">CPF</div>
          <div className="div-resultado">{employee.cpf}</div>
          <div className="div-dados">Telefone</div>
          <div className="div-resultado">{employee.phone}</div>

          <div className="div-dados">Status do Funcionário</div>
          {employee.employeeStatus === "ACTIVE" ? (
            <div style={{ color: "green" }} className="div-resultado">
              ATIVO
              <Check strokeWidth={3} />
            </div>
          ) : (
            employee.employeeStatus === "INACTIVE" && (
              <div style={{ color: "red" }} className="div-resultado">
                INATIVO
                <X strokeWidth={3} />
              </div>
            )
          )}

          <div className="div-dados">Data e Hora de Cadastro</div>
          <div className="div-resultado">{employee.createdAt}</div>
        </div>
        <div className="items">
          <span id="info-title">Endereço</span>
          <div className="div-dados">Logradouro</div>
          <div className="div-resultado">{addressState.road}</div>
          <div className="div-dados">CEP</div>
          <div className="div-resultado">{addressState.cep}</div>
          <div className="div-dados">Número</div>
          <div className="div-resultado">{addressState.number}</div>
          <div className="div-dados">Bairro</div>
          <div className="div-resultado">{addressState.neighborhood}</div>
          <div className="div-dados">Cidade</div>
          <div className="div-resultado">{addressState.city}</div>
        </div>
      </div>
      <div className="icones-container">
        <div onClick={update} title="Editar">
          <Edit className="icones-atualizacao-e-delecao" />
        </div>
        {employee.employeeStatus === "ACTIVE" ? (
          <div onClick={handlerToggle} title="Desativar">
            <UserX className="icones-atualizacao-e-delecao" />
          </div>
        ) : (
          employee.employeeStatus === "INACTIVE" && (
            <div onClick={handlerToggle} title="Ativar">
              <UserCheck className="icones-atualizacao-e-delecao" />
            </div>
          )
        )}
      </div>
    </div>
  );
}
