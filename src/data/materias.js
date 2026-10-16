export function servicosDoProfessor(professor, servicos = []) {
  const idsDoProfessor = new Set((professor?.servicos ?? []).map(item => String(item?.id ?? item)))
  return servicos.filter(servico => (
    idsDoProfessor.has(String(servico.id)) ||
    (servico.recursos ?? []).some(recurso => String(recurso?.id ?? recurso) === String(professor?.id))
  ))
}
