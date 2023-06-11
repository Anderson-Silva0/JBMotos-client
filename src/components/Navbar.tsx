'use client'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import '../styles/navbar.css'
import Image from 'next/image'

export function NavBar() {
    return (
        <Navbar className='navbar' expand="lg">
            <div className="image-container">
                <Image
                    src="/images/LogoJB.png"
                    alt=""
                    width={120}
                    height={115}
                    className="rounded-image"
                />
            </div>
            <Container>
                <Navbar.Brand className='nav-brand' href="#home"></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link className="link" href="/">Home</Nav.Link>

                        <NavDropdown title="Cliente" id="basic-nav-dropdown">
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/cliente/cadastro">
                                Cadastrar
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/cliente/listar" className="dropdown-item">
                                Listar Clientes
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/cliente/atualizar" className="dropdown-item">
                                Atualizar
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/cliente/deletar" className="dropdown-item">
                                Deletar
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                        </NavDropdown>

                        <NavDropdown title="Funcionário" id="basic-nav-dropdown">
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/funcionario/cadastro">
                                Cadastrar
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/funcionario/listar" className="dropdown-item">
                                Listar Funcionários
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/funcionario/atualizar" className="dropdown-item">
                                Atualizar
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/funcionario/deletar" className="dropdown-item">
                                Deletar
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                        </NavDropdown>

                        <NavDropdown title="Fornecedor" id="basic-nav-dropdown">
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/fornecedor/cadastro">
                                Cadastrar
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/fornecedor/listar" className="dropdown-item">
                                Listar Fornecedores
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/fornecedor/atualizar" className="dropdown-item">
                                Atualizar
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/fornecedor/deletar" className="dropdown-item">
                                Deletar
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                        </NavDropdown>

                        <NavDropdown title="Produto" id="basic-nav-dropdown">
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/produto/cadastro">
                                Cadastrar
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/produto/listar" className="dropdown-item">
                                Listar Produtos
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/produto/atualizar" className="dropdown-item">
                                Atualizar
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/produto/deletar" className="dropdown-item">
                                Deletar
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                        </NavDropdown>

                        <Nav.Link className="link" href="/vendas">Vendas</Nav.Link >
                        <Nav.Link className="link" href="/estoque">Estoque</Nav.Link >
                    </Nav>
                </Navbar.Collapse >
            </Container >
        </Navbar >
    );
}