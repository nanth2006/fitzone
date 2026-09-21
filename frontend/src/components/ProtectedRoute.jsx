import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Guards member-only pages (eg Profile)
export default function ProtectedRoute({ children }) {
  const { token, role } = useAuth()
  if (!token || role !== 'user') return <Navigate to="/login" replace />
  return children
}
