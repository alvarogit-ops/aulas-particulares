import { useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const professores = [
  {
    id: 1,
    nome: 'Ana Beatriz',
    materia: 'Matemática',
    nivel: 'Ensino Médio',
    valor: 70,
    disponibilidade: 'Segunda e Quarta, 18h às 20h',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 2,
    nome: 'Carlos Mendes',
    materia: 'Física',
    nivel: 'Pré-vestibular',
    valor: 85,
    disponibilidade: 'Terça e Quinta, 17h às 19h',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 3,
    nome: 'Lívia Costa',
    materia: 'Inglês',
    nivel: 'Todos os níveis',
    valor: 65,
    disponibilidade: 'Quarta e Sexta, 19h às 21h',
    foto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 4,
    nome: 'Mateus Silva',
    materia: 'Química',
    nivel: 'Ensino Médio',
    valor: 80,
    disponibilidade: 'Segunda, Quarta e Sábado, 9h às 12h',
    foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
  }
]

const dadosIniciais = {
  professorId: 1,
  materia: 'Matemática',
  data: '2026-10-12',
  horario: '18:00',
  duracao: '1h',
  modalidade: 'Presencial',
  observacoes: ''
}

export function Agendar() {
  const navigate = useNavigate()
  const [form, setForm] = useState(dadosIniciais)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const professor = useMemo(
    () => professores.find(item => String(item.id) === String(form.professorId)) ?? professores[0],
    [form.professorId]
  )

  function atualizarCampo(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }))
  }

  function reservar(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (!form.data || !form.horario || !form.professorId) {
      setErro('Preencha a data, o horário e o professor para concluir a reserva.')
      return
    }

    const reserva = {
      ...form,
      professor: professor.nome,
      materia: professor.materia,
      valor: professor.valor,
      status: 'Agendada',
      codigo: `AULA-${Date.now().toString().slice(-6)}`
    }

    const existentes = JSON.parse(localStorage.getItem('reservas') || '[]')
    const proximo = [reserva, ...existentes]
    localStorage.setItem('reservas', JSON.stringify(proximo))
    setSucesso(`Reserva confirmada com ${professor.nome} para ${form.data} às ${form.horario}.`)
    setForm(dadosIniciais)
    setTimeout(() => navigate('/aulas'), 800)
  }

  return (
    <Row className="g-4">
      <Col lg={5}>
        <Card className="shadow-sm h-100">
          <Card.Body>
            <div className="d-flex align-items-center gap-3 mb-4">
              <img src={professor.foto} alt={professor.nome} className="rounded-circle" width={64} height={64} style={{ objectFit: 'cover' }} />
              <div>
                <h4 className="mb-0">{professor.nome}</h4>
                <small className="text-secondary">{professor.materia}</small>
              </div>
            </div>

            <Badge bg="primary-subtle" text="primary" className="mb-3">{professor.nivel}</Badge>
            <p className="mb-2"><strong>Disponibilidade:</strong> {professor.disponibilidade}</p>
            <p className="mb-0"><strong>Valor da aula:</strong> R$ {professor.valor.toFixed(2)}</p>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={7}>
        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="mb-4">Nova reserva</h2>

            {erro && <Alert variant="danger">{erro}</Alert>}
            {sucesso && <Alert variant="success">{sucesso}</Alert>}

            <Form onSubmit={reservar}>
              <Form.Group className="mb-3">
                <Form.Label>Professor</Form.Label>
                <Form.Select value={form.professorId} onChange={e => atualizarCampo('professorId', e.target.value)}>
                  {professores.map(prof => (
                    <option key={prof.id} value={prof.id}>{prof.nome} - {prof.materia}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data</Form.Label>
                    <Form.Control type="date" value={form.data} onChange={e => atualizarCampo('data', e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Horário</Form.Label>
                    <Form.Control type="time" value={form.horario} onChange={e => atualizarCampo('horario', e.target.value)} required />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Duração</Form.Label>
                    <Form.Select value={form.duracao} onChange={e => atualizarCampo('duracao', e.target.value)}>
                      <option value="1h">1 hora</option>
                      <option value="1h30">1h30</option>
                      <option value="2h">2 horas</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Modalidade</Form.Label>
                    <Form.Select value={form.modalidade} onChange={e => atualizarCampo('modalidade', e.target.value)}>
                      <option value="Presencial">Presencial</option>
                      <option value="Online">Online</option>
                      <option value="Híbrida">Híbrida</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Matéria</Form.Label>
                <Form.Control type="text" value={professor.materia} readOnly />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Observações</Form.Label>
                <Form.Control as="textarea" rows={4} value={form.observacoes} onChange={e => atualizarCampo('observacoes', e.target.value)} placeholder="Conte ao professor seu objetivo, nível atual ou temas que deseja revisar..." />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Total estimado:</strong> R$ {professor.valor.toFixed(2)}
                </div>
                <Button type="submit" size="lg">Confirmar reserva</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
