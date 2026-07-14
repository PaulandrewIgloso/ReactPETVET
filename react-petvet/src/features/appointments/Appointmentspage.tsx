import { useState } from "react"
import { AppShell } from "@/components/layout/Appshell"
import { Plus, X } from "lucide-react"

interface Appointment {
  id: string
  pet: string
  avatarColor: string
  owner: string
  reason: string
  date: string // YYYY-MM-DD
  time: string // e.g. "09:30"
  vet: string
  status: "Scheduled" | "Completed"
}

const initialAppointments: Appointment[] = [
  { id: "1", pet: "Luna", avatarColor: "bg-orange-200", owner: "Carlos Mendez", reason: "Dermatitis follow-up", date: "2026-06-24", time: "09:30", vet: "Dr. Sarah Reyes", status: "Scheduled" },
  { id: "2", pet: "Titan", avatarColor: "bg-amber-300", owner: "Carlos Mendez", reason: "Physiotherapy assessment", date: "2026-06-25", time: "14:00", vet: "Dr. James Park", status: "Scheduled" },
  { id: "3", pet: "Bella", avatarColor: "bg-yellow-200", owner: "Maria Santos", reason: "Pre-surgical exam (spay)", date: "2026-07-08", time: "10:00", vet: "Dr. Sarah Reyes", status: "Scheduled" },
  { id: "4", pet: "Mochi", avatarColor: "bg-slate-300", owner: "Ana Torres", reason: "URI follow-up check", date: "2026-06-10", time: "11:00", vet: "Dr. Sarah Reyes", status: "Completed" },
  { id: "5", pet: "Neko", avatarColor: "bg-slate-500", owner: "Ana Torres", reason: "Annual wellness exam", date: "2026-06-18", time: "15:30", vet: "Dr. James Park", status: "Completed" },
  { id: "6", pet: "Luna", avatarColor: "bg-orange-200", owner: "Carlos Mendez", reason: "Initial dermatitis consult", date: "2026-06-10", time: "09:00", vet: "Dr. Sarah Reyes", status: "Completed" },
]

const petOptions = [
  { name: "Luna", avatarColor: "bg-orange-200", owner: "Carlos Mendez" },
  { name: "Mochi", avatarColor: "bg-slate-300", owner: "Ana Torres" },
  { name: "Titan", avatarColor: "bg-amber-300", owner: "Carlos Mendez" },
  { name: "Bella", avatarColor: "bg-yellow-200", owner: "Maria Santos" },
  { name: "Neko", avatarColor: "bg-slate-500", owner: "Ana Torres" },
]
const vetOptions = ["Dr. Sarah Reyes", "Dr. James Park"]

const emptyForm = {
  pet: "",
  date: "",
  time: "09:00",
  reason: "",
  vet: vetOptions[0],
}

function formatDateBox(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "short" }),
  }
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [activeTab, setActiveTab] = useState<"Scheduled" | "Completed">("Scheduled")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const visibleAppointments = appointments
    .filter((a) => a.status === activeTab)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

  const closeModal = () => {
    setIsModalOpen(false)
    setForm(emptyForm)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.pet || !form.date || !form.time || !form.vet) return

    const petMatch = petOptions.find((p) => p.name === form.pet)

    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      pet: form.pet,
      avatarColor: petMatch?.avatarColor ?? "bg-slate-300",
      owner: petMatch?.owner ?? "—",
      reason: form.reason.trim() || "General visit",
      date: form.date,
      time: form.time,
      vet: form.vet,
      status: "Scheduled",
    }

    setAppointments((prev) => [...prev, newAppointment])
    setActiveTab("Scheduled")
    closeModal()
  }

  return (
    <AppShell>
      <div className="space-y-4 p-8">
        {/* Tabs + Book button */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 rounded-lg border border-slate-200 bg-white p-1">
            {(["Scheduled", "Completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-green-500 px-4 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Book Appointment
          </button>
        </div>

        {/* Appointment cards */}
        <div className="space-y-3">
          {visibleAppointments.map((a) => {
            const { day, month } = formatDateBox(a.date)
            return (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-2xl border bg-white px-5 py-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex w-14 shrink-0 flex-col items-center rounded-lg bg-teal-50 py-1.5">
                    <span className="text-lg font-bold leading-tight text-teal-700">{day}</span>
                    <span className="text-xs font-medium uppercase text-teal-500">{month}</span>
                  </div>
                  <div className={`h-10 w-10 shrink-0 rounded-full ${a.avatarColor}`} />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {a.pet} <span className="font-normal text-slate-400">—</span>{" "}
                      <span className="font-normal text-teal-600">{a.owner}</span>
                    </div>
                    <div className="text-xs text-slate-500">{a.reason}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">{a.time}</div>
                    <div className="text-xs text-teal-600">{a.vet}</div>
                  </div>
                  <span
                    className={`rounded-md border px-3 py-1 text-xs font-medium ${
                      a.status === "Scheduled"
                        ? "border-sky-200 bg-sky-50 text-sky-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              </div>
            )
          })}

          {visibleAppointments.length === 0 && (
            <p className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
              No {activeTab.toLowerCase()} appointments.
            </p>
          )}
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl scrollbar-hide">
            <div className="sticky top-0 flex items-center justify-between bg-gradient-to-r from-slate-900 to-teal-800 px-6 py-4">
              <h2 className="font-semibold text-white">Book Appointment</h2>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
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
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reason for Visit
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="e.g. Annual wellness check, follow-up..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Veterinarian
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