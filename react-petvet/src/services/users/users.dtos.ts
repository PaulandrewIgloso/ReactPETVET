export interface UserReadDto {
  userID: number
  username: string
  email: string
  lastName: string | null
  firstName: string | null
  roleName: string | null
}