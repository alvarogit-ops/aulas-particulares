import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthProvider'
import { Admin } from './components/Admin'
import { Layout } from './components/Layout'
import { Publica } from './components/Publica'
import { Agendar } from './pages/Agendar'
import { Aulas } from './pages/Aulas'
import { Cadastro } from './pages/Cadastro'
import { Entrada } from './pages/Entradas'
import { EsqueciSenha } from './pages/EsqueciSenha'
import { Inicio } from './pages/Inicio'
import { Login } from './pages/Login'
import { Perfil } from './pages/Perfil'
import { Professores } from './pages/Professores'
import { Agenda } from './pages/admin/Agenda'
import { Avaliacoes } from './pages/admin/Avaliacoes'
import { Confirmar } from './pages/admin/Confirmar'
import { DetalheAula } from './pages/admin/DetalheAula'
import { Horarios } from './pages/admin/Horarios'
import { Negocio } from './pages/admin/Negocio'
import { ProfessorForm } from './pages/admin/ProfessorForm'
import { Professores as ProfessoresAdmin } from './pages/admin/Professores'
import { ServicoForm } from './pages/admin/ServicoForm'
import { Servicos } from './pages/admin/Servicos'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Publica />}>
            <Route index element={<Entrada />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          </Route>
          <Route element={<Layout />}>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/agendar" element={<Agendar />} />
            <Route path="/aulas" element={<Aulas />} />
            <Route path="/professores" element={<Professores />} />
            <Route path="/professores-materias" element={<Professores />} />
            <Route path="/professires-materiais" element={<Professores />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route element={<Admin />}>
              <Route path="/admin/agenda" element={<Agenda />} />
              <Route path="/admin/confirmar" element={<Confirmar />} />
              <Route path="/admin/aulas/:id" element={<DetalheAula />} />
              <Route path="/admin/negocio" element={<Negocio />} />
              <Route path="/admin/professores" element={<ProfessoresAdmin />} />
              <Route path="/admin/professores/novo" element={<ProfessorForm />} />
              <Route path="/admin/professores/:id" element={<ProfessorForm />} />
              <Route path="/admin/professores/:id/horarios" element={<Horarios />} />
              <Route path="/admin/servicos" element={<Servicos />} />
              <Route path="/admin/servicos/novo" element={<ServicoForm />} />
              <Route path="/admin/servicos/:id" element={<ServicoForm />} />
              <Route path="/admin/avaliacoes" element={<Avaliacoes />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
