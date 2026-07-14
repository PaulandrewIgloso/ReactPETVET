import type { ReactNode } from "react"
import type { UserCreateDto } from "./auth.dtos"

export type User = {
  id: number
  username: string
  email: string
  role: string | null
}

export type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (payload: UserCreateDto) => Promise<void>
  logout: () => void
}

export type AuthProviderProps = { children: ReactNode }

export const SELF_REGISTER_ROLE_ID = 2