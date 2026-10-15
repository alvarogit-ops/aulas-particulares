import { useCallback, useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { api, mensagemDeErro } from '../api/cliente.js'
import { useAuth } from '../AuthContext'

function itensDaResposta(dados) {
  return Array.isArray(dados) ? dados : (dados?.results ?? [])
}

export function AdminProfessores() {
  const { pode } = useAuth()
  const [professores, setProfessores] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [camposErro, setCamposErro] = useState({})
  const [form, setForm] = useState({ nome: '', bio: '', capacidade: '1', foto: null })

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const dados = await api('/recursos/')
      setProfessores(itensDaResposta(dados))
    } catch (falha) {
      setErro(mensagemDeErro(falha))
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  async function cadastrar(e) {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    setSucesso('')
    setCamposErro({})
    const corpo = new FormData()
    corpo.append('nome', form.nome)
    corpo.append('bio', form.bio)
    corpo.append('capacidade', form.capacidade)
    corpo.append('ativo', 'true')
    if (form.foto) corpo.append('foto', form.foto)
    try {
      await api('/recursos/', { method: 'POST', body: corpo })
      setForm({ nome: '', bio: '', capacidade: '1', foto: null })
      e.target.reset()
      setSucesso('Professor cadastrado com sucesso.')
      await carregar()
    } catch (falha) {
      setErro(mensagemDeErro(falha))
      setCamposErro(falha.dados ?? {})
    } finally {
      setEnviando(false)
    }
  }

  if (!pode('api.change_organizacao')) {
    return <Alert variant="warning">Somente administradores podem cadastrar professores.</Alert>
  }

  return (
    <Row className="g-4">
      <Col xs={12}>
        <h2 className="mb-1">Professores</h2>
        <p className="text-secondary">Cadastre os professores que poderão receber agendamentos.</p>
      </Col>
      <Col lg={5}>
        <Card className="shadow-sm">
          <Card.Body>
            <h3 className="h5 mb-3">Cadastrar professor</h3>
            {erro && <Alert variant="danger">{erro}</Alert>}
            {sucesso && <Alert variant="success">{sucesso}</Alert>}
            <Form onSubmit={cadastrar}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} isInvalid={!!camposErro.nome} required />
                <Form.Control.Feedback type="invalid">{camposErro.nome?.join(' ')}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Apresentação</Form.Label>
                <Form.Control as="textarea" rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} isInvalid={!!camposErro.bio} />
                <Form.Control.Feedback type="invalid">{camposErro.bio?.join(' ')}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Capacidade simultânea</Form.Label>
                <Form.Control type="number" min="1" value={form.capacidade} onChange={e => setForm({ ...form, capacidade: e.target.value })} isInvalid={!!camposErro.capacidade} required />
                <Form.Control.Feedback type="invalid">{camposErro.capacidade?.join(' ')}</Form.Control.Feedback>
                <Form.Text>Quantidade de alunos que pode atender no mesmo horário.</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Foto (opcional)</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={e => setForm({ ...form, foto: e.target.files?.[0] ?? null })} isInvalid={!!camposErro.foto} />
                <Form.Control.Feedback type="invalid">{camposErro.foto?.join(' ')}</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" disabled={enviando}>{enviando ? 'Salvando…' : 'Cadastrar professor'}</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={7}>
        <h3 className="h5 mb-3">Professores cadastrados</h3>
        {carregando ? <div className="text-center"><Spinner animation="border" /></div> : professores.length === 0 ? (
          <Alert variant="info">Nenhum professor cadastrado ainda.</Alert>
        ) : <Row className="g-3">{professores.map(professor => (
          <Col md={6} key={professor.id}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between gap-2">
                  <Card.Title className="h6">{professor.nome}</Card.Title>
                  <Badge bg={professor.ativo === false ? 'secondary' : 'success'}>{professor.ativo === false ? 'Inativo' : 'Ativo'}</Badge>
                </div>
                <p className="mb-1">{professor.bio || 'Sem apresentação.'}</p>
                <small className="text-secondary">Capacidade: {professor.capacidade ?? 1}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}</Row>}
      </Col>
    </Row>
  )
}
