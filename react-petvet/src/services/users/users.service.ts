import { api } from "../apiConnection/api"
import type { UserReadDto } from "./users.dtos"

export const usersService = {
  getAll: () => api.get<UserReadDto[]>("/api/Users/GetAll"),
}