import { api } from "../apiConnection/api"
import type { RoleReadDto } from "./roles.dtos"

export const rolesService = {
  getAll: () => api.get<RoleReadDto[]>("/api/Roles/Getall"),
}