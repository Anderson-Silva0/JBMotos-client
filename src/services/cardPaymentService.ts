import { CardPayment } from "@/models/cardPayment";
import { ApiService } from "./apiService";

export const CardPaymentService = () => {
  const url = "/card-payment";

  const saveCardPayment = (data: CardPayment) => {
    return ApiService.post(`${url}`, data);
  };

  const findAllCardPayment = () => {
    return ApiService.get(`${url}/find-all`);
  };

  const findCardPaymentById = (id: number) => {
    return ApiService.get(`${url}/find/${id}`);
  };

  const findCardPaymentBySaleId = (saleId: number) => {
    return ApiService.get(`${url}/find-by-sale-id/${saleId}`);
  };

  const updateCardPayment = (id: number, data: CardPayment) => {
    return ApiService.put(`${url}/update/${id}`, data);
  };

  const deleteCardPaymentById = (id: number) => {
    return ApiService.delete(`${url}/deletar/${id}`);
  };

  return {
    saveCardPayment,
    findAllCardPayment,
    findCardPaymentById,
    findCardPaymentBySaleId,
    updateCardPayment,
    deleteCardPaymentById,
  };
};
