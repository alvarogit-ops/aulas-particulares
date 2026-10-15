import { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { hojeISO, listarTudo } from '../../api/admin.js'
import { AulaItem } from '../../components/admin/AulaItem'
import { Estado } from '../../components/admin/Estado'
import { useCarregar } from '../../hooks/useCarregar'

export function Agenda() {
  const [dia, setDia] = useState(hojeISO())
  const [recurso, setRecurso] = useState('')

  const professores = useCarregar(() => listarTudo('/recursos/'), [])
  const { dados, setDados, carregando, erro, recarregar } = useCarregar(async () => {
    const filtro = recurso ? `&recurso=${recurso}` : ''
    const lista = await listarTudo(`/agendamentos/?data_inicio=${dia}&data_fim=${dia}${filtro}`)
    return lista.sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
  }, [dia, recurso])

  function atualizar(aula) {
    setDados(lista => lista.map(item => (item.id === aula.id ? { ...item, ...aula } : item)))
  }

  return (
    <>
      <h2 className="mb-4">Agenda do dia</h2>
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Form.Label>Dia</Form.Label>
          <Form.Control type="date" value={dia} onChange={e => setDia(e.target.value)} />
        </Col>
        <Col md={4}>
          <Form.Label>Professor</Form.Label>
          <Form.Select value={recurso} onChange={e => setRecurso(e.target.value)}>
            <option value="">Todos</option>
            {(professores.dados ?? []).map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Estado carregando={carregando} erro={erro} recarregar={recarregar}>
        {dados?.length ? (
          dados.map(aula => <AulaItem key={aula.id} aula={aula} aoMudar={atualizar} />)
        ) : (
          <p className="text-secondary">Nenhuma aula neste dia.</p>
        )}
      </Estado>
    </>
  )
}
