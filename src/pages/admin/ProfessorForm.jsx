import { useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { idDe, listarTudo } from '../../api/admin.js'
import { api, mensagemDeErro } from '../../api/cliente.js'
import { Campo } from '../../components/admin/Campo'
import { Estado } from '../../components/admin/Estado'
import { Foto } from '../../components/Foto'
import { adicionarProfessorLocal } from '../../data/professores'
import { useCarregar } from '../../hooks/useCarregar'

function Formulario({ inicial, id, servicos }) {
  const navigate = useNavigate()
  const [nome, setNome] = useState(inicial.nome ?? '')
  const [bio, setBio] = useState(inicial.bio ?? '')
  const [capacidade, setCapacidade] = useState(inicial.capacidade ?? 1)
  const [ativo, setAtivo] = useState(inicial.ativo ?? true)
  const [servicosSelecionados, setServicosSelecionados] = useState(
    (inicial.servicos ?? []).map(item => Number(idDe(item))).filter(Number.isFinite),
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
          servicos: servicosSelecionados,
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

  function alternarServico(servicoId) {
    const sid = Number(servicoId)
    setServicosSelecionados(atual => atual.includes(sid) ? atual.filter(x => x !== sid) : [...atual, sid])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const campos = {
      nome,
      bio,
      capacidade: Number(capacidade) || 1,
      ativo,
    }
    let corpo = campos
    if (foto) {
      corpo = new FormData()
      Object.entries(campos).forEach(([chave, valor]) => {
        if (Array.isArray(valor)) valor.forEach(item => corpo.append(chave, String(item)))
        else corpo.append(chave, String(valor))
      })
      corpo.append('foto', foto)
    }
    setEnviando(true)
    setErro(null)
    setErros({})
    try {
      const resposta = await api(id ? `/recursos/${id}/` : '/recursos/', {
        method: id ? 'PATCH' : 'POST',
        body: corpo,
      })
      const professorId = Number(resposta?.id ?? id)
      if (!professorId) throw new Error('A API não retornou o ID do professor.')

      for (const servico of servicos) {
        const recursosAtuais = (servico.recursos ?? []).map(item => Number(idDe(item)))
        const deveVincular = servicosSelecionados.includes(Number(servico.id))
        const jaVinculado = recursosAtuais.includes(professorId)
        if (deveVincular === jaVinculado) continue
        const recursos = deveVincular
          ? [...recursosAtuais, professorId]
          : recursosAtuais.filter(recursoId => recursoId !== professorId)
        await api(`/servicos/${servico.id}/`, { method: 'PATCH', body: { recursos } })
      }

      adicionarProfessorLocal({
        ...resposta,
        nome: resposta.nome || nome,
        bio: resposta.bio || bio,
        capacidade: resposta.capacidade ?? capacidade,
        ativo: resposta.ativo ?? ativo,
        foto: resposta.foto || fotoAtual,
        servicos: servicosSelecionados,
      })
      navigate('/admin/professores')
    } catch (e) {
      setErro(e.status ? mensagemDeErro(e) : e.message || 'Não foi possível salvar o professor.')
      setErros(e.dados ?? {})
    } finally {
      setEnviando(false)
    }
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
              <Campo label="Disciplinas que ministra" erro={erros.servicos}>
                {servicos.map(servico => (
                  <Form.Check
                    key={servico.id}
                    type="checkbox"
                    id={`servico-${servico.id}`}
                    label={servico.nome}
                    checked={servicosSelecionados.includes(Number(servico.id))}
                    onChange={() => alternarServico(servico.id)}
                  />
                ))}
                {!servicos.length && <div className="text-secondary">Cadastre as disciplinas primeiro.</div>}
              </Campo>
              <Alert variant="info" className="py-2">
                O preço é cadastrado por disciplina, na tela de serviços. A API não possui valor por hora no cadastro do professor.
              </Alert>
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
    async () => {
      const [professor, servicos] = await Promise.all([
        id ? api(`/recursos/${id}/`) : Promise.resolve({}),
        listarTudo('/servicos/'),
      ])
      return { professor, servicos }
    },
    [id],
  )

  return (
    <>
      <h2 className="mb-4">{id ? 'Editar professor' : 'Novo professor'}</h2>
      <Estado carregando={carregando} erro={erro} recarregar={recarregar}>
        {dados && <Formulario key={id ?? 'novo'} inicial={dados.professor} id={id} servicos={dados.servicos} />}
      </Estado>
    </>
  )
}
