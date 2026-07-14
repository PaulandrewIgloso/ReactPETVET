import { useState } from "react"
import { AppShell } from "@/components/layout/Appshell"
import { Plus, Eye, X } from "lucide-react"

interface MedicalRecord {
  id: string
  date: string
  pet: string
  avatarColor: string
  diagnosis: string
  treatment: string
  notes: string
  vet: string
  prescriptions: string[]
}

const initialRecords: MedicalRecord[] = [
  { id: "1", date: "2025-06-10", pet: "Luna", avatarColor: "bg-orange-200", diagnosis: "Mild dermatitis, secondary bacterial infection", treatment: "Topical antibiotic cream, medicated shampoo 2x/week", notes: "", vet: "Dr. Sarah Reyes", prescriptions: ["Cephalexin 250mg – BID x 10 days", "Medicated shampoo"] },
  { id: "2", date: "2025-03-22", pet: "Luna", avatarColor: "bg-orange-200", diagnosis: "Annual wellness check — no issues found", treatment: "Preventive care, heartworm test negative", notes: "", vet: "Dr. James Park", prescriptions: ["Heartgard Plus – monthly"] },
  { id: "3", date: "2025-05-18", pet: "Mochi", avatarColor: "bg-slate-300", diagnosis: "Upper respiratory infection (viral)", treatment: "Supportive care, hydration, appetite stimulant", notes: "", vet: "Dr. Sarah Reyes", prescriptions: ["Mirtazapine 1.88mg – q72h", "Sub-Q fluids"] },
  { id: "4", date: "2025-06-01", pet: "Titan", avatarColor: "bg-amber-300", diagnosis: "Cruciate ligament strain, left stifle", treatment: "NSAIDs, restricted activity 4 weeks, physio referral", notes: "", vet: "Dr. James Park", prescriptions: ["Carprofen 75mg – BID x 14 days", "Physio referral"] },
  { id: "5", date: "2025-06-15", pet: "Bella", avatarColor: "bg-yellow-200", diagnosis: "Routine puppy exam, 12 months", treatment: "Spay scheduled for July 2025", notes: "", vet: "Dr. Sarah Reyes", prescriptions: ["None"] },
]

const petOptions = ["Luna", "Mochi", "Titan", "Bella", "Neko"]
const vetOptions = ["Dr. Sarah Reyes", "Dr. James Park"]

const emptyForm = {
  pet: "",
  date: new Date().toISOString().slice(0, 10),
  diagnosis: "",
  treatment: "",
  notes: "",
  vet: vetOptions[0],
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>(initialRecords)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [prescriptions, setPrescriptions] = useState<string[]>([])
  const [rxDraft, setRxDraft] = useState("")

  const closeModal = () => {
    setIsModalOpen(false)
    setForm(emptyForm)
    setPrescriptions([])
    setRxDraft("")
  }

  const addPrescription = () => {
    if (!rxDraft.trim()) return
    setPrescriptions((prev) => [...prev, rxDraft.trim()])
    setRxDraft("")
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.pet || !form.date || !form.diagnosis.trim() || !form.vet) return

    const petAvatar =
      initialRecords.find((r) => r.pet === form.pet)?.avatarColor ?? "bg-slate-300"

    const newRecord: MedicalRecord = {
      id: crypto.randomUUID(),
      date: form.date,
      pet: form.pet,
      avatarColor: petAvatar,
      diagnosis: form.diagnosis.trim(),
      treatment: form.treatment.trim() || "—",
      notes: form.notes.trim(),
      vet: form.vet,
      prescriptions: prescriptions.length ? prescriptions : ["None"],
    }

    setRecords((prev) =>
      [...prev, newRecord].sort((a, b) => b.date.localeCompare(a.date))
    )
    closeModal()
  }

  return (
    <AppShell>
      <div className="space-y-4 p-8">
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-green-500 px-4 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Record
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Pet</th>
                <th className="px-6 py-3 font-medium">Diagnosis</th>
                <th className="px-6 py-3 font-medium">Vet</th>
                <th className="px-6 py-3 font-medium">Prescriptions</th>
                <th className="w-10 px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map((r) => (
                <>
                  <tr key={r.id} className="align-top">
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-500">
                      {r.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-7 w-7 shrink-0 rounded-full ${r.avatarColor}`} />
                        <span className="font-medium text-slate-900">{r.pet}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{r.diagnosis}</div>
                      <div className="text-xs text-teal-600">{r.treatment}</div>
                    </td>
                    <td className="px-6 py-4 text-teal-700">{r.vet}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {r.prescriptions.length === 1 && r.prescriptions[0] === "None"
                        ? "0 rx"
                        : `${r.prescriptions.length} rx`}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                        className="text-teal-600 hover:text-teal-800"
                        aria-label="View record details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  {expandedId === r.id && (
                    <tr className="bg-slate-50">
                      <td colSpan={6} className="space-y-1 px-6 py-4 text-sm text-slate-600">
                        {r.notes && (
                          <div>
                            <span className="font-semibold text-slate-800">Notes: </span>
                            {r.notes}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-slate-800">Prescriptions: </span>
                          {r.prescriptions.join(", ")}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>

          {records.length === 0 && (
            <p className="p-6 text-sm text-slate-500">No records yet.</p>
          )}
        </div>
      </div>

      {/* Add Medical Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl scrollbar-hide">
            <div className="sticky top-0 flex items-center justify-between bg-gradient-to-r from-slate-900 to-teal-800 px-6 py-4">
              <h2 className="font-semibold text-white">Add Medical Record</h2>
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
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Visit Date
                </label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Diagnosis
                </label>
                <input
                  type="text"
                  required
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  placeholder="e.g. Upper respiratory infection"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Treatment
                </label>
                <textarea
                  value={form.treatment}
                  onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                  placeholder="e.g. Supportive care, antibiotics..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional observations..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Attending Vet
                </label>
                <select
                  required
                  value={form.vet}
                  onChange={(e) => setForm({ ...form, vet: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                >
                  {vetOptions.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Prescriptions
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={rxDraft}
                    onChange={(e) => setRxDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addPrescription()
                      }
                    }}
                    placeholder="e.g. Amoxicillin 250mg – BID x 7 days"
                    className="h-11 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                  <button
                    type="button"
                    onClick={addPrescription}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-teal-700 to-emerald-500 text-white hover:opacity-90"
                    aria-label="Add prescription"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {prescriptions.length > 0 && (
                  <ul className="space-y-1 pt-1">
                    {prescriptions.map((rx, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-teal-50 px-3 py-1.5 text-xs text-teal-800"
                      >
                        {rx}
                        <button
                          type="button"
                          onClick={() => setPrescriptions((prev) => prev.filter((_, idx) => idx !== i))}
                          className="text-teal-500 hover:text-teal-800"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
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