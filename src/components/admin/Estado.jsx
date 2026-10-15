import { Alert, Button } from 'react-bootstrap'
import { Carregando } from '../Carregando'

// Mostra carregando, erro com "Tentar de novo" ou o conteúdo.
export function Estado({ carregando, erro, recarregar, children }) {
  if (carregando) return <Carregando />
  if (erro) {
    return (
      <Alert variant="danger" className="d-flex justify-content-between align-items-center">
        <span>{erro}</span>
        <Button variant="outline-danger" size="sm" onClick={recarregar}>Tentar de novo</Button>
      </Alert>
    )
  }
  return children
}
