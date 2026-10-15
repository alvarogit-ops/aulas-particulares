import { useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CAMPOS, idDe, listarTudo } from '../../api/admin.js'
import { api, mensagemDeErro } from '../../api/cliente.js'
import { Campo } from '../../components/admin/Campo'
import { Estado } from '../../components/admin/Estado'
import { Foto } from '../../components/Foto'
import { useCarregar } from '../../hooks/useCarregar'

function Formulario({ inicial, id, professores }) {
  const navigate = useNavigate()
  const [nome, setNome] = useState(inicial.nome ?? '')
  const [descricao, setDescricao] = useState(inicial.descricao ?? '')
  const [duracao, setDuracao] = useState(inicial[CAMPOS.duracao] ?? inicial.duracao ?? 60)
  const [preco, setPreco] = useState(inicial.preco ?? '')
  const [ativo, setAtivo] = useState(inicial.ativo ?? true)
  const [selecionados, setSelecionados] = useState(
    (inicial[CAMPOS.recursosDoServico] ?? []).map(idDe).map(Number),
  )
  const [imagem, setImagem] = useState(null)
  const [imagemAtual, setImagemAtual] = useState(inicial.imagem ?? null)
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)

  async function enviar(corpo, aoConcluir) {
    setEnviando(true)
    setErro(null)
    setErros({})
    try {
      const resposta = await api(id ? `/servicos/${id}/` : '/servicos/', { method: id ? 'PATCH' : 'POST', body: corpo })
      aoConcluir(resposta)
    } catch (e) {
      setErro(mensagemDeErro(e))
      setErros(e.dados ?? {})
    } finally {
      setEnviando(false)
    }
  }

  function alternar(pid) {
    setSelecionados(atual => (atual.includes(pid) ? atual.filter(x => x !== pid) : [...atual, pid]))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const formulario = new FormData()
    formulario.append('nome', nome)
    formulario.append('descricao', descricao)
    formulario.append(CAMPOS.duracao, duracao)
    formulario.append('preco', preco)
    formulario.append('ativo', String(ativo))
    selecionados.forEach(pid => formulario.append(CAMPOS.recursosDoServico, pid))
    if (imagem) formulario.append('imagem', imagem)
    enviar(formulario, () => navigate('/admin/servicos'))
  }

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <Card className="shadow-sm">
          <Card.Body>
            {erro && <Alert variant="danger">{erro}</Alert>}
            <Form onSubmit={handleSubmit}>
              <div className="text-center mb-3">
                <Foto src={imagemAtual} icone="bi-journal-text" tamanho={96} />
              </div>
              <Campo label="Nome" erro={erros.nome}>
                <Form.Control value={nome} onChange={e => setNome(e.target.value)} isInvalid={!!erros.nome} required />
              </Campo>
              <Campo label="Descrição" erro={erros.descricao}>
                <Form.Control as="textarea" rows={3} value={descricao} onChange={e => setDescricao(e.target.value)} isInvalid={!!erros.descricao} />
              </Campo>
              <Row>
                <Col sm={6}>
                  <Campo label="Duração (minutos)" erro={erros[CAMPOS.duracao]}>
                    <Form.Control type="number" min={1} value={duracao} onChange={e => setDuracao(e.target.value)} isInvalid={!!erros[CAMPOS.duracao]} required />
                  </Campo>
                </Col>
                <Col sm={6}>
                  <Campo label="Preço (R$)" erro={erros.preco}>
                    <Form.Control type="number" min={0} step="0.01" value={preco} onChange={e => setPreco(e.target.value)} isInvalid={!!erros.preco} required />
                  </Campo>
                </Col>
              </Row>
              <Campo label="Imagem" erro={erros.imagem}>
                <Form.Control type="file" accept="image/*" onChange={e => setImagem(e.target.files[0])} isInvalid={!!erros.imagem} />
              </Campo>
              <Campo label="Professores que oferecem" erro={erros[CAMPOS.recursosDoServico]}>
                {professores.length ? (
                  professores.map(p => (
                    <Form.Check
                      key={p.id}
                      type="checkbox"
                      id={`prof-${p.id}`}
                      label={p.ativo === false ? `${p.nome} (inativo)` : p.nome}
                      checked={selecionados.includes(p.id)}
                      onChange={() => alternar(p.id)}
                    />
                  ))
                ) : (
                  <div className="text-secondary">Cadastre professores primeiro.</div>
                )}
              </Campo>
              <Form.Check type="switch" id="ativo" label="Ativa (aparece para agendamento)" checked={ativo} onChange={e => setAtivo(e.target.checked)} className="mb-3" />
              <div className="d-flex gap-2 flex-wrap">
                <Button type="submit" disabled={enviando}>Salvar</Button>
                <Button as={Link} to="/admin/servicos" variant="outline-secondary">Cancelar</Button>
                {id && imagemAtual && (
                  <Button variant="outline-secondary" disabled={enviando} onClick={() => enviar({ imagem: null }, r => setImagemAtual(r.imagem ?? null))}>
                    Remover imagem
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

export function ServicoForm() {
  const { id } = useParams()
  const { dados, carregando, erro, recarregar } = useCarregar(async () => {
    const [servico, professores] = await Promise.all([
      id ? api(`/servicos/${id}/`) : Promise.resolve({}),
      listarTudo('/recursos/'),
    ])
    return { servico, professores }
  }, [id])

  return (
    <>
      <h2 className="mb-4">{id ? 'Editar disciplina' : 'Nova disciplina'}</h2>
      <Estado carregando={carregando} erro={erro} recarregar={recarregar}>
        {dados && <Formulario key={id ?? 'novo'} inicial={dados.servico} id={id} professores={dados.professores} />}
      </Estado>
    </>
  )
}
