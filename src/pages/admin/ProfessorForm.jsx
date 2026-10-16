import { useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, mensagemDeErro } from '../../api/cliente.js'
import { Campo } from '../../components/admin/Campo'
import { Estado } from '../../components/admin/Estado'
import { Foto } from '../../components/Foto'
import { MATERIAS } from '../../data/materias'
import { adicionarProfessorLocal } from '../../data/professores'
import { useCarregar } from '../../hooks/useCarregar'

function Formulario({ inicial, id }) {
  const navigate = useNavigate()
  const [nome, setNome] = useState(inicial.nome ?? '')
  const [bio, setBio] = useState(inicial.bio ?? '')
  const [capacidade, setCapacidade] = useState(inicial.capacidade ?? 1)
  const [ativo, setAtivo] = useState(inicial.ativo ?? true)
  const [materias, setMaterias] = useState(
    Array.isArray(inicial.materias)
      ? inicial.materias.map(item => typeof item === 'object' ? item.id ?? item.slug : item)
      : Array.isArray(inicial.servicos)
        ? inicial.servicos.map(item => typeof item === 'object' ? item.id ?? item.slug : item)
        : []
  )
  const [foto, setFoto] = useState(null)
  const [fotoAtual, setFotoAtual] = useState(inicial.foto ?? null)
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)

  async function enviar(corpo, aoConcluir) {
    setEnviando(true)
    setErro(null)
    setErros({})
    try {
      const resposta = await api(id ? `/recursos/${id}/` : '/recursos/', { method: id ? 'PATCH' : 'POST', body: corpo })
      if (resposta && resposta.id) {
        adicionarProfessorLocal({
          ...resposta,
          nome: resposta.nome || nome,
          bio: resposta.bio || bio,
          capacidade: resposta.capacidade ?? capacidade,
          ativo: resposta.ativo ?? ativo,
          foto: resposta.foto || fotoAtual,
          materias: materias.length ? materias : (resposta.materias ?? []),
        })
      }
      aoConcluir(resposta)
    } catch (e) {
      setErro(mensagemDeErro(e))
      setErros(e.dados ?? {})
    } finally {
      setEnviando(false)
    }
  }

  function alternarMateria(materiaId) {
    setMaterias(atual => (atual.includes(materiaId) ? atual.filter(x => x !== materiaId) : [...atual, materiaId]))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const formulario = new FormData()
    formulario.append('nome', nome)
    formulario.append('bio', bio)
    formulario.append('capacidade', capacidade)
    formulario.append('ativo', String(ativo))
    materias.forEach(materiaId => formulario.append('materias', materiaId))
    if (foto) formulario.append('foto', foto)
    enviar(formulario, () => navigate('/admin/professores'))
  }

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={7}>
        <Card className="shadow-sm">
          <Card.Body>
            {erro && <Alert variant="danger">{erro}</Alert>}
            <Form onSubmit={handleSubmit}>
              <div className="text-center mb-3">
                <Foto src={fotoAtual} tamanho={96} />
              </div>
              <Campo label="Nome" erro={erros.nome}>
                <Form.Control value={nome} onChange={e => setNome(e.target.value)} isInvalid={!!erros.nome} required />
              </Campo>
              <Campo label="Bio" erro={erros.bio}>
                <Form.Control as="textarea" rows={3} value={bio} onChange={e => setBio(e.target.value)} isInvalid={!!erros.bio} />
              </Campo>
              <Campo label="Capacidade (alunos ao mesmo tempo)" erro={erros.capacidade}>
                <Form.Control type="number" min={1} value={capacidade} onChange={e => setCapacidade(e.target.value)} isInvalid={!!erros.capacidade} required />
              </Campo>
              <Campo label="Foto" erro={erros.foto}>
                <Form.Control type="file" accept="image/*" onChange={e => setFoto(e.target.files[0])} isInvalid={!!erros.foto} />
              </Campo>
              <Campo label="Matérias que ministra" erro={erros.materias}>
                {MATERIAS.map(materia => (
                  <Form.Check
                    key={materia.id}
                    type="checkbox"
                    id={`materia-${materia.id}`}
                    label={materia.nome}
                    checked={materias.includes(materia.id)}
                    onChange={() => alternarMateria(materia.id)}
                  />
                ))}
              </Campo>
              <Form.Check
                type="switch"
                id="ativo"
                label="Ativo (aparece para agendamento)"
                checked={ativo}
                onChange={e => setAtivo(e.target.checked)}
                className="mb-3"
              />
              <div className="d-flex gap-2 flex-wrap">
                <Button type="submit" disabled={enviando}>Salvar</Button>
                <Button as={Link} to="/admin/professores" variant="outline-secondary">Cancelar</Button>
                {id && fotoAtual && (
                  <Button
                    variant="outline-secondary"
                    disabled={enviando}
                    onClick={() => enviar({ foto: null }, r => setFotoAtual(r.foto ?? null))}
                  >
                    Remover foto
                  </Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export function ProfessorForm() {
  const { id } = useParams()
  const { dados, carregando, erro, recarregar } = useCarregar(
    () => (id ? api(`/recursos/${id}/`) : Promise.resolve({})),
    [id],
  )

  return (
    <>
      <h2 className="mb-4">{id ? 'Editar professor' : 'Novo professor'}</h2>
      <Estado carregando={carregando} erro={erro} recarregar={recarregar}>
        {dados && <Formulario key={id ?? 'novo'} inicial={dados} id={id} />}
      </Estado>
    </>
  )
}
