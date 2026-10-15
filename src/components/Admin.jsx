import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthContext'

// Só deixa passar quem tem permissão de administrador.
export function Admin() {
  const { pode } = useAuth()
  if (!pode('api.change_organizacao')) {
    return <Navigate to="/inicio" replace />
  }
  return <Outlet />
}
