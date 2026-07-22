import { api, apiClient } from "../apiConnection/api"
import type { DocumentsReadDto } from "./documents.dtos"

export const documentsService = {
  getAll: () => api.get<DocumentsReadDto[]>("/api/Documents/GetAll"),

  upload: (formData: FormData) =>
    api.postForm<DocumentsReadDto>("/api/Documents/Create", formData),

  download: async (id: number, fileName: string) => {
    const response = await apiClient.get(`/api/Documents/Download${id}`, {
      responseType: "blob",
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}