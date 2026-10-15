import { listarTudo } from '../../api/admin.js'
import { AulaItem } from '../../components/admin/AulaItem'
import { Estado } from '../../components/admin/Estado'
import { useCarregar } from '../../hooks/useCarregar'

export function Confirmar() {
  const { dados, setDados, carregando, erro, recarregar } = useCarregar(async () => {
    const lista = await listarTudo('/agendamentos/?status=solicitado')
    return lista.sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
  }, [])

  // Depois de confirmar ou cancelar, o pedido sai da lista.
  function atualizar(aula) {
    setDados(lista => lista.filter(item => item.id !== aula.id || aula.status === 'solicitado'))
  }

  return (
    <>
      <h2 className="mb-4">A confirmar</h2>
      <Estado carregando={carregando} erro={erro} recarregar={recarregar}>
        {dados?.length ? (
          dados.map(aula => <AulaItem key={aula.id} aula={aula} aoMudar={atualizar} mostrarData />)
        ) : (
          <p className="text-secondary">Nenhum pedido para confirmar.</p>
        )}
      </Estado>
    </>
  )
}
