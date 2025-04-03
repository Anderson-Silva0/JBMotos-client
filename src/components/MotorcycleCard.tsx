import { Customer, customerInitialState } from "@/models/customer";
import { Motorcycle } from "@/models/motorcycle";
import { errorMessage, successMessage } from "@/models/toast";
import { CustomerService } from "@/services/customerService";
import { MotorcycleService } from "@/services/motorcycleService";
import { Check, CheckSquare, Edit, X, XSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "../styles/cardListagem.css";
import { ConfirmDecision } from "./ConfirmDecision";

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  setMotorcycle: Dispatch<SetStateAction<Motorcycle[]>>;
}

export default function MotorcycleCard({ motorcycle, setMotorcycle }: MotorcycleCardProps) {
  const router = useRouter();

  const [customerState, setCustomerState] = useState<Customer>(customerInitialState);

  const { findAllMotorcycle, toggleStatusMotorcycle } = MotorcycleService();
  const { findCustomerByCpf } = CustomerService();

  useEffect(() => {
    async function search() {
      try {
        const customerResponse = await findCustomerByCpf(motorcycle.customerCpf);
        setCustomerState(customerResponse.data);
      } catch (error: any) {
        errorMessage(error.response.data);
      }
    }
    search();
  }, []);

  const handlerToggle = () => {
    if (motorcycle.motorcycleStatus === "ACTIVE") {
      ConfirmDecision(
        "Desativar Moto",
        "Ao confirmar, a Moto será marcada como inativa e não poderá ser alvo de serviços. Deseja realmente desativar a Moto?",
        () => {
          toggleStatus();
        }
      );
    } else if (motorcycle.motorcycleStatus === "INACTIVE") {
      ConfirmDecision(
        "Ativar Moto",
        "Ao confirmar, a Moto será marcada como ativa e poderá ser alvo de serviços normalmente. Deseja realmente ativar a Moto?",
        () => {
          toggleStatus();
        }
      );
    }
  };

  const toggleStatus = async () => {
    try {
      const statusResponse = await toggleStatusMotorcycle(motorcycle.id);
      if (statusResponse.data === "ACTIVE") {
        successMessage("Moto Ativada com sucesso.");
      } else if (statusResponse.data === "INACTIVE") {
        successMessage("Moto Desativada com sucesso.");
      }
    } catch (error) {
      errorMessage("Erro ao tentar definir o Status da Moto.");
    }
    await updateListing();
  };

  const updateListing = async () => {
    try {
      const allMotorcycleResponse = await findAllMotorcycle();
      setMotorcycle(allMotorcycleResponse.data);
    } catch (error) {
      errorMessage("Erro ao tentar buscar todas Motos.");
    }
  };

  const atualizar = () => {
    router.push(`/moto/atualizar/${motorcycle.id}`);
  };

  return (
    <div className="cardListagem-container">
      <div className="info-principal">
        <div className="items">
          <span id="info-title">Moto</span>
          <div className="div-dados">Placa</div>
          <div className="div-resultado">{motorcycle.plate}</div>
          <div className="div-dados">Marca</div>
          <div className="div-resultado">{motorcycle.brand}</div>
          <div className="div-dados">Modelo</div>
          <div className="div-resultado">{motorcycle.model}</div>
          <div className="div-dados">Ano</div>
          <div className="div-resultado">{motorcycle.year}</div>

          <div className="div-dados">Status da Moto</div>
          {motorcycle.motorcycleStatus === "ACTIVE" ? (
            <div style={{ color: "green" }} className="div-resultado">
              {motorcycle.motorcycleStatus}
              <Check strokeWidth={3} />
            </div>
          ) : (
            motorcycle.motorcycleStatus === "INACTIVE" && (
              <div style={{ color: "red" }} className="div-resultado">
                {motorcycle.motorcycleStatus}
                <X strokeWidth={3} />
              </div>
            )
          )}

          <div className="div-dados">Data e Hora de Cadastro</div>
          <div className="div-resultado">{motorcycle.createdAt}</div>
        </div>
        <div className="items">
          <span id="info-title">Proprietário</span>
          <div className="div-dados">CPF</div>
          <div className="div-resultado">{customerState.cpf}</div>
          <div className="div-dados">Nome</div>
          <div className="div-resultado">{customerState.name}</div>
        </div>
      </div>
      <div className="icones-container">
        <div onClick={atualizar} title="Editar">
          <Edit className="icones-atualizacao-e-delecao" />
        </div>
        {motorcycle.motorcycleStatus === "ACTIVE" ? (
          <div onClick={handlerToggle} title="Desativar">
            <XSquare className="icones-atualizacao-e-delecao" />
          </div>
        ) : (
          motorcycle.motorcycleStatus === "INACTIVE" && (
            <div onClick={handlerToggle} title="Ativar">
              <CheckSquare className="icones-atualizacao-e-delecao" />
            </div>
          )
        )}
      </div>
    </div>
  );
}
