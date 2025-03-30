import { employeeInitialState, Employee } from "./funcionario";

export enum ROLE {
  SUPPORT = "SUPPORT",
  ADMIN = "ADMIN",
  OPERATOR = "OPERATOR",
}

export const roleSelectOptions = [
  { label: "Admin", value: ROLE.ADMIN },
  { label: "Operator", value: ROLE.OPERATOR },
];

export interface AuthRegisterModelEmployee {
  id: number;
  login: string;
  password: string;
  role: string;
  employee: Employee;
}

export const authRegisterModelEmployeeInitialState: AuthRegisterModelEmployee =
  {
    id: 0,
    login: "",
    password: "",
    role: ROLE.OPERATOR,
    employee: employeeInitialState,
  };
