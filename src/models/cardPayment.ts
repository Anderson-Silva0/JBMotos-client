export interface CardPayment {
  id?: number;
  installment: string | number;
  flag: string | number;
  interestRate: string | number;
  saleId: number;
}

export const cardPaymentInitialState: CardPayment = {
  id: 0,
  installment: "",
  flag: "",
  interestRate: 0,
  saleId: 0,
};