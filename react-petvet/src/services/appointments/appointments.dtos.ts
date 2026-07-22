export interface AppointmentReadDto {
  appointmentID: number
  petID: number
  petName: string | null
  appointmentDateTime: string
  reason: string | null
  status: "Scheduled" | "Completed" | "Cancelled" | "NoShow"
  notes: string | null
  bookedByName: string | null
  veterinarianUserID: number | null
  veterinarianName: string | null
  createdAt: string
  updatedAt: string
}

export interface AppointmentCreateDto {
  petID: number
  appointmentDateTime: string
  reason?: string
  veterinarianUserID?: number | null
  notes?: string
}

export interface AppointmentUpdateDto {
  appointmentDateTime: string
  reason?: string
  status: "Scheduled" | "Completed" | "Cancelled" | "NoShow"
  veterinarianUserID?: number | null
  notes?: string
}