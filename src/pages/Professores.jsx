import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { listarTudo } from '../api/admin.js'
import { Foto } from '../components/Foto'
import { servicosDoProfessor } from '../data/materias'

export function Professores() {
  const [professores, setProfessores] = useState([])
  const [servicos, setServicos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    Promise.all([listarTudo('/recursos/?ativo=true'), listarTudo('/servicos/?ativo=true')])
      .then(([listaProfessores, listaServicos]) => {
        if (!ativo) return
        setProfessores(listaProfessores)
        setServicos(listaServicos)
        setErro('')
      })
      .catch(() => {
        if (ativo) setErro('Não foi possível carregar os professores.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => { ativo = false }
  }, [])

  if (carregando) return <div className="text-center py-5">Carregando professores…</div>

  if (erro) {
    return (
      <Alert variant="danger" className="d-flex justify-content-between align-items-center">
        <span>{erro}</span>
        <Button variant="outline-danger" size="sm" onClick={() => window.location.reload()}>Tentar de novo</Button>
      </Alert>
    )
  }

  return (
    <Row className="g-4">
      <Col md={12}>
        <h2 className="mb-4">Professores e disciplinas</h2>
      </Col>

      {professores.length ? professores.map((professor) => {
        const disciplinas = servicosDoProfessor(professor, servicos)

        return (
          <Col lg={6} key={professor.id}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3 gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <Foto src={professor.foto} tamanho={56} />
                    <div>
                      <h4 className="mb-1">{professor.nome}</h4>
                      {disciplinas.length ? disciplinas.map((servico) => (
                        <Badge key={`${professor.id}-${servico.id}`} bg="primary-subtle" text="primary" className="me-1 mb-1">
                          {servico.nome}
                        </Badge>
                      )) : <Badge bg="secondary-subtle" text="secondary">Sem disciplina</Badge>}
                    </div>
                  </div>
                </div>

                <ListGroup variant="flush">
                  <ListGroup.Item className="px-0">
                    <strong>Capacidade:</strong> {professor.capacidade ?? 1}
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0">
                    <strong>Descrição:</strong> {professor.bio || 'Sem descrição disponível.'}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        )
      }) : (
        <Col md={12}>
          <p className="text-secondary mb-0">Nenhum professor cadastrado no momento.</p>
        </Col>
      )}
    </Row>
  )
}
