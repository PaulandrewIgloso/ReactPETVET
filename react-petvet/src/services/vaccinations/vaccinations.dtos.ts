export interface VaccinationReadDto {
  vaccinationID: number
  petID: number
  petName: string | null
  vaccineType: string
  vaccinationDate: string
  batchNumber: string | null
  nextDueDate: string | null
  administeredByUserID: number
  administeredByName: string | null
  notes: string | null
  createdAt: string
}

export interface VaccinationCreateDto {
  petID: number
  vaccineType: string
  vaccinationDate: string
  batchNumber?: string
  nextDueDate?: string | null
  notes?: string
}