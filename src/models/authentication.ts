export interface Authentication {
  login: string;
  password: string;
}

export const authenticationInitialState: Authentication = {
  login: "",
  password: "",
};
