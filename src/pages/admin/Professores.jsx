import { useState } from 'react'
import { Badge, Button, Card, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { listarTudo } from '../../api/admin.js'
import { Estado } from '../../components/admin/Estado'
import { Foto } from '../../components/Foto'
import { useCarregar } from '../../hooks/useCarregar'

export function Professores() {
  const [filtro, setFiltro] = useState('')
  const { dados, carregando, erro, recarregar } = useCarregar(
    () => listarTudo(`/recursos/${filtro ? `?ativo=${filtro}` : ''}`),
    [filtro],
  )

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">Professores</h2>
        <div className="d-flex gap-2">
          <Form.Select value={filtro} onChange={e => setFiltro(e.target.value)} aria-label="Filtrar">
            <option value="">Todos</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </Form.Select>
          <Button as={Link} to="/admin/professores/novo" className="text-nowrap">Novo professor</Button>
        </div>
      </div>

      <Estado carregando={carregando} erro={erro} recarregar={recarregar}>
        {dados?.length ? (
          dados.map(p => (
            <Card key={p.id} as={Link} to={`/admin/professores/${p.id}`} className="shadow-sm mb-3 text-decoration-none text-body">
              <Card.Body className="d-flex align-items-center gap-3">
                <Foto src={p.foto} tamanho={56} />
                <div className="flex-grow-1">
                  <div className="h5 mb-0">{p.nome}</div>
                  <small className="text-secondary">Capacidade: {p.capacidade ?? 1}</small>
                </div>
                <Badge bg={p.ativo === false ? 'secondary' : 'success'}>{p.ativo === false ? 'Inativo' : 'Ativo'}</Badge>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p className="text-secondary">Cadastre o primeiro professor.</p>
        )}
      </Estado>
    </>
  )
}
