import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, allowedRole }) {
  const savedUser = localStorage.getItem("user")

  if (!savedUser) {
    return <Navigate to="/" replace />
  }

  const user = JSON.parse(savedUser)

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute