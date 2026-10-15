import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { listarTudo, nomeDe } from '../../api/admin.js'
import { api, mensagemDeErro } from '../../api/cliente.js'
import { nomeCliente } from '../../components/admin/AulaItem'
import { Estado } from '../../components/admin/Estado'
import { useCarregar } from '../../hooks/useCarregar'

function Estrelas({ nota }) {
  return (
    <span className="text-warning" aria-label={`${nota} de 5`}>
      {[1, 2, 3, 4, 5].map(n => (
        <i key={n} className={`bi ${n <= nota ? 'bi-star-fill' : 'bi-star'}`}></i>
      ))}
    </span>
  )
}

export function Avaliacoes() {
  const [recurso, setRecurso] = useState('')
  const [nota, setNota] = useState('')
  const professores = useCarregar(() => listarTudo('/recursos/'), [])

  const [itens, setItens] = useState([])
  const [proximo, setProximo] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [maisCarregando, setMaisCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)

  function url() {
    const params = new URLSearchParams()
    if (recurso) params.set('recurso', recurso)
    if (nota) params.set('nota', nota)
    const q = params.toString()
    return `/avaliacoes/${q ? `?${q}` : ''}`
  }

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro(null)
    api(url())
      .then(pagina => {
        if (!ativo) return
        setItens(Array.isArray(pagina) ? pagina : pagina.results ?? [])
        setProximo(Array.isArray(pagina) ? null : pagina.next)
      })
      .catch(e => ativo && setErro(mensagemDeErro(e)))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [recurso, nota, tentativa])

  async function carregarMais() {
    setMaisCarregando(true)
    try {
      const pagina = await api(proximo)
      setItens(lista => [...lista, ...(pagina.results ?? [])])
      setProximo(pagina.next)
    } catch (e) {
      setErro(mensagemDeErro(e))
    } finally {
      setMaisCarregando(false)
    }
  }

  return (
    <>
      <h2 className="mb-4">Avaliações</h2>
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Form.Label>Professor</Form.Label>
          <Form.Select value={recurso} onChange={e => setRecurso(e.target.value)}>
            <option value="">Todos</option>
            {(professores.dados ?? []).map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Label>Nota</Form.Label>
          <Form.Select value={nota} onChange={e => setNota(e.target.value)}>
            <option value="">Todas</option>
            {[5, 4, 3, 2, 1].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'estrela' : 'estrelas'}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Estado carregando={carregando} erro={erro} recarregar={() => setTentativa(t => t + 1)}>
        {itens.length ? (
          <>
            {itens.map(a => (
              <Card key={a.id ?? `${a.agendamento}-${a.nota}`} className="shadow-sm mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between flex-wrap">
                    <Estrelas nota={a.nota} />
                    <small className="text-secondary">
                      {nomeDe(a, 'recurso')} · {nomeDe(a, 'servico')}
                    </small>
                  </div>
                  {a.comentario && <p className="mt-2 mb-1">{a.comentario}</p>}
                  {nomeCliente(a) && <small className="text-secondary">{nomeCliente(a)}</small>}
                </Card.Body>
              </Card>
            ))}
            {proximo && (
              <div className="text-center">
                <Button variant="outline-primary" onClick={carregarMais} disabled={maisCarregando}>
                  Carregar mais
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-secondary">Ainda sem avaliações.</p>
        )}
      </Estado>
    </>
  )
}
