import { useState } from 'react'
import { Alert, Button, Card, Col, Form, ListGroup, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { CAMPOS, DIAS, itensDe } from '../../api/admin.js'
import { api, mensagemDeErro } from '../../api/cliente.js'
import { Campo } from '../../components/admin/Campo'
import { Estado } from '../../components/admin/Estado'
import { useCarregar } from '../../hooks/useCarregar'

const hora = valor => String(valor ?? '').slice(0, 5)

function Linha({ faixa, aoMudar, aoRemover }) {
  const [editando, setEditando] = useState(false)
  const [inicio, setInicio] = useState(hora(faixa[CAMPOS.horaInicio]))
  const [fim, setFim] = useState(hora(faixa[CAMPOS.horaFim]))
  const [erro, setErro] = useState(null)

  async function salvar() {
    setErro(null)
    try {
      const nova = await api(`/disponibilidades/${faixa.id}/`, {
        method: 'PATCH',
        body: { [CAMPOS.horaInicio]: inicio, [CAMPOS.horaFim]: fim },
      })
      aoMudar(nova)
      setEditando(false)
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  async function remover() {
    if (!window.confirm('Remover esta faixa de horário?')) return
    try {
      await api(`/disponibilidades/${faixa.id}/`, { method: 'DELETE' })
      aoRemover(faixa.id)
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  return (
    <ListGroup.Item>
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <strong style={{ width: 90 }}>{DIAS[faixa[CAMPOS.diaSemana]] ?? faixa[CAMPOS.diaSemana]}</strong>
        {editando ? (
          <>
            <Form.Control type="time" value={inicio} onChange={e => setInicio(e.target.value)} style={{ width: 130 }} />
            <span>às</span>
            <Form.Control type="time" value={fim} onChange={e => setFim(e.target.value)} style={{ width: 130 }} />
            <Button size="sm" onClick={salvar}>Salvar</Button>
            <Button size="sm" variant="outline-secondary" onClick={() => setEditando(false)}>Cancelar</Button>
          </>
        ) : (
          <>
            <span className="flex-grow-1">{hora(faixa[CAMPOS.horaInicio])} às {hora(faixa[CAMPOS.horaFim])}</span>
            <Button size="sm" variant="outline-primary" onClick={() => setEditando(true)}>Editar</Button>
            <Button size="sm" variant="outline-danger" onClick={remover}>Remover</Button>
          </>
        )}
      </div>
      {erro && <div className="text-danger small mt-1">{erro}</div>}
    </ListGroup.Item>
  )
}

export function Horarios() {
  const { id } = useParams()
  const professor = useCarregar(() => api(`/recursos/${id}/`), [id])
  const { dados, setDados, carregando, erro, recarregar } = useCarregar(
    async () => itensDe(await api(`/disponibilidades/?recurso=${id}`)),
    [id],
  )

  const [dia, setDia] = useState(0)
  const [inicio, setInicio] = useState('09:00')
  const [fim, setFim] = useState('12:00')
  const [erroForm, setErroForm] = useState(null)
  const [errosCampos, setErrosCampos] = useState({})
  const [enviando, setEnviando] = useState(false)

  async function adicionar(e) {
    e.preventDefault()
    setEnviando(true)
    setErroForm(null)
    setErrosCampos({})
    try {
      const nova = await api('/disponibilidades/', {
        method: 'POST',
        body: { recurso: Number(id), [CAMPOS.diaSemana]: Number(dia), [CAMPOS.horaInicio]: inicio, [CAMPOS.horaFim]: fim },
      })
      setDados(lista => [...lista, nova])
    } catch (err) {
      setErroForm(mensagemDeErro(err))
      setErrosCampos(err.dados ?? {})
    } finally {
      setEnviando(false)
    }
  }

  const porDia = DIAS.map((nome, i) => ({
    nome,
    faixas: (dados ?? [])
      .filter(f => Number(f[CAMPOS.diaSemana]) === i)
      .sort((a, b) => hora(a[CAMPOS.horaInicio]).localeCompare(hora(b[CAMPOS.horaInicio]))),
  })).filter(d => d.faixas.length)

  return (
    <>
      <Button as={Link} to={`/admin/professores/${id}`} variant="link" className="px-0 mb-2">
        <i className="bi bi-arrow-left"></i> Voltar
      </Button>
      <h2 className="mb-4">Horários{professor.dados ? ` · ${professor.dados.nome}` : ''}</h2>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-3">Adicionar faixa</h5>
          {erroForm && <Alert variant="danger">{erroForm}</Alert>}
          <Form onSubmit={adicionar}>
            <Row className="g-3 align-items-end">
              <Col md={4}>
                <Campo label="Dia" className="mb-0" erro={errosCampos[CAMPOS.diaSemana]}>
                  <Form.Select value={dia} onChange={e => setDia(e.target.value)}>
                    {DIAS.map((nome, i) => <option key={nome} value={i}>{nome}</option>)}
                  </Form.Select>
                </Campo>
              </Col>
              <Col md={3}>
                <Campo label="Início" className="mb-0" erro={errosCampos[CAMPOS.horaInicio]}>
                  <Form.Control type="time" value={inicio} onChange={e => setInicio(e.target.value)} required />
                </Campo>
              </Col>
              <Col md={3}>
                <Campo label="Fim" className="mb-0" erro={errosCampos[CAMPOS.horaFim]}>
                  <Form.Control type="time" value={fim} onChange={e => setFim(e.target.value)} required />
                </Campo>
              </Col>
              <Col md={2}>
                <Button type="submit" className="w-100" disabled={enviando}>Adicionar</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Estado carregando={carregando} erro={erro} recarregar={recarregar}>
        {porDia.length ? (
          <ListGroup className="shadow-sm">
            {porDia.flatMap(d =>
              d.faixas.map(f => (
                <Linha
                  key={f.id}
                  faixa={f}
                  aoMudar={nova => setDados(lista => lista.map(x => (x.id === nova.id ? nova : x)))}
                  aoRemover={fid => setDados(lista => lista.filter(x => x.id !== fid))}
                />
              )),
            )}
          </ListGroup>
        ) : (
          <p className="text-secondary">Sem horários: ninguém consegue agendar.</p>
        )}
      </Estado>
    </>
  )
}
