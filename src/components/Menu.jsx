import { Container, Image, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Foto } from './Foto'

export function Menu() {
  const { usuario, pode, inicio } = useAuth()
  const organizacao = usuario.organizacao

  return (
    <Navbar expand="lg" className="main-navbar sticky-top">
      <Container>
        <Navbar.Brand as={Link} to={inicio} className="fw-bold d-flex align-items-center gap-2">
          {organizacao.logo
            ? <Image src={organizacao.logo} height={30} className="me-2 rounded-circle border border-2 border-light shadow-sm" />
            : <i className="bi bi-mortarboard me-2 fs-4 text-primary"></i>}
          <span>{organizacao.nome}</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu" />
        <Navbar.Collapse id="menu">
          {pode('api.change_organizacao') ? (
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/admin/agenda">Agenda</Nav.Link>
              <Nav.Link as={NavLink} to="/admin/confirmar">A confirmar</Nav.Link>
              <NavDropdown title="Cadastros" id="menu-cadastros">
                <NavDropdown.Item as={NavLink} to="/admin/negocio">Negócio</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/admin/professores">Professores</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/admin/servicos">Disciplinas</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={NavLink} to="/admin/avaliacoes">Avaliações</Nav.Link>
            </Nav>
          ) : (
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/inicio">Início</Nav.Link>
              {pode('api.add_agendamento') && (
                <Nav.Link as={NavLink} to="/agendar">Agendar</Nav.Link>
              )}
              <Nav.Link as={NavLink} to="/aulas">Minhas aulas</Nav.Link>
              <Nav.Link as={NavLink} to="/professores">Professores e salas</Nav.Link>
            </Nav>
          )}
          <Nav>
            <Nav.Link as={NavLink} to="/perfil" className="d-flex align-items-center gap-2 rounded-pill px-3">
              <Foto src={usuario.foto} tamanho={24} /> <span>{usuario.nome}</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
