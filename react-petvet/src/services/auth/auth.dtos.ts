export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponseDto {
  token: string
  expiresAt: string
  userID: number
  username: string
  email: string
  roleName: string | null
}

export interface UserCreateDto {
  username: string
  email: string
  password: string
  lastName?: string
  firstName?: string
  phone?: string
  roleID: number
  isActive?: boolean
}