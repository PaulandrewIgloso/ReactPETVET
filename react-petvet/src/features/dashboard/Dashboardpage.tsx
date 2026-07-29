import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/layout/Appshell"
import { PawPrint, ClipboardList, CalendarDays, Syringe } from "lucide-react"
import { PetAvatar } from "@/components/shared/PetAvatar"
import { petsService } from "@/services/pets/pets.service"
import type { PetReadDto } from "@/services/pets/pets.dtos"
import { medicalRecordsService } from "@/services/medicalRecords/medicalRecords.service"
import type { MedicalRecordReadDto } from "@/services/medicalRecords/medicalRecords.dtos"
import { vaccinationsService } from "@/services/vaccinations/vaccinations.service"
import type { VaccinationReadDto } from "@/services/vaccinations/vaccinations.dtos"
import { appointmentsService } from "@/services/appointments/appointments.service"
import type { AppointmentReadDto } from "@/services/appointments/appointments.dtos"

const avatarColors = ["bg-orange-200", "bg-slate-300", "bg-amber-300", "bg-yellow-200", "bg-slate-500", "bg-emerald-200", "bg-sky-200"]

function colorForId(id: number) {
  return avatarColors[id % avatarColors.length]
}

function daysUntil(dateStr: string): number {
  const due = new Date(dateStr)
  const today = new Date()
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function isSameMonth(dateStr: string): boolean {
  const d = new Date(dateStr)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

function formatDateBox(iso: string) {
  const d = new Date(iso)
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "short" }),
  }
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning!"
  if (hour < 18) return "Good afternoon!"
  return "Good evening!"
}

export default function DashboardPage() {
  const [pets, setPets] = useState<PetReadDto[]>([])
  const [records, setRecords] = useState<MedicalRecordReadDto[]>([])
  const [vaccinations, setVaccinations] = useState<VaccinationReadDto[]>([])
  const [appointments, setAppointments] = useState<AppointmentReadDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  useEffect(() => {
    let cancelled = false
    async function load() {
      setIsLoading(true)
      setLoadError("")
      try {
        const [petsData, recordsData, vaccinationsData, appointmentsData] = await Promise.all([
          petsService.getAll(),
          medicalRecordsService.getAll(),
          vaccinationsService.getAll(),
          appointmentsService.getAll(),
        ])
        if (!cancelled) {
          setPets(petsData)
          setRecords(recordsData)
          setVaccinations(vaccinationsData)
          setAppointments(appointmentsData)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            typeof err === "object" && err && "message" in err
              ? String((err as { message: unknown }).message)
              : "Failed to load dashboard data."
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
  }, [])

  const recordsThisMonth = useMemo(
    () => records.filter((r) => isSameMonth(r.visitDate)).length,
    [records]
  )

  const upcomingAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.status === "Scheduled" && new Date(a.appointmentDateTime) >= new Date())
        .sort((a, b) => a.appointmentDateTime.localeCompare(b.appointmentDateTime)),
    [appointments]
  )

  const dueVaccinations = useMemo(
    () =>
      vaccinations
        .filter((v) => v.nextDueDate && daysUntil(v.nextDueDate) <= 60)
        .sort((a, b) => (a.nextDueDate ?? "").localeCompare(b.nextDueDate ?? "")),
    [vaccinations]
  )

  const ownerNameByPetId = useMemo(() => {
    const map = new Map<number, string>()
    pets.forEach((p) => map.set(p.petID, p.ownerName ?? "—"))
    return map
  }, [pets])

  const hasPhotoByPetId = useMemo(() => {
    const map = new Map<number, boolean>()
    pets.forEach((p) => map.set(p.petID, !!p.photoPath))
    return map
  }, [pets])

  const lastVisitByPetId = useMemo(() => {
    const map = new Map<number, string>()
    records.forEach((r) => {
      const current = map.get(r.petID)
      if (!current || r.visitDate > current) map.set(r.petID, r.visitDate)
    })
    return map
  }, [records])

  const recentPatients = useMemo(
    () => [...pets].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [pets]
  )

  const stats = [
    { label: "Total Pets", value: pets.length, icon: PawPrint, color: "from-sky-500 to-sky-600" },
    { label: "Records This Month", value: recordsThisMonth, icon: ClipboardList, color: "from-emerald-500 to-emerald-600" },
    { label: "Upcoming Appts", value: upcomingAppointments.length, icon: CalendarDays, color: "from-amber-500 to-amber-600" },
    { label: "Vaccines Due", value: dueVaccinations.length, icon: Syringe, color: "from-orange-500 to-red-500" },
  ]

  const todayLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-8">
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </AppShell>
    )
  }

  if (loadError) {
    return (
      <AppShell>
        <div className="p-8">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6 p-8">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-800 p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {todayLabel}
          </span>
          <h2 className="mt-4 flex items-center gap-2 text-3xl font-bold text-white">
            {getGreeting()}
          </h2>
          <p className="mt-2 text-slate-300">
            You have{" "}
            <span className="font-semibold text-white">
              {upcomingAppointments.length} appointment{upcomingAppointments.length === 1 ? "" : "s"}
            </span>{" "}
            scheduled and{" "}
            <span className="font-semibold text-white">
              {dueVaccinations.length} vaccine{dueVaccinations.length === 1 ? "" : "s"} due
            </span>
            .
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
              <span className="text-xs text-slate-500">{upcomingAppointments.length}</span>
            </div>
            <div className="divide-y">
              {upcomingAppointments.slice(0, 5).map((a) => {
                const { day, month } = formatDateBox(a.appointmentDateTime)
                return (
                  <div key={a.appointmentID} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-100 px-2 py-1 text-center text-xs font-semibold leading-tight text-slate-700">
                        <div>{day}</div>
                        <div>{month}</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {a.petName ?? "—"} ·{" "}
                          <span className="font-normal text-slate-500">
                            {ownerNameByPetId.get(a.petID) ?? "—"}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">{a.reason ?? "General visit"}</div>
                      </div>
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      {formatTime(a.appointmentDateTime)}
                    </span>
                  </div>
                )
              })}
              {upcomingAppointments.length === 0 && (
                <p className="px-5 py-6 text-sm text-slate-500">No upcoming appointments.</p>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-white">
            <div className="flex items-center justify-between border-b bg-amber-50/50 px-5 py-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Syringe className="h-4 w-4 text-amber-600" />
                Vaccination Reminders
              </div>
              <span className="text-xs font-medium text-amber-600">{dueVaccinations.length} due</span>
            </div>
            <div className="divide-y">
              {dueVaccinations.slice(0, 5).map((v) => {
                const overdue = v.nextDueDate ? daysUntil(v.nextDueDate) < 0 : false
                return (
                  <div key={v.vaccinationID} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <PetAvatar
                        petID={v.petID}
                        hasPhoto={hasPhotoByPetId.get(v.petID) ?? false}
                        colorClassName={colorForId(v.petID)}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{v.petName ?? "—"}</div>
                        <div className="text-xs text-slate-500">{v.vaccineType}</div>
                      </div>
                    </div>
                    <span
                      className={`rounded-md border px-2 py-1 text-xs font-medium ${
                        overdue
                          ? "border-red-300 bg-red-50 text-red-700"
                          : "border-amber-300 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {overdue ? "Overdue" : "Due Soon"}
                    </span>
                  </div>
                )
              })}
              {dueVaccinations.length === 0 && (
                <p className="px-5 py-6 text-sm text-slate-500">No vaccines due soon.</p>
              )}
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
            <span className="text-xs text-slate-500">{recentPatients.length} shown</span>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Pet</th>
                <th className="px-5 py-3 font-medium">Breed</th>
                <th className="px-5 py-3 font-medium">Owner</th>
                <th className="px-5 py-3 font-medium">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentPatients.map((p) => (
                <tr key={p.petID}>
                  <td className="flex items-center gap-3 px-5 py-3">
                    <PetAvatar
                      petID={p.petID}
                      hasPhoto={!!p.photoPath}
                      colorClassName={colorForId(p.petID)}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500">
                        {p.species}
                        {p.gender ? ` · ${p.gender}` : ""}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-teal-600">{p.breed || "—"}</td>
                  <td className="px-5 py-3 text-slate-700">{p.ownerName ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-500">
                    {lastVisitByPetId.get(p.petID)?.slice(0, 10) ?? "No visits yet"}
                  </td>
                </tr>
              ))}
              {recentPatients.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-sm text-slate-500">
                    No pets yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  )
}