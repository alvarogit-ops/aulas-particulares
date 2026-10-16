import { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { listarTudo } from '../api/admin.js'
import { servicosDoProfessor } from '../data/materias'
import { Foto } from '../components/Foto'

const dadosIniciais = {
  professorId: '',
  servicoId: '',
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
  const [servicos, setServicos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroCarregar, setErroCarregar] = useState('')

  useEffect(() => {
    let ativo = true

    Promise.all([listarTudo('/recursos/?ativo=true'), listarTudo('/servicos/?ativo=true')])
      .then(([listaProfessores, listaServicos]) => {
        if (!ativo) return
        setProfessores(listaProfessores)
        setServicos(listaServicos)
        setErroCarregar('')
      })
      .catch(() => {
        if (ativo) setErroCarregar('Não foi possível carregar os professores disponíveis.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => { ativo = false }
  }, [])

  const professor = useMemo(
    () => (Array.isArray(professores) ? professores.find(item => String(item.id) === String(form.professorId)) ?? professores[0] : null),
    [form.professorId, professores],
  )

  const disciplinasProfessor = useMemo(() => servicosDoProfessor(professor, servicos), [professor, servicos])
  const servicoSelecionado = disciplinasProfessor.find(item => String(item.id) === String(form.servicoId)) ?? disciplinasProfessor[0]

  useEffect(() => {
    if (!professores.length || !servicos.length) return
    const prof = professores.find(item => String(item.id) === String(form.professorId)) ?? professores[0]
    const disciplinas = servicosDoProfessor(prof, servicos)
    setForm(prev => ({
      ...prev,
      professorId: String(prof.id),
      servicoId: disciplinas.some(item => String(item.id) === String(prev.servicoId))
        ? prev.servicoId
        : String(disciplinas[0]?.id ?? ''),
    }))
  }, [professores, servicos, form.professorId])

  const valorHora = servicoSelecionado
    ? Number(servicoSelecionado.preco ?? 0) / Math.max(Number(servicoSelecionado.duracao_min ?? 60) / 60, 1 / 60)
    : 0

  const multiplicadorDuracao = useMemo(() => {
    const valor = String(form.duracao)
    if (valor === '1h30') return 1.5
    if (valor === '2h') return 2
    return 1
  }, [form.duracao])

  const custoEstimado = useMemo(() => valorHora * multiplicadorDuracao, [valorHora, multiplicadorDuracao])

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

    if (!servicoSelecionado) {
      setErro('Este professor ainda não tem disciplinas cadastradas.')
      return
    }

    const valorTotal = Number((valorHora * multiplicadorDuracao).toFixed(2))
    const reserva = {
      ...form,
      professor: professor?.nome ?? 'Professor',
      materia: servicoSelecionado?.nome ?? '',
      servicoId: servicoSelecionado?.id ?? '',
      valor: valorTotal,
      custoEstimado: valorTotal,
      status: 'Agendada',
      codigo: `AULA-${Date.now().toString().slice(-6)}`
    }

    const existentes = JSON.parse(localStorage.getItem('reservas') || '[]')
    const proximo = [reserva, ...existentes]
    localStorage.setItem('reservas', JSON.stringify(proximo))
    setSucesso(`Reserva confirmada com ${reserva.professor} para ${form.data} às ${form.horario}.`)
    setForm({ ...dadosIniciais, professorId: professor ? String(professor.id) : '', servicoId: servicoSelecionado ? String(servicoSelecionado.id) : '' })
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

  const nomesDisciplinas = disciplinasProfessor.map(servico => servico.nome)

  return (
    <Row className="g-4">
      <Col lg={5}>
        <Card className="shadow-sm h-100">
          <Card.Body>
            <div className="d-flex align-items-center gap-3 mb-4">
              <Foto src={professor.foto} tamanho={64} />
              <div>
                <h4 className="mb-0">{professor.nome}</h4>
                <small className="text-secondary">{nomesDisciplinas[0] ?? 'Disciplina não informada'}</small>
              </div>
            </div>

            <Badge bg="primary-subtle" text="primary" className="mb-3">{professor.capacidade ? `Até ${professor.capacidade} alunos` : 'Professor'}</Badge>
            <p className="mb-2"><strong>Bio:</strong> {professor.bio || 'Sem descrição disponível.'}</p>
            <p className="mb-0"><strong>Disciplinas:</strong> {nomesDisciplinas.length ? nomesDisciplinas.join(', ') : 'Não informada'}</p>
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
                  const prof = professores.find(item => String(item.id) === String(valor))
                  const disciplinas = servicosDoProfessor(prof, servicos)
                  setForm(prev => ({ ...prev, professorId: valor, servicoId: String(disciplinas[0]?.id ?? '') }))
                }}>
                  {professores.map(prof => <option key={prof.id} value={prof.id}>{prof.nome}</option>)}
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
                <Form.Label>Disciplina</Form.Label>
                <Form.Select value={servicoSelecionado?.id ?? ''} onChange={e => atualizarCampo('servicoId', e.target.value)} required disabled={!disciplinasProfessor.length}>
                  {disciplinasProfessor.length
                    ? disciplinasProfessor.map(servico => <option key={servico.id} value={servico.id}>{servico.nome}</option>)
                    : <option value="">Este professor ainda não tem disciplinas cadastradas</option>}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Observações</Form.Label>
                <Form.Control as="textarea" rows={4} value={form.observacoes} onChange={e => atualizarCampo('observacoes', e.target.value)} placeholder="Conte ao professor seu objetivo, nível atual ou temas que deseja revisar..." />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Total estimado:</strong> R$ {custoEstimado.toFixed(2)}
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
