import { useState } from 'react'
import { Badge, Button, Card, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CAMPOS, formatarPreco, listarTudo } from '../../api/admin.js'
import { Estado } from '../../components/admin/Estado'
import { Foto } from '../../components/Foto'
import { useCarregar } from '../../hooks/useCarregar'

export function Servicos() {
  const [filtro, setFiltro] = useState('')
  const { dados, carregando, erro, recarregar } = useCarregar(
    () => listarTudo(`/servicos/${filtro ? `?ativo=${filtro}` : ''}`),
    [filtro],
  )

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">Disciplinas</h2>
        <div className="d-flex gap-2">
          <Form.Select value={filtro} onChange={e => setFiltro(e.target.value)} aria-label="Filtrar">
            <option value="">Todas</option>
            <option value="true">Ativas</option>
            <option value="false">Inativas</option>
          </Form.Select>
          <Button as={Link} to="/admin/servicos/novo" className="text-nowrap">Nova disciplina</Button>
        </div>
      </div>

      <Estado carregando={carregando} erro={erro} recarregar={recarregar}>
        {dados?.length ? (
          dados.map(s => (
            <Card key={s.id} as={Link} to={`/admin/servicos/${s.id}`} className="shadow-sm mb-3 text-decoration-none text-body">
              <Card.Body className="d-flex align-items-center gap-3">
                <Foto src={s.imagem} icone="bi-journal-text" tamanho={56} />
                <div className="flex-grow-1">
                  <div className="h5 mb-0">{s.nome}</div>
                  <small className="text-secondary">
                    {s[CAMPOS.duracao] ?? s.duracao} min · {formatarPreco(s.preco)}
                  </small>
                </div>
                <Badge bg={s.ativo === false ? 'secondary' : 'success'}>{s.ativo === false ? 'Inativa' : 'Ativa'}</Badge>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p className="text-secondary">Cadastre o primeiro serviço.</p>
        )}
      </Estado>
    </>
  )
}
