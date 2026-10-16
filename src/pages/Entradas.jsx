import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export function Entrada() {
  return (
    <div className="text-center">
      <div className="hero-badge">
        <i className="bi bi-stars"></i>
        Plataforma moderna
      </div>
      <div className="mb-4">
        <i className="bi bi-mortarboard display-1 text-primary"></i>
      </div>
      <h1 className="page-title">Aulas Particulares</h1>
      <p className="text-soft mb-4">
        Plataforma para agendamento de aulas particulares. Registre-se como professor ou aluno e comece a agendar suas aulas de forma prática e eficiente.
      </p>
      <div className="d-grid gap-2 mt-4">
        <Button as={Link} to="/login" className="btn-primary">Entrar</Button>
        <Button as={Link} to="/cadastro" variant="outline-primary">Criar conta</Button>
      </div>
    </div>
  )
}