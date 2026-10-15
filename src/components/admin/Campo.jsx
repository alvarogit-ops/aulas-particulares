import { Form } from 'react-bootstrap'

// Grupo de formulário com rótulo e mensagem de erro de campo vinda da API.
export function Campo({ label, erro, children, className = 'mb-3' }) {
  const mensagem = Array.isArray(erro) ? erro.join(' ') : erro
  return (
    <Form.Group className={className}>
      {label && <Form.Label>{label}</Form.Label>}
      {children}
      {mensagem && <div className="invalid-feedback d-block">{mensagem}</div>}
    </Form.Group>
  )
}
