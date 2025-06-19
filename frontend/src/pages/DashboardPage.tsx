import React from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate("/login")
    return null
  }

  return <Outlet />
}

export default DashboardPage