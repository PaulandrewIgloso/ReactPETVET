import { api } from "../apiConnection/api"
import type { PetReadDto, PetCreateDto } from "./pets.dtos"

export const petsService = {
  getAll: () => api.get<PetReadDto[]>("/api/Pets/GetAll"),
  create: (payload: PetCreateDto) => api.post<PetReadDto>("/api/Pets/Create", payload),
}