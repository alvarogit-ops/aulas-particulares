import { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { Foto } from '../components/Foto'
import { nomesDasMaterias } from '../data/materias'
import { carregarProfessoresAtivos } from '../data/professores'

const dadosIniciais = {
  professorId: '',
  materia: '',
  data: '',
  horario: '09:00',
  duracao: '1h',
  modalidade: 'Presencial',
  observacoes: ''
}

export function Agendar() {
  const navigate = useNavigate()
  const [form, setForm] = useState(dadosIniciais)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [professores, setProfessores] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroCarregar, setErroCarregar] = useState('')

  useEffect(() => {
    let ativo = true

    carregarProfessoresAtivos()
      .then(lista => {
        if (ativo) {
          setProfessores(Array.isArray(lista) ? lista : [])
          setErroCarregar('')
        }
      })
      .catch(() => {
        if (ativo) setErroCarregar('Não foi possível carregar os professores disponíveis.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => { ativo = false }
  }, [])

  useEffect(() => {
    if (Array.isArray(professores) && professores.length && !form.professorId) {
      const primeiro = professores[0]
      const materias = nomesDasMaterias(primeiro.materias ?? primeiro.servicos ?? [])
      setForm(prev => ({ ...prev, professorId: String(primeiro.id), materia: materias[0] ?? '' }))
    }
  }, [professores, form.professorId])

  const professor = useMemo(
    () => (Array.isArray(professores) ? professores.find(item => String(item.id) === String(form.professorId)) ?? professores[0] : null),
    [form.professorId, professores],
  )

  useEffect(() => {
    if (professor && !form.materia) {
      const materias = nomesDasMaterias(professor.materias ?? professor.servicos ?? [])
      setForm(prev => ({ ...prev, materia: materias[0] ?? '' }))
    }
  }, [professor, form.materia])

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
      professor: professor?.nome ?? 'Professor',
      materia: form.materia || nomesDasMaterias(professor?.materias ?? professor?.servicos ?? [])[0] || '',
      valor: professor?.valor ?? 0,
      status: 'Agendada',
      codigo: `AULA-${Date.now().toString().slice(-6)}`
    }

    const existentes = JSON.parse(localStorage.getItem('reservas') || '[]')
    const proximo = [reserva, ...existentes]
    localStorage.setItem('reservas', JSON.stringify(proximo))
    setSucesso(`Reserva confirmada com ${reserva.professor} para ${form.data} às ${form.horario}.`)
    setForm({ ...dadosIniciais, professorId: professor ? String(professor.id) : '', materia: nomesDasMaterias(professor?.materias ?? professor?.servicos ?? [])[0] ?? '' })
    setTimeout(() => navigate('/aulas'), 800)
  }

  if (carregando) {
    return <div className="text-center py-5">Carregando professores…</div>
  }

  if (erroCarregar) {
    return (
      <Alert variant="danger" className="d-flex justify-content-between align-items-center">
        <span>{erroCarregar}</span>
        <Button variant="outline-danger" size="sm" onClick={() => window.location.reload()}>Tentar de novo</Button>
      </Alert>
    )
  }

  if (!professor) {
    return (
      <Alert variant="warning">
        Ainda não há professores ativos para agendar. Cadastre um professor no painel admin.
      </Alert>
    )
  }

  const materiasProfessor = nomesDasMaterias(professor.materias ?? professor.servicos ?? [])

  return (
    <Row className="g-4">
      <Col lg={5}>
        <Card className="shadow-sm h-100">
          <Card.Body>
            <div className="d-flex align-items-center gap-3 mb-4">
              <Foto src={professor.foto} tamanho={64} />
              <div>
                <h4 className="mb-0">{professor.nome}</h4>
                <small className="text-secondary">{materiasProfessor[0] ?? 'Matéria não informada'}</small>
              </div>
            </div>

            <Badge bg="primary-subtle" text="primary" className="mb-3">{professor.capacidade ? `Até ${professor.capacidade} alunos` : 'Professor'}</Badge>
            <p className="mb-2"><strong>Bio:</strong> {professor.bio || 'Sem descrição disponível.'}</p>
            <p className="mb-0"><strong>Matérias:</strong> {materiasProfessor.length ? materiasProfessor.join(', ') : 'Não informada'}</p>
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
                <Form.Select value={form.professorId} onChange={e => {
                  const valor = e.target.value
                  atualizarCampo('professorId', valor)
                  const prof = professores.find(item => String(item.id) === String(valor))
                  if (prof) {
                    const materias = nomesDasMaterias(prof.materias ?? prof.servicos ?? [])
                    atualizarCampo('materia', materias[0] ?? '')
                  }
                }}>
                  {professores.map(prof => {
                    const materias = nomesDasMaterias(prof.materias ?? prof.servicos ?? [])
                    return (
                      <option key={prof.id} value={prof.id}>{prof.nome}{materias.length ? ` - ${materias.join(', ')}` : ''}</option>
                    )
                  })}
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
                <Form.Control type="text" value={form.materia || materiasProfessor[0] || ''} onChange={e => atualizarCampo('materia', e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Observações</Form.Label>
                <Form.Control as="textarea" rows={4} value={form.observacoes} onChange={e => atualizarCampo('observacoes', e.target.value)} placeholder="Conte ao professor seu objetivo, nível atual ou temas que deseja revisar..." />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Total estimado:</strong> R$ {Number(professor?.preco ?? 0).toFixed(2)}
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
