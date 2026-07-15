export interface PetReadDto {
  petID: number
  name: string
  breed: string | null
  species: string
  dateOfBirth: string | null
  gender: string | null
  color: string | null
  microchipID: string | null
  photoPath: string | null
  ownerUserID: number
  ownerName: string | null
  createdAt: string
  updatedAt: string
}

export interface PetCreateDto {
  name: string
  breed?: string
  species: string
  dateOfBirth?: string | null
  gender?: string | null
  color?: string
  microchipID?: string
  ownerUserID: number
}