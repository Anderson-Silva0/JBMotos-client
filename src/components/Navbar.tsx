'use client'

import React, { useEffect, useState } from 'react'
import '../styles/navbar.css'
import Image from 'next/image'
import Logo from '@/images/LogoJB.png'
import Dropdown from './Dropdown'

export default function NavBar() {
    const [componenteClicado, setComponenteClicado] = useState<string>('')

    useEffect(() => {
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
                        alt="Logo"
                        priority
                        className="rounded-image"
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
                        <li>
                            <Dropdown titulo="Funcionário" componenteClicado={componenteClicado}
                                setComponenteClicado={setComponenteClicado}>
                                <a href="/funcionario/cadastro">Cadastrar</a>
                                <a href="/funcionario/listar">Listar</a>
                            </Dropdown>
                        </li>
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
                    </ul>
                </nav>
            </header>
            <main></main>
        </>
    )
}
