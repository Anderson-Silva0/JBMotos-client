"use client";

import { LockIcon, User } from "lucide-react";
import { DisplayError } from "@/components/DisplayError";
import { Eye } from "@/components/Eye";
import { ChangeEvent, FormEvent, useState } from "react";
import { Errors, saveErrors } from "@/models/errors";
import {
  Authentication,
  authenticationInitialState,
} from "@/models/authentication";
import { errorMessage, successMessage } from "@/models/toast";
import { AuthenticationService } from "@/services/authenticationService";
import Cookies from "js-cookie";
import "@/styles/login.css";
import { useRouter } from "next/navigation";
import LoadingLogo from "@/components/LoadingLogo";

export default function Login() {
  const router = useRouter();
  const { authLogin } = AuthenticationService();

  const [authentication, setAuthentication] = useState<Authentication>(authenticationInitialState);
  const [errors, setErrors] = useState<Errors[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  let inputType = "text";
  if (!isVisible) {
    inputType = "password";
  }

  const setPropsAuthentication = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setAuthentication({ ...authentication, [key]: e.target.value });
    setErrors([]);
  };

  const submit = async (event?: FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasLoginCookie = Cookies.get("login-token");

  if (hasLoginCookie) {
    return (
      <div className="div-principal login-screen">
        <LoadingLogo description="Entrando" />
      </div>
    );
  }

  return (
    <div className="div-principal login-screen">
      <div className="login-shell">
        <section className="login-brand-panel" aria-label="Apresentacao da plataforma">
          <p className="login-brand-kicker">SERVIPEX</p>
          <h1>Gestao de oficina com mais clareza no dia a dia</h1>
          <p className="login-brand-description">
            Controle vendas, servicos, estoque e equipe em uma experiencia direta e organizada.
          </p>
          <div className="login-brand-highlights">
            <article>
              <strong>Fluxo rapido</strong>
              <span>Atalhos para cadastro e consulta sem perder contexto.</span>
            </article>
            <article>
              <strong>Visao operacional</strong>
              <span>Informacoes chave para decidir com seguranca.</span>
            </article>
            <article>
              <strong>Base confiavel</strong>
              <span>Dados centralizados para equipe e atendimento.</span>
            </article>
          </div>
        </section>

        <section className="login-form-panel" aria-label="Acesso ao sistema">
          <div className="login-form-card">
            <header className="login-form-header">
              <h2>Entrar</h2>
              <p>Use seu login para acessar o painel.</p>
            </header>

            <form className="login-form" onSubmit={submit} noValidate>
              <div className="login-field">
                <label htmlFor="login">Login</label>
                <div className="login-input-wrap">
                  <User size={22} strokeWidth={2.6} />
                  <input
                    value={authentication.login}
                    onChange={(e) => setPropsAuthentication("login", e)}
                    id="login"
                    placeholder="Digite seu login"
                    type="text"
                    autoComplete="username"
                  />
                </div>
                <div className="login-msg">
                  {<DisplayError errors={errors} inputName="login" />}
                </div>
              </div>

              <div className="login-field login-password-field">
                <label htmlFor="password">Senha</label>
                <div className="login-input-wrap">
                  <LockIcon size={22} strokeWidth={2.6} />
                  <input
                    value={authentication.password}
                    onChange={(e) => setPropsAuthentication("password", e)}
                    id="password"
                    placeholder="Digite sua senha"
                    type={inputType}
                    autoComplete="current-password"
                  />
                  <div className="login-eye-toggle" aria-label="Mostrar ou ocultar senha">
                    <Eye
                      isVisible={isVisible}
                      setIsVisible={setIsVisible}
                      isLogin={true}
                    />
                  </div>
                </div>
                <div className="login-msg">
                  {<DisplayError errors={errors} inputName="password" />}
                </div>
              </div>

              <div className="divBotaoCadastrarLogin login-submit-wrapper">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
