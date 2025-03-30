import { Dispatch, SetStateAction } from "react";

export interface Errors {
  inputName: string;
  errorMessage: string;
}

export const saveErrors = (
  error: any,
  errorArray: Errors[],
  setErrorArray: Dispatch<SetStateAction<Errors[]>>
) => {
  if (error.response && error.response.data) {
    const errorObject = error.response.data;
    const keys = Object.keys(errorObject);
    if (!errorObject.error && errorArray.length <= 8) {
      setErrorArray((oldErrors) => {
        const newErrors = keys.map((k) => ({
          inputName: k,
          errorMessage: errorObject[k],
        }));
        return [...oldErrors, ...newErrors];
      });
    }
    const ignoredError = "Endereço não encontrado para o Id informado.";
    if (errorObject.error && errorObject.error !== ignoredError) {
      setErrorArray((oldErrors) => [
        ...oldErrors,
        { inputName: "error", errorMessage: errorObject.error },
      ]);
    }
  }
};
