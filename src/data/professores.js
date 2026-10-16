import { api } from '../api/cliente.js'

export const STORAGE_KEY = 'aulas-particulares-professores'

export function listarProfessoresLocais() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function salvarProfessoresLocais(professores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(professores))
  return professores
}

export function adicionarProfessorLocal(professor) {
  const atual = listarProfessoresLocais()
  const id = professor.id ?? `local-${Date.now()}`
  const proximo = [
    ...atual.filter(item => String(item.id) !== String(id)),
    { ...professor, id, ativo: professor.ativo ?? true, materias: professor.materias ?? [] },
  ]
  return salvarProfessoresLocais(proximo)
}

export async function carregarProfessoresAtivos() {
  try {
    const dados = await api('/recursos/?ativo=true')
    const lista = Array.isArray(dados) ? dados : []
    if (lista.length) {
      salvarProfessoresLocais(lista)
      return lista
    }
  } catch {
    // ignora e usa localStorage como fallback
  }

  return listarProfessoresLocais()
}
