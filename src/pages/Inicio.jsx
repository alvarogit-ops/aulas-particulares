import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

const cards = [
  {
    titulo: 'Agendar aula',
    texto: 'Reserve uma nova aula com o professor ideal para você.',
    icone: 'bi-calendar2-check',
    destino: '/agendar',
    variante: 'primary'
  },
  {
    titulo: 'Minhas aulas',
    texto: 'Veja o histórico das suas aulas e próximas reservas.',
    icone: 'bi-journal-bookmark',
    destino: '/aulas',
    variante: 'success'
  },
  {
    titulo: 'Professores e matérias',
    texto: 'Explore os especialistas disponíveis e suas disciplinas.',
    icone: 'bi-people',
    destino: '/professores',
    variante: 'warning'
  }
]

export function Inicio() {
  const { usuario } = useAuth()

  return (
    <>
      <h2 className="mb-4">Olá, {usuario.nome}!</h2>

      <Row className="g-4">
        {cards.map((card) => (
          <Col md={4} key={card.titulo}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex flex-column">
                <div className="mb-3 text-primary">
                  <i className={`bi ${card.icone} display-5`}></i>
                </div>
                <Card.Title>{card.titulo}</Card.Title>
                <Card.Text className="text-secondary flex-grow-1">
                  {card.texto}
                </Card.Text>
                <Button as={Link} to={card.destino} variant={card.variante}>
                  Acessar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}