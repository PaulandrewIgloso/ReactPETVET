import { api } from "../apiConnection/api"
import type { MedicalRecordReadDto, MedicalRecordCreateDto } from "./medicalRecords.dtos"

export const medicalRecordsService = {
  getAll: () => api.get<MedicalRecordReadDto[]>("/api/MedicalRecords/GetAll"),
  create: (payload: MedicalRecordCreateDto) =>
    api.post<MedicalRecordReadDto>("/api/MedicalRecords/Create", payload),
}