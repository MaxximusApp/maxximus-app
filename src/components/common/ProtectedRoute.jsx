import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Loading from './Loading'

const ProtectedRoute = ({ children }) => {
  const { user, loading, profile } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  // Se o usuário não completou o onboarding, redireciona
  if (!profile?.nome && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />
  }

  return children
}

export default ProtectedRoute