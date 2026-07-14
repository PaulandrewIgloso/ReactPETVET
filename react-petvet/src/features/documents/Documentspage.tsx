import { useState } from "react"
import { AppShell } from "@/components/layout/Appshell"
import { Upload, Download, FileText, X } from "lucide-react"

interface Document {
  id: string
  title: string
  type: "Lab Result" | "Radiology" | "Clinical Report"
  pet: string
  avatarColor: string
  date: string
  sizeLabel: string
}

const initialDocuments: Document[] = [
  { id: "1", title: "Skin culture results – June 2025", type: "Lab Result", pet: "Luna", avatarColor: "bg-orange-200", date: "2025-06-13", sizeLabel: "1.2 MB" },
  { id: "2", title: "Left stifle X-ray – June 2025", type: "Radiology", pet: "Titan", avatarColor: "bg-amber-300", date: "2025-06-01", sizeLabel: "3.8 MB" },
  { id: "3", title: "Annual blood panel – March 2025", type: "Lab Result", pet: "Luna", avatarColor: "bg-orange-200", date: "2025-03-22", sizeLabel: "0.4 MB" },
  { id: "4", title: "12-month wellness report", type: "Clinical Report", pet: "Bella", avatarColor: "bg-yellow-200", date: "2025-06-15", sizeLabel: "0.8 MB" },
]

const petOptions = [
  { name: "Luna", avatarColor: "bg-orange-200" },
  { name: "Mochi", avatarColor: "bg-slate-300" },
  { name: "Titan", avatarColor: "bg-amber-300" },
  { name: "Bella", avatarColor: "bg-yellow-200" },
  { name: "Neko", avatarColor: "bg-slate-500" },
]
const docTypes: Document["type"][] = ["Lab Result", "Radiology", "Clinical Report"]

const typeStyles: Record<Document["type"], string> = {
  "Lab Result": "bg-sky-100 text-sky-600",
  "Radiology": "bg-orange-100 text-orange-600",
  "Clinical Report": "bg-emerald-100 text-emerald-600",
}

const emptyForm = {
  pet: "",
  type: "Lab Result" as Document["type"],
  description: "",
  file: null as File | null,
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const closeModal = () => {
    setIsModalOpen(false)
    setForm(emptyForm)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.pet || !form.description.trim()) return

    const petMatch = petOptions.find((p) => p.name === form.pet)

    const newDoc: Document = {
      id: crypto.randomUUID(),
      title: form.description.trim(),
      type: form.type,
      pet: form.pet,
      avatarColor: petMatch?.avatarColor ?? "bg-slate-300",
      date: new Date().toISOString().slice(0, 10),
      sizeLabel: form.file ? formatSize(form.file.size) : "—",
    }

    setDocuments((prev) => [newDoc, ...prev])
    closeModal()
  }

  const handleDownload = (doc: Document) => {
    // No backend yet — this is a placeholder until real file storage is wired up.
    console.log("TODO: download", doc.id)
  }

  return (
    <AppShell>
      <div className="space-y-4 p-8">
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-green-500 px-4 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div key={doc.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeStyles[doc.type]}`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">{doc.title}</div>
                  <div className="text-xs text-teal-600">{doc.type}</div>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                <div className={`h-5 w-5 shrink-0 rounded-full ${doc.avatarColor}`} />
                <span>{doc.pet} · {doc.date} · {doc.sizeLabel}</span>
              </div>

              <button
                onClick={() => handleDownload(doc)}
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-teal-700 hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          ))}
        </div>

        {documents.length === 0 && (
          <p className="text-sm text-slate-500">No documents uploaded yet.</p>
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
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pet
                </label>
                <select
                  required
                  value={form.pet}
                  onChange={(e) => setForm({ ...form, pet: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                >
                  <option value="">— Select pet —</option>
                  {petOptions.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Document Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as Document["type"] })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                >
                  {docTypes.map((t) => (
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
                  required
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
                  className="h-11 flex-1 rounded-lg bg-gradient-to-r from-teal-700 to-emerald-500 text-sm font-semibold text-white shadow-sm hover:opacity-90"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}