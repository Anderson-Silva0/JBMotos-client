"use client";

import Logo from "@/images/LogoJB.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import "../styles/navbar.css";
import Dropdown from "./Dropdown";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { decode } from "jsonwebtoken";
import { DecodedToken } from "@/middleware";
import { ROLE } from "@/models/authRegisterModel";

export default function NavBar() {
  const [userRole, setUserRole] = useState<string>("");

  function loadUserRole() {
    const token = Cookies.get("login-token");
    if (token) {
      const decodedToken = decode(token) as DecodedToken;
      setUserRole(decodedToken.role);
    }
  }

  const [clickedComponent, setClickedComponent] = useState<string>("");

  useEffect(() => {
    loadUserRole();

    const mobileMenu = document.querySelector(".mobile-menu") as HTMLElement;
    const navList = document.querySelector(".nav-list") as HTMLElement;
    const navLinks = document.querySelectorAll(".nav-list li");

    const animateLinks = () => {
      Array.from(navLinks).forEach((link: any, index: number) => {
        link.style.animation
          ? (link.style.animation = "")
          : (link.style.animation = `navLinkFade 0.5s ease forwards ${
              index / 7 + 0.3
            }s`);
      });
    };

    const handleClick = () => {
      navList.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      animateLinks();
    };

    if (mobileMenu) {
      mobileMenu.addEventListener("click", handleClick);
    }

    return () => {
      if (mobileMenu) {
        mobileMenu.removeEventListener("click", handleClick);
      }
    };
  }, []);

  return (
    <>
      <header>
        <nav>
          <Image src={Logo} alt="Logo-JBMotos" priority className="logo" />
          <div className="mobile-menu">
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>
          <ul className="nav-list">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <Dropdown
                title="Cliente"
                componentClicked={clickedComponent}
                setComponentClicked={setClickedComponent}
              >
                <a href="/customer/register">Cadastrar</a>
                <a href="/customer/list">Listar</a>
              </Dropdown>
            </li>
            {userRole === ROLE.ADMIN && (
              <li>
                <Dropdown
                  title="Funcionário"
                  componentClicked={clickedComponent}
                  setComponentClicked={setClickedComponent}
                >
                  <a href="/employee/register">Cadastrar</a>
                  <a href="/employee/list">Listar</a>
                </Dropdown>
              </li>
            )}
            <li>
              <Dropdown
                title="Fornecedor"
                componentClicked={clickedComponent}
                setComponentClicked={setClickedComponent}
              >
                <a href="/supplier/register">Cadastrar</a>
                <a href="/supplier/list">Listar</a>
              </Dropdown>
            </li>
            <li>
              <Dropdown
                title="Produto"
                componentClicked={clickedComponent}
                setComponentClicked={setClickedComponent}
              >
                <a href="/produto/register">Cadastrar</a>
                <a href="/produto/list">Listar</a>
              </Dropdown>
            </li>
            <li>
              <Dropdown
                title="Venda"
                componentClicked={clickedComponent}
                setComponentClicked={setClickedComponent}
              >
                <a href="/venda/register">Realizar</a>
                <a href="/venda/list">Listar</a>
              </Dropdown>
            </li>
            <li>
              <Dropdown
                title="Serviço"
                componentClicked={clickedComponent}
                setComponentClicked={setClickedComponent}
              >
                <a href="/servico/register">Realizar</a>
                <a href="/servico/list">Listar</a>
              </Dropdown>
            </li>
            <li>
              <Dropdown
                title="Moto"
                componentClicked={clickedComponent}
                setComponentClicked={setClickedComponent}
              >
                <a href="/moto/register">Cadastrar</a>
                <a href="/moto/list">Listar</a>
              </Dropdown>
            </li>
            <li>
              <a href="/logout">
                <LogOut />
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
