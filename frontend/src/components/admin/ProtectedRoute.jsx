import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (user === null || (user.role !== 'recruiter' && user.role !== 'admin')) {
      navigate("/", { state: { from: location }, replace: true })
    }
  }, [user, navigate, location])

  if (user === null || (user.role !== 'recruiter' && user.role !== 'admin')) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute