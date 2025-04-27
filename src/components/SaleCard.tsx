import { SelectedProductRegisterProps } from "@/app/(pages)/venda/cadastro/page";
import { Customer, customerInitialState } from "@/models/customer";
import { formatToBRL } from "@/models/currencyFormatters";
import { Employee, employeeInitialState } from "@/models/employee";
import { CardPayment, cardPaymentInitialState } from "@/models/cardPayment";
import { errorMessage } from "@/models/toast";
import { Sale } from "@/models/sale";
import "@/styles/listCard.css";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PDFGenerator, ReceiptType } from "./PDFGenerator";
import InfoCard from "./InfoCard";

export default function SaleCard(sale: Sale) {
  const router = useRouter();

  const [customerState, setCustomerState] = useState<Customer>(customerInitialState);
  const [employeeState, setEmployeeState] = useState<Employee>(employeeInitialState);
  const [totalValue, setTotalValue] = useState<string>("");
  const [saleProductsState, setSaleProductsState] = useState<SelectedProductRegisterProps[]>([]);
  const [cardPayment, setCardPayment] = useState<CardPayment>(cardPaymentInitialState);

  const viewProductButton = useRef<HTMLButtonElement>(null);
  const listingCardContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const search = async () => {
      try {
        setCustomerState(sale.customer);
        setEmployeeState(sale.employee);

        if (sale.cardPayment && sale.paymentMethod === "Cartão de Crédito") {
          setCardPayment(sale.cardPayment);
        }
      } catch (error: any) {
        errorMessage(error.response.data);
      }
    };
    search();
  }, []);

  useEffect(() => {
    const search = async () => {
      if (sale.totalSaleValue) {
        setTotalValue(formatToBRL(sale.totalSaleValue));
      }

      const productsOfSale = sale.productsOfSale;
      const productsOfSaleRegisters = productsOfSale.map((saleProduct) => {
        const product = saleProduct.product;
        return {
          productId: product.id,
          productName: product.name,
          quantity: saleProduct.quantity,
          unitValue: formatToBRL(saleProduct.unitValue),
          totalValue: formatToBRL(saleProduct.totalValue),
        } as SelectedProductRegisterProps;
      });

      setSaleProductsState(productsOfSaleRegisters);
    };
    search();
  }, []);

  const listSaleProducts = () => {
    if (viewProductButton.current && listingCardContainer.current) {
      listingCardContainer.current.style.cursor = "wait";
      viewProductButton.current.style.cursor = "wait";
    }

    const currentUrl = window.location.pathname;
    router.push(`${currentUrl}/produtos/${sale.id}`);
  };

  const [showInfo, setShowInfo] = useState(false);

  const HandleOnMouseLeave = () => {
    setShowInfo(false);
  };
  const HandleOnMouseMove = () => {
    setShowInfo(true);
  };

  return (
    <div ref={listingCardContainer} className="cardListagem-container-venda">
      <span id="info-title-venda">Detalhes da Venda</span>
      <div className="container-items">
        <div className="items">
          <div className="div-dados">Nome do Cliente</div>
          <div className="div-resultado">{customerState.name}</div>
          <div className="div-dados">CPF do Cliente</div>
          <div className="div-resultado">{sale.customer.cpf}</div>
          <div className="div-dados">Nome do Funcionário</div>
          <div className="div-resultado">{employeeState.name}</div>
          <div className="div-dados">CPF do Funcionário</div>
          <div className="div-resultado">{sale.employee.cpf}</div>
        </div>
        <div className="items">
          <div className="div-dados">Data e Hora de Cadastro da Venda</div>
          <div className="div-resultado">{sale.createdAt}</div>
          <div
            className="div-dados"
            style={!sale.observation ? { display: "none" } : undefined}
          >
            Observação
          </div>
          <div className="div-resultado">{sale.observation}</div>

          <div className="div-dados">Forma de Pagamento</div>
          <div className="div-resultado">
            {sale.paymentMethod}
            {sale.paymentMethod === "Cartão de Crédito" && (
              <div id="div-infocard">
                {
                  <Info
                    className="icone-info"
                    strokeWidth={3}
                    onMouseMove={HandleOnMouseMove}
                    onMouseLeave={HandleOnMouseLeave}
                  />
                }
                {showInfo && <InfoCard cardPayment={cardPayment} />}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="botoes-container">
        <button
          ref={viewProductButton}
          id="botao-ver-produtos"
          type="button"
          onClick={listSaleProducts}
        >
          Ver Produtos
        </button>
        <PDFGenerator
          receiptType={ReceiptType.Receipt}
          customerName={customerState.name}
          customerCpf={sale.customer.cpf}
          paymentMethod={sale.paymentMethod}
          employeeName={employeeState.name}
          observation={sale.observation}
          productOfSaleRegister={saleProductsState}
          totalSaleValue={totalValue}
          saleDateTime={sale.createdAt}
        />
      </div>
    </div>
  );
}
