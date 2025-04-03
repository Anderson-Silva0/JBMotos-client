import { Address } from "@/models/address";
import { Errors } from "@/models/errors";
import { errorMessage } from "@/models/toast";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { ApiService } from "./apiService";

export const AddressService = () => {
  const url = "/address";

  const saveAddress = (data: Address) => {
    return ApiService.post(`${url}`, data);
  };

  const findAllAddress = () => {
    return ApiService.get(`${url}/find-all`);
  };

  const findAddressById = (id: number) => {
    return ApiService.get(`${url}/find/${id}`);
  };

  const updateAddress = (id: number, dados: Address) => {
    return ApiService.put(`${url}/update/${id}`, dados);
  };

  const deleteAddress = (id: number) => {
    return ApiService.delete(`${url}/delete/${id}`);
  };

  const findAddressByCep = (cep: string) => {
    return axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  };

  const getAddressByCep = async (
    address: Address,
    setAddress: Dispatch<SetStateAction<Address>>,
    errors: Errors[],
    setErrors: Dispatch<SetStateAction<Errors[]>>
  ) => {
    if (
      (address.cep.length < 9 && address.road) ||
      address.city ||
      address.neighborhood
    ) {
      setAddress({ ...address, road: "", neighborhood: "", city: "" });
    }
    const findAddress = async () => {
      try {
        const addressResponse = await findAddressByCep(address.cep);
        if (addressResponse.data.erro) {
          setErrors([
            ...errors,
            {
              inputName: "cep",
              errorMessage: "CEP inexistente. Verifique e corrija.",
            },
          ]);
        } else if (addressResponse.data.uf === "PE") {
          setAddress({
            ...address,
            road: addressResponse.data.logradouro,
            neighborhood: addressResponse.data.bairro,
            city: addressResponse.data.localidade,
          });
        } else {
          setErrors([
            ...errors,
            {
              inputName: "cep",
              errorMessage: "Verifique o CEP, não é de Pernambuco.",
            },
          ]);
        }
      } catch (error: any) {
        errorMessage("Erro ao tentar buscar Endereço por CEP.");
      }
    };
    if (address.cep.length === 9) {
      findAddress();
    }
  };

  const getAddressByCepInBrazil = async (
    address: Address,
    setAddress: Dispatch<SetStateAction<Address>>,
    errors: Errors[],
    setErrors: Dispatch<SetStateAction<Errors[]>>
  ) => {
    if (
      (address.cep.length < 9 && address.road) ||
      address.city ||
      address.neighborhood
    ) {
      setAddress({ ...address, road: "", neighborhood: "", city: "" });
    }
    const findAddress = async () => {
      try {
        const addressResponse = await findAddressByCep(address.cep);
        if (addressResponse.data.erro) {
          setErrors([
            ...errors,
            {
              inputName: "cep",
              errorMessage: "CEP inexistente. Verifique e corrija.",
            },
          ]);
        }
        setAddress({
          ...address,
          road: addressResponse.data.logradouro,
          neighborhood: addressResponse.data.bairro,
          city: addressResponse.data.localidade,
        });
      } catch (error: any) {
        errorMessage("Erro ao tentar buscar Endereço por CEP.");
      }
    };
    if (address.cep.length === 9) {
      findAddress();
    }
  };

  return {
    saveAddress,
    findAllAddress,
    findAddressById,
    updateAddress,
    deleteAddress,
    getAddressByCep,
    getAddressByCepInBrazil,
    findAddressByCep,
  };
};
