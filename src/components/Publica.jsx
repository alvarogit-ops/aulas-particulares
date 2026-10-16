import { Card, Col, Container, Row } from 'react-bootstrap'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Carregando } from './Carregando'

export function Publica() {
  const { usuario, carregando, inicio } = useAuth()

  if (carregando) {
    return <Carregando />
  }
  if (usuario) {
    return <Navigate to={inicio} />
  }

  return (
    <div className="auth-shell">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="auth-card">
              <Card.Body className="p-4 p-lg-5">
                <Outlet />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}