import { api } from "../apiConnection/api"
import type { AppointmentReadDto, AppointmentCreateDto, AppointmentUpdateDto } from "./appointments.dtos"

export const appointmentsService = {
  getAll: () => api.get<AppointmentReadDto[]>("/api/Appointments/GetAll"),
  create: (payload: AppointmentCreateDto) =>
    api.post<AppointmentReadDto>("/api/Appointments/Create", payload),
  // Note: backend route has no slash before the id — "Update{id}", not "Update/{id}"
  update: (id: number, payload: AppointmentUpdateDto) =>
    api.put<AppointmentReadDto>(`/api/Appointments/Update${id}`, payload),
}