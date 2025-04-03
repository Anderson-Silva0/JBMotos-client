"use client";

import { Card } from "@/components/Card";
import { LockIcon, User } from "lucide-react";
import { FormGroup } from "@/components/FormGroup";
import "@/app/globals.css";
import { DisplayError } from "@/components/DisplayError";
import { Eye } from "@/components/Eye";
import { ChangeEvent, useState } from "react";
import { Errors, saveErrors } from "@/models/errors";
import {
  Authentication,
  authenticationInitialState,
} from "@/models/authentication";
import { errorMessage, successMessage } from "@/models/toast";
import { AuthenticationService } from "@/services/authenticationService";
import Cookies from "js-cookie";
import "@/styles/card.css";
import { useRouter } from "next/navigation";
import LoadingLogo from "@/components/LoadingLogo";

export default function Login() {
  const router = useRouter();
  const { authLogin } = AuthenticationService();

  const [authentication, setAuthentication] = useState<Authentication>(
    authenticationInitialState
  );
  const [errors, setErrors] = useState<Errors[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  let inputType = "text";
  if (!isVisible) {
    inputType = "password";
  }

  const setPropsAuthentication = (
    key: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setAuthentication({ ...authentication, [key]: e.target.value });
    setErrors([]);
  };

  const submit = async () => {
    try {
      const response = await authLogin(authentication);
      const token = response.data.token;
      Cookies.set("login-token", token);

      successMessage("Login realizado com sucesso!");
      setAuthentication(authenticationInitialState);
      setErrors([]);
      router.push("/home");
    } catch (error: any) {
      saveErrors(error, errors, setErrors);
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.loginError
      ) {
        errorMessage(error.response.data.loginError);
      }
      if (error.code && error.code === "ERR_NETWORK") {
        errorMessage("Falha na comunicação com o servidor.");
      }
    }
  };

  const hasLoginCookie = Cookies.get("login-token");

  if (hasLoginCookie) {
    return (
      <div className="div-principal">
        <LoadingLogo description="Entrando" />
      </div>
    );
  }

  return (
    <div className="div-principal">
      <div className="div-form-container-login">
        <Card title="Login">
          <FormGroup label="" htmlFor="login">
            <div className="div-login-pair">
              <User size="8vh" strokeWidth={3} />
              <input
                value={authentication.login}
                onChange={(e) => setPropsAuthentication("login", e)}
                id="login"
                placeholder="Login"
                type="email"
              />
              <div className="div-msg">
                {<DisplayError errors={errors} inputName="login" />}
              </div>
            </div>
          </FormGroup>
          <FormGroup label="" htmlFor="email">
            <div className="div-login-pair">
              <LockIcon size="8vh" strokeWidth={3} />
              <input
                value={authentication.password}
                onChange={(e) => setPropsAuthentication("senha", e)}
                id="email"
                placeholder="Senha"
                type={inputType}
              />
              <div className="div-msg">
                {<DisplayError errors={errors} inputName="senha" />}
              </div>
            </div>
          </FormGroup>
          <div id="olho-id">
            <Eye
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              isLogin={true}
            />
          </div>
        </Card>
        <div className="divBotaoCadastrarLogin">
          <button onClick={submit} type="submit">
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
