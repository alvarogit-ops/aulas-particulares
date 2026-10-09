import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap'

export function Aulas() {
  const [reservas, setReservas] = useState([])

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('reservas') || '[]')
    setReservas(dados)
  }, [])

  function cancelar(id) {
    const novas = reservas.filter(reserva => reserva.codigo !== id)
    setReservas(novas)
    localStorage.setItem('reservas', JSON.stringify(novas))
  }

  return (
    <Row className="g-4">
      <Col md={12}>
        <h2 className="mb-4">Minhas aulas</h2>
      </Col>

      {!reservas.length ? (
        <Col md={12}>
          <Alert variant="info">Você ainda não tem reservas. <a href="/agendar">Agendar uma aula</a>.</Alert>
        </Col>
      ) : (
        reservas.map(reserva => (
          <Col md={6} key={reserva.codigo}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">{reserva.professor}</h5>
                    <div className="text-secondary">{reserva.materia}</div>
                  </div>
                  <Badge bg="success">{reserva.status}</Badge>
                </div>

                <ListGroup variant="flush">
                  <ListGroup.Item className="px-0">
                    <strong>Data:</strong> {reserva.data}
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0">
                    <strong>Horário:</strong> {reserva.horario}
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0">
                    <strong>Modalidade:</strong> {reserva.modalidade}
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0">
                    <strong>Valor:</strong> R$ {Number(reserva.valor || 0).toFixed(2)}
                  </ListGroup.Item>
                </ListGroup>

                <div className="d-flex justify-content-between mt-3">
                  <small className="text-muted">Código: {reserva.codigo}</small>
                  <Button variant="outline-danger" size="sm" onClick={() => cancelar(reserva.codigo)}>
                    Cancelar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))
      )}
    </Row>
  )
}
