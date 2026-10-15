import { useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { api, mensagemDeErro } from '../../api/cliente.js'
import { useAuth } from '../../AuthContext'
import { Campo } from '../../components/admin/Campo'
import { Estado } from '../../components/admin/Estado'
import { Foto } from '../../components/Foto'
import { useCarregar } from '../../hooks/useCarregar'

function Formulario({ inicial }) {
  const { setUsuario } = useAuth()
  const [nome, setNome] = useState(inicial.nome ?? '')
  const [descricao, setDescricao] = useState(inicial.descricao ?? '')
  const [logo, setLogo] = useState(null)
  const [logoAtual, setLogoAtual] = useState(inicial.logo ?? null)
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})
  const [salvo, setSalvo] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function salvar(corpo) {
    setEnviando(true)
    setErro(null)
    setErros({})
    setSalvo(false)
    try {
      const org = await api('/organizacao/', { method: 'PATCH', body: corpo })
      setLogoAtual(org.logo ?? null)
      setUsuario(u => (u ? { ...u, organizacao: { ...u.organizacao, ...org } } : u))
      setSalvo(true)
    } catch (e) {
      setErro(mensagemDeErro(e))
      setErros(e.dados ?? {})
    } finally {
      setEnviando(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const formulario = new FormData()
    formulario.append('nome', nome)
    formulario.append('descricao', descricao)
    if (logo) formulario.append('logo', logo)
    salvar(formulario)
  }

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <Card className="shadow-sm">
          <Card.Body>
            {erro && <Alert variant="danger">{erro}</Alert>}
            {salvo && <Alert variant="success">Dados salvos.</Alert>}
            <Form onSubmit={handleSubmit}>
              <div className="text-center mb-3">
                <Foto src={logoAtual} icone="bi-mortarboard" tamanho={96} />
              </div>
              <Campo label="Nome" erro={erros.nome}>
                <Form.Control value={nome} onChange={e => setNome(e.target.value)} isInvalid={!!erros.nome} required />
              </Campo>
              <Campo label="Descrição" erro={erros.descricao}>
                <Form.Control as="textarea" rows={4} value={descricao} onChange={e => setDescricao(e.target.value)} isInvalid={!!erros.descricao} />
              </Campo>
              <Campo label="Logo" erro={erros.logo}>
                <Form.Control type="file" accept="image/*" onChange={e => setLogo(e.target.files[0])} isInvalid={!!erros.logo} />
              </Campo>
              <div className="d-flex gap-2">
                <Button type="submit" disabled={enviando}>Salvar</Button>
                {logoAtual && (
                  <Button variant="outline-secondary" disabled={enviando} onClick={() => salvar({ logo: null })}>
                    Remover logo
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

export function Negocio() {
  const { dados, carregando, erro, recarregar } = useCarregar(() => api('/organizacao/'), [])
  return (
    <>
      <h2 className="mb-4">Dados do negócio</h2>
      <Estado carregando={carregando} erro={erro} recarregar={recarregar}>
        {dados && <Formulario inicial={dados} />}
      </Estado>
    </>
  )
}
