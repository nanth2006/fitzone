import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Guards admin-only pages (eg Admin Dashboard)
export default function AdminRoute({ children }) {
  const { token, role } = useAuth()
  if (!token || role !== 'admin') return <Navigate to="/admin/login" replace />
  return children
}
