import { useEffect, useState } from "react"
import { AppShell } from "@/components/layout/Appshell"
import { Upload, Download, FileText, X } from "lucide-react"
import { documentsService } from "@/services/documents/documents.service"
import type { DocumentsReadDto } from "@/services/documents/documents.dtos"
import { petsService } from "@/services/pets/pets.service"
import type { PetReadDto } from "@/services/pets/pets.dtos"
import { useAuth } from "@/services/auth/auth.service"

const avatarColors = ["bg-orange-200", "bg-slate-300", "bg-amber-300", "bg-yellow-200", "bg-slate-500", "bg-emerald-200", "bg-sky-200"]

function colorForId(id: number) {
  return avatarColors[id % avatarColors.length]
}

const docTypeOptions = ["Lab Result", "Radiology", "Clinical Report"]

const typeStyles: Record<string, string> = {
  "Lab Result": "bg-sky-100 text-sky-600",
  "Radiology": "bg-orange-100 text-orange-600",
  "Clinical Report": "bg-emerald-100 text-emerald-600",
}

const emptyForm = {
  petID: "",
  documentType: docTypeOptions[0],
  description: "",
  file: null as File | null,
}

export default function DocumentsPage() {
  const { isAdmin } = useAuth()

  const [documents, setDocuments] = useState<DocumentsReadDto[]>([])
  const [pets, setPets] = useState<PetReadDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setIsLoading(true)
      setLoadError("")
      try {
        const requests: [Promise<DocumentsReadDto[]>, Promise<PetReadDto[]> | Promise<PetReadDto[]>] = [
          documentsService.getAll(),
          isAdmin ? petsService.getAll() : Promise.resolve([]),
        ]
        const [documentsData, petsData] = await Promise.all(requests)
        if (!cancelled) {
          setDocuments(documentsData)
          setPets(petsData)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            typeof err === "object" && err && "message" in err
              ? String((err as { message: unknown }).message)
              : "Failed to load documents."
          setLoadError(message)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [isAdmin])

  const closeModal = () => {
    setIsModalOpen(false)
    setForm(emptyForm)
    setSaveError("")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.petID || !form.file) return

    setIsSaving(true)
    setSaveError("")
    try {
      const formData = new FormData()
      formData.append("PetID", form.petID)
      formData.append("File", form.file)
      if (form.description.trim()) formData.append("Description", form.description.trim())
      formData.append("DocumentType", form.documentType)

      const created = await documentsService.upload(formData)
      setDocuments((prev) => [created, ...prev])
      closeModal()
    } catch (err) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message: unknown }).message)
          : "Could not upload document."
      setSaveError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async (doc: DocumentsReadDto) => {
    setDownloadingId(doc.documentID)
    try {
      await documentsService.download(doc.documentID, doc.fileName)
    } catch {
      alert("Could not download this file.")
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <AppShell>
      <div className="space-y-4 p-8">
        {isAdmin && (
          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-green-500 px-4 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </button>
          </div>
        )}

        {isLoading && <p className="text-sm text-slate-500">Loading documents...</p>}

        {loadError && !isLoading && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        )}

        {!isLoading && !loadError && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div key={doc.documentID} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeStyles[doc.documentType ?? ""] ?? "bg-slate-100 text-slate-600"}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">{doc.description || doc.fileName}</div>
                    <div className="text-xs text-teal-600">{doc.documentType ?? "Document"}</div>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                  <div className={`h-5 w-5 shrink-0 rounded-full ${colorForId(doc.petID)}`} />
                  <span>{doc.petName ?? "—"} · {doc.uploadedAt.slice(0, 10)}</span>
                </div>

                <button
                  onClick={() => handleDownload(doc)}
                  disabled={downloadingId === doc.documentID}
                  className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-teal-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  <Download className="h-3.5 w-3.5" />
                  {downloadingId === doc.documentID ? "Downloading..." : "Download"}
                </button>
              </div>
            ))}

            {documents.length === 0 && (
              <p className="text-sm text-slate-500">No documents uploaded yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl scrollbar-hide">
            <div className="sticky top-0 flex items-center justify-between bg-gradient-to-r from-slate-900 to-teal-800 px-6 py-4">
              <h2 className="font-semibold text-white">Upload Document</h2>
              <button onClick={closeModal} className="text-white/80 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 p-6">
              {saveError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {saveError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pet
                </label>
                <select
                  required
                  value={form.petID}
                  onChange={(e) => setForm({ ...form, petID: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                >
                  <option value="">— Select pet —</option>
                  {pets.map((p) => (
                    <option key={p.petID} value={p.petID}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Document Type
                </label>
                <select
                  value={form.documentType}
                  onChange={(e) => setForm({ ...form, documentType: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                >
                  {docTypeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Blood test results – June 2025"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Select File
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-teal-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-teal-700"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-11 flex-1 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-11 flex-1 rounded-lg bg-gradient-to-r from-teal-700 to-emerald-500 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
                >
                  {isSaving ? "Uploading..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}