export interface CardPayment {
  id?: number;
  installment: string | number;
  flag: string | number;
  totalFees: string | number;
  saleId: number;
}

export const cardPaymentInitialState: CardPayment = {
  id: 0,
  installment: "",
  flag: "",
  totalFees: 0,
  saleId: 0,
};