import { Customer } from "@/models/customer";
import { errorMessage, successMessage } from "@/models/toast";
import { CustomerService } from "@/services/customerService";
import { Check, Edit, UserCheck, UserX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Address, addressInitialState } from "../models/address";
import "@/styles/listCard.css";
import { ConfirmDecision } from "./ConfirmDecision";

interface CustomerCardProps {
  customer: Customer;
  setCustomer: Dispatch<SetStateAction<Customer[]>>;
}

export default function CustomerCard({
  customer,
  setCustomer,
}: CustomerCardProps) {
  const router = useRouter();

  const [addressState, setAddressState] = useState<Address>(addressInitialState);

  const {
    findAllCustomer,
    toggleCustomerStatus,
  } = CustomerService();

  useEffect(() => {
    if (customer.address) {
      setAddressState(customer.address);
    }
  }, []);

  const handlerAlternar = () => {
    if (customer.customerStatus === "ACTIVE") {
      ConfirmDecision(
        "Desativar Cliente",
        "Ao confirmar, o Cliente será marcado como inativo e suas informações ainda serão mantidas no sistema, mas ele não poderá realizar compras ou serviços e suas motos não poderão ser alvo de serviços. Deseja realmente desativar o Cliente?",
        () => {
          toggleStatus();
        }
      );
    } else if (customer.customerStatus === "INACTIVE") {
      ConfirmDecision(
        "Ativar Cliente",
        "Ao confirmar, o Cliente será marcado como ativo e poderá realizar compras e serviços e suas motos poderão ser alvo de serviços normalmente. Deseja realmente ativar o Cliente?",
        () => {
          toggleStatus();
        }
      );
    }
  };

  const toggleStatus = async () => {
    try {
      const statusResponse = await toggleCustomerStatus(customer.cpf);
      if (statusResponse.data === "ACTIVE") {
        successMessage("Cliente Ativado com sucesso.");
      } else if (statusResponse.data === "INACTIVE") {
        successMessage("Cliente Desativado com sucesso.");
      }
    } catch (error) {
      errorMessage("Erro ao tentar definir o Status do Cliente.");
    }
    await updateListing();
  };

  const updateListing = async () => {
    try {
      const allCustomersResponse = await findAllCustomer();
      setCustomer(allCustomersResponse.data);
    } catch (error) {
      errorMessage("Erro ao tentar buscar todos Clientes.");
    }
  };

  const update = () => {
    router.push(`/cliente/atualizar/${customer.cpf}`);
  };

  return (
    <div className="cardListagem-container">
      <div className="info-principal">
        <div className="items">
          <span id="info-title">Cliente</span>
          <div className="div-dados">Nome</div>
          <div className="div-resultado">{customer.name}</div>
          <div className="div-dados">CPF</div>
          <div className="div-resultado">{customer.cpf}</div>
          <div className="div-dados">Email</div>
          <div className="div-resultado">{customer.email}</div>
          <div className="div-dados">Telefone</div>
          <div className="div-resultado">{customer.phone}</div>

          <div className="div-dados">Status do Cliente</div>
          {customer.customerStatus === "ACTIVE" ? (
            <div style={{ color: "green" }} className="div-resultado">
              {customer.customerStatus}
              <Check strokeWidth={3} />
            </div>
          ) : (
            customer.customerStatus === "INACTIVE" && (
              <div style={{ color: "red" }} className="div-resultado">
                {customer.customerStatus}
                <X strokeWidth={3} />
              </div>
            )
          )}

          <div className="div-dados">Data e Hora de Cadastro</div>
          <div className="div-resultado">{customer.createdAt}</div>
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
        {customer.customerStatus === "ACTIVE" ? (
          <div onClick={handlerAlternar} title="Desativar">
            <UserX className="icones-atualizacao-e-delecao" />
          </div>
        ) : (
          customer.customerStatus === "INACTIVE" && (
            <div onClick={handlerAlternar} title="Ativar">
              <UserCheck className="icones-atualizacao-e-delecao" />
            </div>
          )
        )}
      </div>
    </div>
  );
}
