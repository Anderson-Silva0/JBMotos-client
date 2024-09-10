'use client'

import Logo from '@/images/LogoJB.png'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import '../styles/navbar.css'
import Dropdown from './Dropdown'
import { LogOut } from 'lucide-react'
import Cookies from 'js-cookie'
import { decode } from 'jsonwebtoken'
import { DecodedToken } from '@/middleware'
import { ROLE } from '@/models/authRegisterModel'

export default function NavBar() {

    const [userRole, setUserRole] = useState<string>('')

    function loadUserRole() {
        const token = Cookies.get('login-token')
        if (token) {
            const decodedToken = decode(token) as DecodedToken
            setUserRole(decodedToken.role)
        }
    }

    const [componenteClicado, setComponenteClicado] = useState<string>('')

    useEffect(() => {
        loadUserRole()
        
        const mobileMenu = document.querySelector('.mobile-menu') as HTMLElement
        const navList = document.querySelector('.nav-list') as HTMLElement
        const navLinks = document.querySelectorAll('.nav-list li')

        const animateLinks = () => {
            Array.from(navLinks).forEach((link: any, index: number) => {
                link.style.animation
                    ? (link.style.animation = '')
                    : (link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`)
            })
        }

        const handleClick = () => {
            navList.classList.toggle('active')
            mobileMenu.classList.toggle('active')
            animateLinks()
        }

        if (mobileMenu) {
            mobileMenu.addEventListener('click', handleClick)
        }

        return () => {
            if (mobileMenu) {
                mobileMenu.removeEventListener('click', handleClick)
            }
        }
    }, [])

    return (
        <>
            <header>
                <nav>
                    <Image
                        src={Logo}
                        alt="Logo-JBMotos"
                        priority
                        className="logo"
                    />
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
                            <Dropdown titulo="Cliente" componenteClicado={componenteClicado}
                                setComponenteClicado={setComponenteClicado}>
                                <a href="/cliente/cadastro">Cadastrar</a>
                                <a href="/cliente/listar">Listar</a>
                            </Dropdown>
                        </li>
                        {userRole === ROLE.ADMIN &&
                            <li>
                                <Dropdown titulo="Funcionário" componenteClicado={componenteClicado}
                                    setComponenteClicado={setComponenteClicado}>
                                    <a href="/funcionario/cadastro">Cadastrar</a>
                                    <a href="/funcionario/listar">Listar</a>
                                </Dropdown>
                            </li>
                        }
                        <li>
                            <Dropdown titulo="Fornecedor" componenteClicado={componenteClicado}
                                setComponenteClicado={setComponenteClicado}>
                                <a href="/fornecedor/cadastro">Cadastrar</a>
                                <a href="/fornecedor/listar">Listar</a>
                            </Dropdown>
                        </li>
                        <li>
                            <Dropdown titulo="Produto" componenteClicado={componenteClicado}
                                setComponenteClicado={setComponenteClicado}>
                                <a href="/produto/cadastro">Cadastrar</a>
                                <a href="/produto/listar">Listar</a>
                            </Dropdown>
                        </li>
                        <li>
                            <Dropdown titulo="Venda" componenteClicado={componenteClicado}
                                setComponenteClicado={setComponenteClicado}>
                                <a href="/venda/cadastro">Realizar</a>
                                <a href="/venda/listar">Listar</a>
                            </Dropdown>
                        </li>
                        <li>
                            <Dropdown titulo="Serviço" componenteClicado={componenteClicado}
                                setComponenteClicado={setComponenteClicado}>
                                <a href="/servico/cadastro">Realizar</a>
                                <a href="/servico/listar">Listar</a>
                            </Dropdown>
                        </li>
                        <li>
                            <Dropdown titulo="Moto" componenteClicado={componenteClicado}
                                setComponenteClicado={setComponenteClicado}>
                                <a href="/moto/cadastro">Cadastrar</a>
                                <a href="/moto/listar">Listar</a>
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
    )
}
