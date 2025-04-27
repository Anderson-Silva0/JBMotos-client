import { Customer, customerInitialState } from "@/models/customer";
import { formatToBRL } from "@/models/currencyFormatters";
import { Employee, employeeInitialState } from "@/models/employee";
import { errorMessage } from "@/models/toast";
import { SaleService } from "@/services/saleService";
import { CustomerService } from "@/services/customerService";
import { EmployeeService } from "@/services/employeeService";
import "@/styles/listCard.css";
import { Edit, PackageSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Repair } from "@/models/repair";

export default function RepairCard(repair: Repair) {
  const router = useRouter();

  const { findCustomerByCpf } = CustomerService();
  const { findEmployeeByCpf: findEmployeeByCpf } = EmployeeService();
  // const { totalSaleValue: totalSaleValue } = SaleService();

  const [customerState, setCustomerState] = useState<Customer>(customerInitialState);
  const [employeeState, setEmployeeState] = useState<Employee>(employeeInitialState);
  const [totalSaleValueState, setTotalSaleValueState] = useState<string>("");

  const viewProductButton = useRef<HTMLButtonElement>(null);
  const listingCardContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const search = async () => {
      try {
        const customerResponse = await findCustomerByCpf(
          repair.motorcycle.customerCpf
        );
        setCustomerState(customerResponse.data);

        const employeeResponse = await findEmployeeByCpf(
          repair.employeeCpf
        );
        setEmployeeState(employeeResponse.data);

        if (repair.sale) {
          // const totalSaleValueResponse = await totalSaleValue(
          //   repair.sale.id
          // );
          // setTotalSaleValueState(totalSaleValueResponse.data);
        }
      } catch (error: any) {
        errorMessage(error.response.data);
      }
    };
    search();
  }, []);

  const listProductsOfSale = () => {
    if (viewProductButton.current && listingCardContainer.current) {
      listingCardContainer.current.style.cursor = "wait";
      viewProductButton.current.style.cursor = "wait";
    }

    if (repair.sale) {
      router.push(`/venda/listar/produtos/${repair.sale.id}`);
    }
  };

  return (
    <div className="cardListagem-container-venda">
      <span id="info-title-venda">Detalhes do Serviço</span>
      {/* <div className='div-btn-edit' onClick={atualizar} title='Editar'> */}
      <div className="div-btn-edit" title="Editar">
        <Edit className="icones-atualizacao-e-delecao" />
      </div>
      <div className="container-items">
        <div className="items">
          <div className="div-dados">Nome do Cliente</div>
          <div className="div-resultado">{customerState.name}</div>
          <div className="div-dados">CPF do Cliente</div>
          <div className="div-resultado">{customerState.cpf}</div>
          <div className="div-dados">Nome do Funcionário</div>
          <div className="div-resultado">{employeeState.name}</div>
          <div className="div-dados">CPF do Funcionário</div>
          <div className="div-resultado">{employeeState.cpf}</div>
          <div className="div-dados">Data e Hora de Cadastro do Serviço</div>
          <div className="div-resultado">{repair.createdAt}</div>
        </div>
        <div className="items">
          <div className="div-dados">Motocicleta</div>
          <div className="div-resultado">
            {repair.motorcycle.brand} {repair.motorcycle.model}{" "}
            <span style={{ fontWeight: "bolder" }}>
              [ {repair.motorcycle.plate} ]
            </span>
          </div>
          <div
            className="div-dados"
            style={!repair.observation ? { display: "none" } : undefined}
          >
            Observação
          </div>
          <div className="div-resultado">{repair.observation}</div>
          <div className="div-dados">Preço de Mão de Obra</div>
          <div className="div-resultado">
            {formatToBRL(repair.laborCost)}
          </div>
          <div className="div-dados">Serviços Realizados</div>
          <div className="div-resultado">{repair.repairsPerformed}</div>
          {repair.sale && (
            <>
              <div
                className="div-dados"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>Preço da Venda</div>
                <div
                  title="Ver Produtos da Venda"
                  onClick={listProductsOfSale}
                >
                  <PackageSearch
                    width={30}
                    height={30}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
              <div className="div-resultado">
                {formatToBRL(totalSaleValueState)}
              </div>
              <div className="div-dados">Total do Serviço</div>
              <div className="div-resultado">
                {formatToBRL(totalSaleValueState + repair.laborCost)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
