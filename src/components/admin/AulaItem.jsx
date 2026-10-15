import { Badge, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { formatarDataHora, formatarHora, nomeDe, STATUS } from '../../api/admin.js'
import { AcoesAula } from './AcoesAula'

export function nomeCliente(aula) {
  return aula.cliente_nome ?? aula.cliente?.nome ?? aula.usuario_nome ?? aula.usuario?.nome ?? ''
}

// Cartão de um agendamento, usado na agenda do dia e em "A confirmar".
export function AulaItem({ aula, aoMudar, mostrarData = false }) {
  const status = STATUS[aula.status] ?? { texto: aula.status, cor: 'secondary' }
  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Link to={`/admin/aulas/${aula.id}`} className="h5 text-decoration-none">
              {mostrarData ? formatarDataHora(aula.inicio) : formatarHora(aula.inicio)} · {nomeDe(aula, 'servico')}
            </Link>
            <div className="text-secondary">
              Professor: {nomeDe(aula, 'recurso') || '—'}
              {nomeCliente(aula) && <> · Aluno/responsável: {nomeCliente(aula)}</>}
            </div>
          </div>
          <Badge bg={status.cor}>{status.texto}</Badge>
        </div>
        {aula.observacoes && <p className="mb-2"><i className="bi bi-chat-left-text me-1"></i>{aula.observacoes}</p>}
        <AcoesAula aula={aula} aoMudar={aoMudar} tamanho="sm" />
      </Card.Body>
    </Card>
  )
}
