import { AppShell } from "@/components/layout/Appshell"
import { PawPrint, ClipboardList, CalendarDays, Syringe, } from "lucide-react"

const stats = [
  { label: "Total Pets", value: 5, icon: PawPrint, color: "from-sky-500 to-sky-600" },
  { label: "Records This Month", value: 5, icon: ClipboardList, color: "from-emerald-500 to-emerald-600" },
  { label: "Upcoming Appts", value: 3, icon: CalendarDays, color: "from-amber-500 to-amber-600" },
  { label: "Vaccines Due", value: 1, icon: Syringe, color: "from-orange-500 to-red-500" },
]

const appointments = [
  { date: "24\nJun", pet: "Luna", owner: "Carlos Mendez", note: "Dermatitis follow-up", time: "09:30" },
  { date: "25\nJun", pet: "Titan", owner: "Carlos Mendez", note: "Physiotherapy assessment", time: "14:00" },
  { date: "08\nJul", pet: "Bella", owner: "Maria Santos", note: "Pre-surgical exam (spay)", time: "10:00" },
]

const recentPatients = [
  { pet: "Luna", type: "Dog · Female", breed: "Labrador Retriever", owner: "Carlos Mendez", lastVisit: "2025-06-10", status: "Active" },
  { pet: "Mochi", type: "Cat · Male", breed: "Scottish Fold", owner: "Ana Torres", lastVisit: "2025-05-18", status: "Active" },
]

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6 p-8">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-800 p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Clinic is open · Friday, July 10
          </span>
          <h2 className="mt-4 flex items-center gap-2 text-3xl font-bold text-white">
            Good afternoon!
          </h2>
          <p className="mt-2 text-slate-300">
            You have <span className="font-semibold text-white">3 appointments</span> scheduled today and{" "}
            <span className="font-semibold text-white">1 vaccine due</span>.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-5 text-white shadow-sm`}
              >
                <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
                <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
              </div>
            )
          })}
        </div>

        {/* Appointments + Vaccinations */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border bg-white">
            <div className="flex items-center justify-between border-b bg-emerald-50/50 px-5 py-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <CalendarDays className="h-4 w-4 text-emerald-600" />
                Upcoming Appointments
              </div>
              <span className="text-xs text-slate-500">{appointments.length}</span>
            </div>
            <div className="divide-y">
              {appointments.map((a) => (
                <div key={a.pet + a.date} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="whitespace-pre-line rounded-lg bg-slate-100 px-2 py-1 text-center text-xs font-semibold leading-tight text-slate-700">
                      {a.date}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {a.pet} · <span className="font-normal text-slate-500">{a.owner}</span>
                      </div>
                      <div className="text-xs text-slate-500">{a.note}</div>
                    </div>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-white">
            <div className="flex items-center justify-between border-b bg-amber-50/50 px-5 py-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Syringe className="h-4 w-4 text-amber-600" />
                Vaccination Reminders
              </div>
              <span className="text-xs font-medium text-amber-600">1 due</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-200" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Luna</div>
                  <div className="text-xs text-slate-500">Bordetella</div>
                </div>
              </div>
              <span className="rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                Due Soon
              </span>
            </div>
          </div>
        </div>

        {/* Recent Patients table */}
        <div className="overflow-hidden rounded-2xl border bg-white">
          <div className="flex items-center justify-between border-b bg-emerald-50/50 px-5 py-3">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <PawPrint className="h-4 w-4 text-emerald-600" />
              Recent Patients
            </div>
            <span className="text-xs text-slate-500">{recentPatients.length} total</span>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Pet</th>
                <th className="px-5 py-3 font-medium">Breed</th>
                <th className="px-5 py-3 font-medium">Owner</th>
                <th className="px-5 py-3 font-medium">Last Visit</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentPatients.map((p) => (
                <tr key={p.pet}>
                  <td className="flex items-center gap-3 px-5 py-3">
                    <div className="h-9 w-9 rounded-full bg-slate-200" />
                    <div>
                      <div className="font-semibold text-slate-900">{p.pet}</div>
                      <div className="text-xs text-slate-500">{p.type}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-teal-600">{p.breed}</td>
                  <td className="px-5 py-3 text-slate-700">{p.owner}</td>
                  <td className="px-5 py-3 text-slate-500">{p.lastVisit}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  )
}