import { Badge, Card, Col, ListGroup, Row } from 'react-bootstrap'

const professores = [
  {
    nome: 'Ana Beatriz',
    materia: 'Matemática',
    nivel: 'Ensino Fundamental II e Médio',
    descricao: 'Aulas focadas em reforço escolar e preparação para provas.',
    disponibilidade: 'Segunda e Quarta, 18h às 20h',
    valor: 'R$ 70/h'
  },
  {
    nome: 'Carlos Mendes',
    materia: 'Física',
    nivel: 'Pré-vestibular e ensino médio',
    descricao: 'Explicações claras com resolução de exercícios e revisão de conteúdo.',
    disponibilidade: 'Terça e Quinta, 17h às 19h',
    valor: 'R$ 85/h'
  },
  {
    nome: 'Lívia Costa',
    materia: 'Inglês',
    nivel: 'Todos os níveis',
    descricao: 'Aulas de conversação, pronúncia e foco em speaking e listening.',
    disponibilidade: 'Quarta e Sexta, 19h às 21h',
    valor: 'R$ 65/h'
  },
  {
    nome: 'Mateus Silva',
    materia: 'Química',
    nivel: 'Ensino Médio',
    descricao: 'Conteúdo teórico com exercícios de laboratório e revisão de vestibular.',
    disponibilidade: 'Segunda, Quarta e Sábado, 9h às 12h',
    valor: 'R$ 80/h'
  }
]

export function Professores() {
  return (
    <Row className="g-4">
      <Col md={12}>
        <h2 className="mb-4">Professores e matérias</h2>
      </Col>

      {professores.map((professor) => (
        <Col lg={6} key={professor.nome}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h4 className="mb-1">{professor.nome}</h4>
                  <Badge bg="primary-subtle" text="primary">{professor.materia}</Badge>
                </div>
                <strong>{professor.valor}</strong>
              </div>

              <ListGroup variant="flush">
                <ListGroup.Item className="px-0">
                  <strong>Nível:</strong> {professor.nivel}
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Disponibilidade:</strong> {professor.disponibilidade}
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Descrição:</strong> {professor.descricao}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}
