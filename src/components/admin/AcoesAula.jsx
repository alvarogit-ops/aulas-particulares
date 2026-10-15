import { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { api, mensagemDeErro } from '../../api/cliente.js'
import { useAuth } from '../../AuthContext'

const ACOES = [
  { chave: 'confirmar', texto: 'Confirmar', variante: 'success', permissao: 'api.confirmar_agendamento', status: ['solicitado'] },
  { chave: 'concluir', texto: 'Concluir', variante: 'primary', permissao: 'api.concluir_agendamento', status: ['confirmado'] },
  { chave: 'cancelar', texto: 'Cancelar', variante: 'outline-danger', permissao: 'api.cancelar_agendamento', status: ['solicitado', 'confirmado'] },
]

// Botões de confirmar, concluir e cancelar, guiados por permissão e status.
export function AcoesAula({ aula, aoMudar, tamanho }) {
  const { pode } = useAuth()
  const [enviando, setEnviando] = useState(null)
  const [erro, setErro] = useState(null)

  async function executar(acao) {
    if (acao.chave === 'cancelar' && !window.confirm('Cancelar esta aula?')) return
    setEnviando(acao.chave)
    setErro(null)
    try {
      const atualizada = await api(`/agendamentos/${aula.id}/${acao.chave}/`, { method: 'POST' })
      aoMudar?.(atualizada)
    } catch (e) {
      setErro(mensagemDeErro(e))
    } finally {
      setEnviando(null)
    }
  }

  const visiveis = ACOES.filter(a => pode(a.permissao) && a.status.includes(aula.status))
  if (!visiveis.length && !erro) return null

  return (
    <>
      <div className="d-flex gap-2 flex-wrap">
        {visiveis.map(a => (
          <Button key={a.chave} variant={a.variante} size={tamanho} disabled={enviando !== null} onClick={() => executar(a)}>
            {a.texto}
          </Button>
        ))}
      </div>
      {erro && <Alert variant="danger" className="mt-2 mb-0 py-2">{erro}</Alert>}
    </>
  )
}
