"use client";

import Logo from "@/images/LOGO_SERVIPEX.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "@/styles/navbar.css";
import Dropdown from "./Dropdown";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { decode } from "jsonwebtoken";
import { DecodedToken } from "@/middleware";
import { ROLE } from "@/models/authRegisterModel";

export default function NavBar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [clickedComponent, setClickedComponent] = useState<string>("");

  function loadUserRole() {
    const token = Cookies.get("login-token");
    if (token) {
      const decodedToken = decode(token) as DecodedToken;
      setUserRole(decodedToken.role);
    }
  }

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setClickedComponent("");
  }, []);

  useEffect(() => {
    loadUserRole();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      setClickedComponent("");
    }
  }, [isMenuOpen]);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      return;
    }

    document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeMenu]);

  const handleMobileMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const isActiveRoute = (route: string) => {
    if (route === "/home") {
      return pathname === "/home";
    }

    return pathname.startsWith(route);
  };

  return (
    <>
      <header className="app-header">
        <nav className="app-nav">
          <Link href="/home" className="nav-logo-link" aria-label="SERVIPEX Home" onClick={closeMenu}>
            <Image
              src={Logo}
              alt="Logo-SERVIPEX"
              priority
              sizes="(max-width: 420px) 140px, (max-width: 1140px) 180px, 210px"
              className="nav-logo"
            />
          </Link>
          <button
            type="button"
            className={`mobile-menu ${isMenuOpen ? "active" : ""}`}
            onClick={handleMobileMenu}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
          >
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </button>
          <ul className={`nav-list ${isMenuOpen ? "active" : ""}`}>
            <li>
              <Link
                href="/home"
                onClick={closeMenu}
                className={isActiveRoute("/home") ? "is-active" : ""}
              >
                Home
              </Link>
            </li>
            <li>
              <Dropdown
                title="Cliente"
                componentClicked={clickedComponent}
                setComponentClicked={setClickedComponent}
                onNavigate={closeMenu}
                isActive={isActiveRoute("/cliente")}
              >
                <Link href="/cliente/cadastro" className={pathname === "/cliente/cadastro" ? "is-active" : ""}>
                  Cadastrar
                </Link>
                <Link href="/cliente/listar" className={pathname === "/cliente/listar" ? "is-active" : ""}>
                  Listar
                </Link>
              </Dropdown>
            </li>
            {userRole === ROLE.ADMIN && (
              <li>
                <Dropdown
                  title="Funcionário"
                  componentClicked={clickedComponent}
                  setComponentClicked={setClickedComponent}
                  onNavigate={closeMenu}
                  isActive={isActiveRoute("/funcionario")}
                >
                  <Link href="/funcionario/cadastro" className={pathname === "/funcionario/cadastro" ? "is-active" : ""}>
                    Cadastrar
                  </Link>
                  <Link href="/funcionario/listar" className={pathname === "/funcionario/listar" ? "is-active" : ""}>
                    Listar
                  </Link>
                </Dropdown>
              </li>
            )}
            <li>
              <Dropdown
                title="Fornecedor"
                componentClicked={clickedComponent}
                setComponentClicked={setClickedComponent}
                onNavigate={closeMenu}
                isActive={isActiveRoute("/fornecedor")}
              >
                <Link href="/fornecedor/cadastro" className={pathname === "/fornecedor/cadastro" ? "is-active" : ""}>
                  Cadastrar
                </Link>
                <Link href="/fornecedor/listar" className={pathname === "/fornecedor/listar" ? "is-active" : ""}>
                  Listar
                </Link>
              </Dropdown>
            </li>
            <li>
              <Dropdown
                title="Produto"
                componentClicked={clickedComponent}
                setComponentClicked={setClickedComponent}
                onNavigate={closeMenu}
                isActive={isActiveRoute("/produto")}
              >
                <Link href="/produto/cadastro" className={pathname === "/produto/cadastro" ? "is-active" : ""}>
                  Cadastrar
                </Link>
                <Link href="/produto/listar" className={pathname === "/produto/listar" ? "is-active" : ""}>
                  Listar
                </Link>
              </Dropdown>
            </li>
            <li>
              <Dropdown
                title="Venda"
                componentClicked={clickedComponent}
                setComponentClicked={setClickedComponent}
                onNavigate={closeMenu}
                isActive={isActiveRoute("/venda")}
              >
                <Link href="/venda/cadastro" className={pathname === "/venda/cadastro" ? "is-active" : ""}>
                  Realizar
                </Link>
                <Link href="/venda/listar" className={pathname === "/venda/listar" ? "is-active" : ""}>
                  Listar
                </Link>
              </Dropdown>
            </li>
            <li>
              <Dropdown
                title="Serviço"
                componentClicked={clickedComponent}
                setComponentClicked={setClickedComponent}
                onNavigate={closeMenu}
                isActive={isActiveRoute("/servico")}
              >
                <Link href="/servico/cadastro" className={pathname === "/servico/cadastro" ? "is-active" : ""}>
                  Realizar
                </Link>
                <Link href="/servico/listar" className={pathname === "/servico/listar" ? "is-active" : ""}>
                  Listar
                </Link>
              </Dropdown>
            </li>
            <li>
              <Dropdown
                title="Moto"
                componentClicked={clickedComponent}
                setComponentClicked={setClickedComponent}
                onNavigate={closeMenu}
                isActive={isActiveRoute("/moto")}
              >
                <Link href="/moto/cadastro" className={pathname === "/moto/cadastro" ? "is-active" : ""}>
                  Cadastrar
                </Link>
                <Link href="/moto/listar" className={pathname === "/moto/listar" ? "is-active" : ""}>
                  Listar
                </Link>
              </Dropdown>
            </li>
            <li>
              <Link
                href="/logout"
                onClick={closeMenu}
                aria-label="Sair"
                className={isActiveRoute("/logout") ? "is-active" : ""}
              >
                <LogOut />
              </Link>
            </li>
          </ul>

          {isMenuOpen && (
            <button
              type="button"
              className="nav-overlay"
              aria-label="Fechar menu"
              onClick={closeMenu}
            />
          )}
        </nav>
      </header>
    </>
  );
}
