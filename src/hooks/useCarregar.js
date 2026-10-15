import { useCallback, useEffect, useState } from 'react'
import { mensagemDeErro } from '../api/cliente.js'

// Executa uma busca ao montar (e quando deps mudam) e expõe carregando, erro e recarregar.
export function useCarregar(funcao, deps = []) {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro(null)
    funcao()
      .then(d => ativo && setDados(d))
      .catch(e => ativo && setErro(mensagemDeErro(e)))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [...deps, tentativa])

  const recarregar = useCallback(() => setTentativa(t => t + 1), [])
  return { dados, setDados, carregando, erro, recarregar }
}
