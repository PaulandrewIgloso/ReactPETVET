import { api } from "../apiConnection/api"
import type { VaccinationReadDto, VaccinationCreateDto } from "./vaccinations.dtos"

export const vaccinationsService = {
  getAll: () => api.get<VaccinationReadDto[]>("/api/Vaccinations/GetAll"),
  create: (payload: VaccinationCreateDto) =>
    api.post<VaccinationReadDto>("/api/Vaccinations/Create", payload),
}