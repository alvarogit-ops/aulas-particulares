import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Foto } from '../components/Foto'
import { nomesDasMaterias } from '../data/materias'
import { carregarProfessoresAtivos } from '../data/professores'

export function Professores() {
  const [professores, setProfessores] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    carregarProfessoresAtivos()
      .then(lista => {
        if (ativo) {
          setProfessores(Array.isArray(lista) ? lista : [])
          setErro('')
        }
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
        <h2 className="mb-4">Professores e matérias</h2>
      </Col>

      {professores.length ? professores.map((professor) => {
        const materias = nomesDasMaterias(professor.materias ?? professor.servicos ?? [])

        return (
          <Col lg={6} key={professor.id}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3 gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <Foto src={professor.foto} tamanho={56} />
                    <div>
                      <h4 className="mb-1">{professor.nome}</h4>
                      {materias.length ? materias.map((materia, index) => (
                        <Badge key={`${professor.id}-${materia}-${index}`} bg="primary-subtle" text="primary" className="me-1 mb-1">
                          {materia}
                        </Badge>
                      )) : <Badge bg="secondary-subtle" text="secondary">Sem matéria</Badge>}
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
