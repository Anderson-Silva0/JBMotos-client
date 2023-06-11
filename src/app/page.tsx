import '../styles/home.css'

export default function LandingPage() {
  return (
    <div>
      <header className="header">
        <h1>JB Motos</h1>
        <p>A melhor oficina especializada em motos</p>
      </header>

      <section className="section-about">
        <div className="container">
          <h2>Sobre Nós</h2>
          <p>A JB Motos é uma oficina mecânica especializada em motos, oferecendo serviços de qualidade e confiáveis para nossos clientes. Com uma equipe altamente qualificada e experiente, estamos prontos para cuidar de todas as suas necessidades de manutenção e reparo.</p>
          <p>Se você está procurando por serviços profissionais para sua moto, venha nos visitar e experimente a excelência da JB Motos!</p>
        </div>
      </section>

      <section className="section-services">
        <div className="container">
          <h2>Nossos Serviços</h2>
          <ul>
            <li>Revisão geral</li>
            <li>Troca de óleo</li>
            <li>Ajuste de freios</li>
            <li>Manutenção de suspensão</li>
            <li>Reparo de motor</li>
            <li>Instalação de acessórios</li>
          </ul>
        </div>
      </section>

      <section className="section-contact">
        <div className="container">
          <h2>Entre em Contato</h2>
          <p>Estamos prontos para atender você! Entre em contato conosco para agendar um serviço ou tirar suas dúvidas.</p>
          <p>Telefone: (XX) XXXX-XXXX</p>
          <p>Email: contato@jbmotos.com</p>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2023 JB Motos. Todos os direitos reservados.</p>
          <p>Desenvolvido por JB Motos</p>
        </div>
      </footer>
    </div>
  )
}
