import { Supplier } from "@/models/supplier";
import { errorMessage, successMessage } from "@/models/toast";
import { SupplierService } from "@/services/supplierService";
import { Check, Edit, UserCheck, UserX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Address, addressInitialState } from "../models/address";
import { AddressService } from "../services/addressService";
import "../styles/cardListagem.css";
import { ConfirmDecision } from "./ConfirmDecision";

interface SupplierCardProps {
  supplier: Supplier;
  setSupplier: Dispatch<SetStateAction<Supplier[]>>;
}

export default function SupplierCard({
  supplier,
  setSupplier,
}: SupplierCardProps) {
  const router = useRouter();

  const { findAddressByCep } = AddressService();
  const { findAllSupplier, toggleStatusSupplier } = SupplierService();

  const [addressState, setAddressState] = useState<Address>(addressInitialState);
  const [countryState, setCountryState] = useState<string>("");

  useEffect(() => {
    const loadAddress = async () => {
      if (supplier.address) {
        const addressResponse = await findAddressByCep(supplier.address.cep);
        setCountryState(addressResponse.data.estado);
        setAddressState(supplier.address);
      }
    };

    loadAddress();
  }, []);

  const handlerToggle = () => {
    if (supplier.supplierStatus === "ACTIVE") {
      ConfirmDecision(
        "Desativar Fornecedor",
        "Ao confirmar, o Fornecedor será marcado como inativo e seus produtos e informações ainda serão mantidos no sistema, mas ele não poderá fornecer produtos até que seja reativado. Deseja realmente desativar o Fornecedor?",
        () => {
          toggleStatus();
        }
      );
    } else if (supplier.supplierStatus === "INACTIVE") {
      ConfirmDecision(
        "Ativar Fornecedor",
        "Ao confirmar, o Fornecedor será marcado como ativo e poderá fornecer produtos normalmente. Deseja realmente ativar o Fornecedor?",
        () => {
          toggleStatus();
        }
      );
    }
  };

  const toggleStatus = async () => {
    try {
      const statusResponse = await toggleStatusSupplier(supplier.cnpj);
      if (statusResponse.data === "ACTIVE") {
        successMessage("Fornecedor Ativado com sucesso.");
      } else if (statusResponse.data === "INACTIVE") {
        successMessage("Fornecedor Desativado com sucesso.");
      }
    } catch (error) {
      errorMessage("Erro ao tentar definir o Status do Fornecedor.");
    }
    await updateListing();
  };

  const updateListing = async () => {
    try {
      const allSupplierResponse = await findAllSupplier();
      setSupplier(allSupplierResponse.data);
    } catch (error) {
      errorMessage("Erro ao tentar buscar todos Fornecedores.");
    }
  };

  const update = () => {
    router.push(`/fornecedor/atualizar/${encodeURIComponent(supplier.cnpj)}`);
  };

  return (
    <div className="cardListagem-container">
      <div className="info-principal">
        <div className="items">
          <span id="info-title">Fornecedor</span>
          <div className="div-dados">Nome</div>
          <div className="div-resultado">{supplier.name}</div>
          <div className="div-dados">CNPJ</div>
          <div className="div-resultado">{supplier.cnpj}</div>
          <div className="div-dados">Telefone</div>
          <div className="div-resultado">{supplier.phone}</div>

          <div className="div-dados">Status do Fornecedor</div>
          {supplier.supplierStatus === "ACTIVE" ? (
            <div style={{ color: "green" }} className="div-resultado">
              {supplier.supplierStatus}
              <Check strokeWidth={3} />
            </div>
          ) : (
            supplier.supplierStatus === "INACTIVE" && (
              <div style={{ color: "red" }} className="div-resultado">
                {supplier.supplierStatus}
                <X strokeWidth={3} />
              </div>
            )
          )}

          <div className="div-dados">Data e Hora de Cadastro</div>
          <div className="div-resultado">{supplier.createdAt}</div>
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
          <div className="div-dados">Estado</div>
          <div className="div-resultado">{countryState}</div>
        </div>
      </div>
      <div className="icones-container">
        <div onClick={update} title="Editar">
          <Edit className="icones-atualizacao-e-delecao" />
        </div>
        {supplier.supplierStatus === "ACTIVE" ? (
          <div onClick={handlerToggle} title="Desativar">
            <UserX className="icones-atualizacao-e-delecao" />
          </div>
        ) : (
          supplier.supplierStatus === "INACTIVE" && (
            <div onClick={handlerToggle} title="Ativar">
              <UserCheck className="icones-atualizacao-e-delecao" />
            </div>
          )
        )}
      </div>
    </div>
  );
}
