export const MATERIAS = [
  { id: 'matematica', nome: 'Matemática' },
  { id: 'portugues', nome: 'Português' },
  { id: 'ingles', nome: 'Inglês' },
  { id: 'fisica', nome: 'Física' },
  { id: 'quimica', nome: 'Química' },
  { id: 'biologia', nome: 'Biologia' },
]

export function nomeDaMateria(materiaId) {
  const materia = MATERIAS.find(item => String(item.id) === String(materiaId))
  return materia ? materia.nome : 'Matéria'
}

export function nomesDasMaterias(materias = []) {
  return materias
    .map(item => nomeDaMateria(item?.id ?? item))
    .filter(Boolean)
}
