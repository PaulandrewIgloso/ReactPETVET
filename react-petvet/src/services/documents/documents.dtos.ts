export interface DocumentsReadDto {
  documentID: number
  petID: number
  petName: string | null
  fileName: string
  filePath: string
  fileType: string | null
  description: string | null
  documentType: string | null
  uploadedByUserID: number
  uploadedByName: string | null
  uploadedAt: string
}