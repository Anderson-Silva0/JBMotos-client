export const selectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "#DEE2E6",
    padding: "1.8%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    borderRadius: "15px",
    color: "#495057",
    fontWeight: "700",
    fontSize: "18px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#CED4DA",
      boxShadow: "1px 2px 3px 1px #495057",
    },
    transition: "background-color 0.2s, box-shadow 0.2s",
  }),
  option: (provided: any) => ({
    ...provided,
    backgroundColor: "#DEE2E6",
    color: "#495057",
    fontWeight: "bold",
    fontSize: "22px",
    "&:hover": {
      backgroundColor: "#ADB5BD",
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#495057",
    fontWeight: "bold",
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "15px",
    padding: "12px",
  }),
};

export const selectStylesSale = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "#DEE2E6",
    padding: "9px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    borderRadius: "15px",
    color: "#495057",
    fontSize: "1.8vw",
    fontWeight: "bold",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#CED4DA",
      boxShadow: "1px 2px 3px 1px #CED4DA",
    },
    transition: "background-color 0.2s, box-shadow 0.2s",
    border: "none",
    "@media screen and (max-width: 999px)": {
      fontSize: "2.8vw",
      padding: "6px",
      borderRadius: "10px",
      wordBreak: "break-word",
      maxHeight: "1000px",
      overflow: "auto",
      whiteSpace: "normal",
      width: "35vw",
    },
  }),
  option: (provided: any) => ({
    ...provided,
    backgroundColor: "#DEE2E6",
    color: "#495057",
    fontWeight: "700",
    "&:hover": {
      backgroundColor: "#ADB5BD",
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#495057",
    fontWeight: "bold",
    whiteSpace: "normal",
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "15px",
    padding: "12px",
    overflowX: "hidden",
  }),
};
