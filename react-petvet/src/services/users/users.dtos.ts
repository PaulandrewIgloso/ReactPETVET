export interface UserReadDto {
  userID: number
  username: string
  email: string
  lastName: string | null
  firstName: string | null
  phone: string | null
  roleID: number
  roleName: string | null
  isActive: boolean
  createdAt: string
}

export interface UserUpdateDto {
  username: string
  email: string
  lastName?: string
  firstName?: string
  phone?: string
  roleID: number
  isActive: boolean
}