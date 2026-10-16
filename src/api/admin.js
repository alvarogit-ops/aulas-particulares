import { api } from './cliente.js'

// Segue a paginação da API e devolve todos os itens.
export async function listarTudo(caminho) {
  let proximo = caminho
  const itens = []
  while (proximo) {
    const pagina = await api(proximo)
    if (Array.isArray(pagina)) return pagina
    itens.push(...(pagina.results ?? []))
    proximo = pagina.next
  }
  return itens
}

// A API pode devolver lista simples ou objeto paginado.
export function itensDe(dados) {
  return Array.isArray(dados) ? dados : dados?.results ?? []
}

export const STATUS = {
  solicitado: { texto: 'Solicitada', cor: 'warning' },
  confirmado: { texto: 'Confirmada', cor: 'primary' },
  concluido: { texto: 'Concluída', cor: 'success' },
  cancelado: { texto: 'Cancelada', cor: 'secondary' },
}

// Nomes dos campos enviados à API. Se o Swagger usar outros nomes, ajuste só aqui.
export const CAMPOS = {
  duracao: 'duracao_min',
  diaSemana: 'dia_semana',
  horaInicio: 'hora_inicio',
  horaFim: 'hora_fim',
  recursosDoServico: 'recursos',
}

export const DIAS =['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

export function hojeISO() {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

export function formatarDataHora(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export function formatarHora(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function formatarPreco(valor) {
  return Number(valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Os campos de nome podem vir planos ou aninhados, conforme a API.
export function nomeDe(item, campo) {
  return item?.[`${campo}_nome`] ?? item?.[campo]?.nome ?? (typeof item?.[campo] === 'string' ? item[campo] : '')
}

export function idDe(valor) {
  return valor && typeof valor === 'object' ? valor.id : valor
}
