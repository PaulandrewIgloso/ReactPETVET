import { api } from "../apiConnection/api"
import type { UserReadDto, UserUpdateDto } from "./users.dtos"

export const usersService = {
  getAll: () => api.get<UserReadDto[]>("/api/Users/GetAll"),
  update: (id: number, payload: UserUpdateDto) =>
    api.put<UserReadDto>(`/api/Users/Update${id}`, payload),
}