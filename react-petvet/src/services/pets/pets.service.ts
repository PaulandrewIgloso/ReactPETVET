import { api } from "../apiConnection/api"
import type { PetReadDto, PetCreateDto } from "./pets.dtos"

function buildPetFormData(payload: PetCreateDto, photo?: File | null): FormData {
  const formData = new FormData()
  formData.append("Name", payload.name)
  formData.append("Species", payload.species)
  if (payload.breed) formData.append("Breed", payload.breed)
  if (payload.dateOfBirth) formData.append("DateOfBirth", payload.dateOfBirth)
  if (payload.gender) formData.append("Gender", payload.gender)
  if (payload.color) formData.append("Color", payload.color)
  if (payload.microchipID) formData.append("MicrochipID", payload.microchipID)
  if (payload.ownerUserID) formData.append("OwnerUserID", String(payload.ownerUserID))
  if (photo) formData.append("Photo", photo)
  return formData
}

export const petsService = {
  getAll: () => api.get<PetReadDto[]>("/api/Pets/GetAll"),
  create: (payload: PetCreateDto, photo?: File | null) =>
    api.postForm<PetReadDto>("/api/Pets/Create", buildPetFormData(payload, photo)),
  getPhotoBlob: (petID: number) => api.getBlob(`/api/Pets/Photo${petID}`),
}