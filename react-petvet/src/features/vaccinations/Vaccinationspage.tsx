import { useState } from "react"
import { AppShell } from "@/components/layout/Appshell"
import { Plus, X } from "lucide-react"

interface Vaccination {
  id: string
  pet: string
  avatarColor: string
  vaccine: string
  dateGiven: string
  nextDue: string
  batchNo: string
  vet: string
}

const initialVaccinations: Vaccination[] = [
  { id: "1", pet: "Luna", avatarColor: "bg-orange-200", vaccine: "Rabies", dateGiven: "2025-03-22", nextDue: "2026-03-22", batchNo: "RAB-2025-0441", vet: "Dr. James Park" },
  { id: "2", pet: "Luna", avatarColor: "bg-orange-200", vaccine: "DHPP (Distemper/Parvo)", dateGiven: "2025-03-22", nextDue: "2026-03-22", batchNo: "DHPP-2025-1128", vet: "Dr. James Park" },
  { id: "3", pet: "Luna", avatarColor: "bg-orange-200", vaccine: "Bordetella", dateGiven: "2024-10-05", nextDue: "2025-10-05", batchNo: "BOR-2024-0872", vet: "Dr. Sarah Reyes" },
  { id: "4", pet: "Mochi", avatarColor: "bg-slate-300", vaccine: "FVRCP (Feline 3-in-1)", dateGiven: "2025-05-01", nextDue: "2026-05-01", batchNo: "FVR-2025-0503", vet: "Dr. Sarah Reyes" },
  { id: "5", pet: "Titan", avatarColor: "bg-amber-300", vaccine: "Rabies", dateGiven: "2024-12-10", nextDue: "2025-12-10", batchNo: "RAB-2024-1901", vet: "Dr. James Park" },
  { id: "6", pet: "Bella", avatarColor: "bg-yellow-200", vaccine: "Rabies", dateGiven: "2025-06-15", nextDue: "2026-06-15", batchNo: "RAB-2025-0819", vet: "Dr. Sarah Reyes" },
  { id: "7", pet: "Bella", avatarColor: "bg-yellow-200", vaccine: "DHPP (Distemper/Parvo)", dateGiven: "2025-06-15", nextDue: "2026-06-15", batchNo: "DHPP-2025-2201", vet: "Dr. Sarah Reyes" },
]

const petOptions = [
  { name: "Luna", avatarColor: "bg-orange-200" },
  { name: "Mochi", avatarColor: "bg-slate-300" },
  { name: "Titan", avatarColor: "bg-amber-300" },
  { name: "Bella", avatarColor: "bg-yellow-200" },
  { name: "Neko", avatarColor: "bg-slate-500" },
]
const vetOptions = ["Dr. Sarah Reyes", "Dr. James Park"]

const emptyForm = {
  pet: "",
  vaccine: "",
  dateGiven: new Date().toISOString().slice(0, 10),
  nextDue: "",
  batchNo: "",
  vet: vetOptions[0],
}

function getStatus(nextDue: string): { label: string; className: string } {
  const due = new Date(nextDue)
  const today = new Date()
  const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilDue < 0) {
    return { label: "Overdue", className: "border-red-300 bg-red-50 text-red-700" }
  }
  if (daysUntilDue <= 60) {
    return { label: "Due Soon", className: "border-amber-300 bg-amber-50 text-amber-700" }
  }
  return { label: "Current", className: "border-emerald-300 bg-emerald-50 text-emerald-700" }
}

export default function Vaccinationspage() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(initialVaccinations)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const closeModal = () => {
    setIsModalOpen(false)
    setForm(emptyForm)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.pet || !form.vaccine.trim() || !form.dateGiven || !form.vet) return

    const petMatch = petOptions.find((p) => p.name === form.pet)

    const newVaccination: Vaccination = {
      id: crypto.randomUUID(),
      pet: form.pet,
      avatarColor: petMatch?.avatarColor ?? "bg-slate-300",
      vaccine: form.vaccine.trim(),
      dateGiven: form.dateGiven,
      nextDue: form.nextDue || form.dateGiven,
      batchNo: form.batchNo.trim() || "—",
      vet: form.vet,
    }

    setVaccinations((prev) =>
      [...prev, newVaccination].sort((a, b) => a.pet.localeCompare(b.pet))
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
            Record Vaccination
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 font-medium">Pet</th>
                <th className="px-6 py-3 font-medium">Vaccine</th>
                <th className="px-6 py-3 font-medium">Date Given</th>
                <th className="px-6 py-3 font-medium">Batch No.</th>
                <th className="px-6 py-3 font-medium">Next Due</th>
                <th className="px-6 py-3 font-medium">Vet</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {vaccinations.map((v) => {
                const status = getStatus(v.nextDue)
                return (
                  <tr key={v.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-7 w-7 shrink-0 rounded-full ${v.avatarColor}`} />
                        <span className="font-medium text-slate-900">{v.pet}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-900">{v.vaccine}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-500">
                      {v.dateGiven}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-teal-600">
                      {v.batchNo}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-500">
                      {v.nextDue}
                    </td>
                    <td className="px-6 py-4 text-teal-700">{v.vet}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-md border px-2 py-1 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {vaccinations.length === 0 && (
            <p className="p-6 text-sm text-slate-500">No vaccination records yet.</p>
          )}
        </div>
      </div>

      {/* Record Vaccination Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl scrollbar-hide">
            <div className="sticky top-0 flex items-center justify-between bg-gradient-to-r from-slate-900 to-teal-800 px-6 py-4">
              <h2 className="font-semibold text-white">Record Vaccination</h2>
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
                  Vaccine Name
                </label>
                <input
                  type="text"
                  required
                  value={form.vaccine}
                  onChange={(e) => setForm({ ...form, vaccine: e.target.value })}
                  placeholder="e.g. Rabies, DHPP, FVRCP"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date Given
                  </label>
                  <input
                    type="date"
                    required
                    value={form.dateGiven}
                    onChange={(e) => setForm({ ...form, dateGiven: e.target.value })}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Next Due Date
                  </label>
                  <input
                    type="date"
                    value={form.nextDue}
                    onChange={(e) => setForm({ ...form, nextDue: e.target.value })}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Batch Number
                </label>
                <input
                  type="text"
                  value={form.batchNo}
                  onChange={(e) => setForm({ ...form, batchNo: e.target.value })}
                  placeholder="e.g. RAB-2025-0441"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
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