import { useCallback, useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Row, Spinner } from 'react-bootstrap'
import { api, mensagemDeErro } from '../api/cliente.js'
import { useAuth } from '../AuthContext'

function itensDaResposta(dados) {
  return Array.isArray(dados) ? dados : (dados?.results ?? [])
}

function dataHora(valor) {
  if (!valor) return 'Horário não informado'
  return new Date(valor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export function ConfirmarAulas() {
  const { usuario, pode } = useAuth()
  const [aulas, setAulas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [processando, setProcessando] = useState(null)

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const params = new URLSearchParams({ status: 'solicitado' })
      const recursoId = usuario?.recurso?.id ?? usuario?.recurso_id
      if (recursoId) params.set('recurso', recursoId)
      const dados = await api(`/agendamentos/?${params}`)
      setAulas(itensDaResposta(dados))
    } catch (falha) {
      setErro(mensagemDeErro(falha))
    } finally {
      setCarregando(false)
    }
  }, [usuario])

  useEffect(() => { carregar() }, [carregar])

  async function confirmar(id) {
    setProcessando(id)
    setErro('')
    try {
      await api(`/agendamentos/${id}/confirmar/`, { method: 'POST' })
      setAulas(atual => atual.filter(aula => aula.id !== id))
    } catch (falha) {
      setErro(mensagemDeErro(falha))
    } finally {
      setProcessando(null)
    }
  }

  if (!pode('api.confirmar_agendamento')) {
    return <Alert variant="warning">Sua conta não tem permissão para confirmar aulas.</Alert>
  }

  return (
    <Row className="g-4">
      <Col xs={12} className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-1">Aulas para confirmar</h2>
          <p className="text-secondary mb-0">Confira os pedidos dos alunos e confirme os horários.</p>
        </div>
        <Button variant="outline-primary" onClick={carregar} disabled={carregando}>Atualizar</Button>
      </Col>
      {erro && <Col xs={12}><Alert variant="danger">{erro}</Alert></Col>}
      {carregando ? (
        <Col xs={12} className="text-center"><Spinner animation="border" role="status" /><span className="visually-hidden">Carregando aulas</span></Col>
      ) : aulas.length === 0 ? (
        <Col xs={12}><Alert variant="info">Não há pedidos de aula aguardando confirmação.</Alert></Col>
      ) : aulas.map(aula => (
        <Col md={6} key={aula.id}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between gap-3">
                <div>
                  <Card.Title>{aula.servico?.nome ?? aula.servico_nome ?? 'Aula'}</Card.Title>
                  <div className="text-secondary">Professor: {aula.recurso?.nome ?? aula.recurso_nome ?? '—'}</div>
                </div>
                <Badge bg="warning" text="dark" className="align-self-start">Solicitada</Badge>
              </div>
              <p className="mt-3 mb-1"><strong>Data e horário:</strong> {dataHora(aula.inicio)}</p>
              <p className="mb-1"><strong>Aluno/responsável:</strong> {aula.cliente?.nome ?? aula.usuario?.nome ?? aula.nome_cliente ?? '—'}</p>
              {aula.observacoes && <p className="mb-3"><strong>Observações:</strong> {aula.observacoes}</p>}
              <Button onClick={() => confirmar(aula.id)} disabled={processando !== null}>
                {processando === aula.id ? 'Confirmando…' : 'Confirmar horário'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}
