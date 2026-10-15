import { Badge, Button, Card, ListGroup } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api/cliente.js'
import { formatarDataHora, formatarPreco, nomeDe, STATUS } from '../../api/admin.js'
import { AcoesAula } from '../../components/admin/AcoesAula'
import { nomeCliente } from '../../components/admin/AulaItem'
import { Estado } from '../../components/admin/Estado'
import { useCarregar } from '../../hooks/useCarregar'

export function DetalheAula() {
  const { id } = useParams()
  const { dados: aula, setDados, carregando, erro, recarregar } = useCarregar(() => api(`/agendamentos/${id}/`), [id])
  const status = STATUS[aula?.status] ?? { texto: aula?.status, cor: 'secondary' }

  return (
    <>
      <Button as={Link} to="/admin/agenda" variant="link" className="px-0 mb-2">
        <i className="bi bi-arrow-left"></i> Voltar
      </Button>
      <Estado carregando={carregando} erro={erro} recarregar={recarregar}>
        {aula && (
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="mb-0">{nomeDe(aula, 'servico')}</h2>
                <Badge bg={status.cor}>{status.texto}</Badge>
              </div>
              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item className="px-0"><strong>Professor:</strong> {nomeDe(aula, 'recurso') || '—'}</ListGroup.Item>
                <ListGroup.Item className="px-0"><strong>Aluno/responsável:</strong> {nomeCliente(aula) || '—'}</ListGroup.Item>
                <ListGroup.Item className="px-0"><strong>Início:</strong> {formatarDataHora(aula.inicio)}</ListGroup.Item>
                {aula.fim && <ListGroup.Item className="px-0"><strong>Fim:</strong> {formatarDataHora(aula.fim)}</ListGroup.Item>}
                {aula.preco != null && <ListGroup.Item className="px-0"><strong>Preço:</strong> {formatarPreco(aula.preco)}</ListGroup.Item>}
                <ListGroup.Item className="px-0"><strong>Observações:</strong> {aula.observacoes || '—'}</ListGroup.Item>
                {aula.nota != null && (
                  <ListGroup.Item className="px-0">
                    <strong>Avaliação:</strong> {aula.nota}/5 {aula.comentario && `· ${aula.comentario}`}
                  </ListGroup.Item>
                )}
              </ListGroup>
              <AcoesAula aula={aula} aoMudar={nova => setDados(atual => ({ ...atual, ...nova }))} />
            </Card.Body>
          </Card>
        )}
      </Estado>
    </>
  )
}
