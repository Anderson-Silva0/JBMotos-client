export const formatToBRL = (value: number | string): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const formatToPercentage = (value: number): string => {
  value = !value ? 0 : value;

  return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
    .replace("R$", "%");
};
