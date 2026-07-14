import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"
import { api } from "./api"

export type User = {
  id: number
  fullName: string
  email: string
  role: string
}

type LoginResponse = {
  token: string
  user: User
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token") ?? null
  )

  const login = async (email: string, password: string) => {
    const data = await api.post<LoginResponse>("/api/auth/login", {
      email,
      password,
    })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem("token", data.token)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Hook to access authentication helpers inside components. */
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
