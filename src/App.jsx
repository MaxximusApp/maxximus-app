import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Páginas públicas
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'

// Páginas protegidas
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Trilhas from './pages/Trilhas'
import Habitos from './pages/Habitos'
import Perfil from './pages/Perfil'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Rotas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }>
              <Route index element={<Home />} />
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="trilhas" element={<Trilhas />} />
              <Route path="habitos" element={<Habitos />} />
              <Route path="perfil" element={<Perfil />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App