export interface MedicalRecordReadDto {
  recordID: number
  petID: number
  petName: string | null
  visitDate: string
  diagnosis: string | null
  treatment: string | null
  notes: string | null
  prescriptions: string | null
  createdAt: string
  updatedAt: string | null
}

export interface MedicalRecordCreateDto {
  petID: number
  visitDate: string
  diagnosis?: string
  treatment?: string
  notes?: string
  prescriptions?: string
}