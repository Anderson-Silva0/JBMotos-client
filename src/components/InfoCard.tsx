import { formatToPercentage } from "@/models/currencyFormatters";
import { CardPayment } from "@/models/cardPayment";
import "@/styles/card.css";
import "@/styles/cardListagem.css";

interface InfoCardProps {
  cardPayment: CardPayment;
}

export default function InfoCard({ cardPayment: cardPayment }: InfoCardProps) {
  return (
    <div className="container-info-card">
      <div className="div-dados">Parcelas</div>
      <div className="div-resultado">{cardPayment.installment}</div>

      <div className="div-dados">Bandeira</div>
      <div className="div-resultado">{cardPayment.flag}</div>

      <div className="div-dados">Taxa de Juros (Ton)</div>
      <div className="div-resultado">
        {formatToPercentage(Number(cardPayment.totalFees))}
      </div>
    </div>
  );
}
