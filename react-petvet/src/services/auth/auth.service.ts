import { createContext, useContext, useState, createElement } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../apiConnection/api"
import type { LoginDto, AuthResponseDto, UserCreateDto } from "./auth.dtos"
import type { AuthContextType, AuthProviderProps, User } from "./auth.types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function mapAuthResponseToUser(dto: AuthResponseDto): User {
  return { id: dto.userID, username: dto.username, email: dto.email, role: dto.roleName }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token") ?? null
  )

  const navigate = useNavigate()

  const login = async (email: string, password: string) => {
    const payload: LoginDto = { email, password }
    const data = await api.post<AuthResponseDto>("/Auth/login", payload)
    setToken(data.token)
    setUser(mapAuthResponseToUser(data))
  localStorage.setItem("token", data.token)
    }

const register = async (payload: UserCreateDto) => {
  await api.post<AuthResponseDto>("/Auth/register", payload)
    }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    navigate("/login", { replace: true })
  }

  return createElement(
    AuthContext.Provider,
    { value: { user, token, login, register, logout } },
    children
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}