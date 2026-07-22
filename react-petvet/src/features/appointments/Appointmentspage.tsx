import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/layout/Appshell"
import { Plus, X, CheckCircle, Ban, UserX } from "lucide-react"
import { appointmentsService } from "@/services/appointments/appointments.service"
import type { AppointmentReadDto, AppointmentCreateDto, AppointmentUpdateDto } from "@/services/appointments/appointments.dtos"
import { petsService } from "@/services/pets/pets.service"
import type { PetReadDto, PetCreateDto } from "@/services/pets/pets.dtos"
import { usersService } from "@/services/users/users.service"
import type { UserReadDto } from "@/services/users/users.dtos"
import { useAuth } from "@/services/auth/auth.service"

const avatarColors = ["bg-orange-200", "bg-slate-300", "bg-amber-300", "bg-yellow-200", "bg-slate-500", "bg-emerald-200", "bg-sky-200"]

function colorForId(id: number) {
  return avatarColors[id % avatarColors.length]
}

function userDisplayName(user: UserReadDto): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ")
  return full || user.username
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

const emptyForm = {
  petID: "",
  date: "",
  time: "09:00",
  reason: "",
}

const emptyNewPetForm = {
  name: "",
  species: "Dog",
  breed: "",
  dateOfBirth: "",
  gender: "M",
  color: "",
  microchipID: "",
  ownerUserID: "",
}

export default function AppointmentsPage() {
  const { isAdmin } = useAuth()

  const [appointments, setAppointments] = useState<AppointmentReadDto[]>([])
  const [pets, setPets] = useState<PetReadDto[]>([])
  const [users, setUsers] = useState<UserReadDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  const [activeTab, setActiveTab] = useState<"Scheduled" | "Completed" | "Cancelled" | "NoShow">("Scheduled")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const [isAddingNewPet, setIsAddingNewPet] = useState(false)
  const [newPetForm, setNewPetForm] = useState(emptyNewPetForm)
  const [newPetPhoto, setNewPetPhoto] = useState<File | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setIsLoading(true)
      setLoadError("")
      try {
        const [appointmentsData, petsData] = await Promise.all([
          appointmentsService.getAll(),
          petsService.getAll(),
        ])
        if (!cancelled) {
          setAppointments(appointmentsData)
          setPets(petsData)
        }
        // Vet list is only needed to populate the "assign a vet" dropdown;
        // PetOwner may not have access to it, so don't let that block the page.
        try {
          const usersData = await usersService.getAll()
          if (!cancelled) setUsers(usersData)
        } catch {
          if (!cancelled) setUsers([])
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            typeof err === "object" && err && "message" in err
              ? String((err as { message: unknown }).message)
              : "Failed to load appointments."
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

  const ownerNameByPetId = useMemo(() => {
    const map = new Map<number, string>()
    pets.forEach((p) => map.set(p.petID, p.ownerName ?? "—"))
    return map
  }, [pets])

  const veterinarianOptions = useMemo(
    () => users.filter((u) => u.roleName === "Admin"),
    [users]
  )

  const ownerOptions = useMemo(
    () => users.filter((u) => u.roleName === "PetOwner"),
    [users]
  )

  const visibleAppointments = appointments
    .filter((a) => a.status === activeTab)
    .sort((a, b) => a.appointmentDateTime.localeCompare(b.appointmentDateTime))

  const closeModal = () => {
    setIsModalOpen(false)
    setForm(emptyForm)
    setSaveError("")
    setIsAddingNewPet(false)
    setNewPetForm(emptyNewPetForm)
    setNewPetPhoto(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isAddingNewPet) {
      if (!newPetForm.name.trim() || !form.date || !form.time) return
      if (isAdmin && !newPetForm.ownerUserID) return
    } else {
      if (!form.petID || !form.date || !form.time) return
    }

    setIsSaving(true)
    setSaveError("")
    try {
      let petID = form.petID ? Number(form.petID) : null

      if (isAddingNewPet) {
        const petPayload: PetCreateDto = {
          name: newPetForm.name.trim(),
          species: newPetForm.species,
          breed: newPetForm.breed.trim() || undefined,
          dateOfBirth: newPetForm.dateOfBirth || null,
          gender: newPetForm.gender || null,
          color: newPetForm.color.trim() || undefined,
          microchipID: newPetForm.microchipID.trim() || undefined,
          ownerUserID: isAdmin ? Number(newPetForm.ownerUserID) : undefined,
        }
        const newPet = await petsService.create(petPayload, newPetPhoto)
        setPets((prev) => [newPet, ...prev])
        petID = newPet.petID
      }

      if (!petID) return

      const payload: AppointmentCreateDto = {
        petID,
        appointmentDateTime: `${form.date}T${form.time}:00`,
        reason: form.reason.trim() || undefined,
      }
      const created = await appointmentsService.create(payload)
      setAppointments((prev) => [...prev, created])
      setActiveTab("Scheduled")
      closeModal()
    } catch (err) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message: unknown }).message)
          : isAddingNewPet
          ? "Could not save the new pet."
          : "Could not book appointment."
      setSaveError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateStatus = async (
    a: AppointmentReadDto,
    status: AppointmentUpdateDto["status"]
  ) => {
    setUpdatingId(a.appointmentID)
    try {
      const payload: AppointmentUpdateDto = {
        appointmentDateTime: a.appointmentDateTime,
        reason: a.reason ?? undefined,
        status,
        veterinarianUserID: a.veterinarianUserID,
        notes: a.notes ?? undefined,
      }
      const updated = await appointmentsService.update(a.appointmentID, payload)
      setAppointments((prev) =>
        prev.map((item) => (item.appointmentID === updated.appointmentID ? updated : item))
      )
    } catch (err) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message: unknown }).message)
          : "Could not update appointment."
      alert(message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleAssignVeterinarian = async (a: AppointmentReadDto, veterinarianUserID: number | null) => {
    setUpdatingId(a.appointmentID)
    try {
      const payload: AppointmentUpdateDto = {
        appointmentDateTime: a.appointmentDateTime,
        reason: a.reason ?? undefined,
        status: a.status,
        veterinarianUserID,
        notes: a.notes ?? undefined,
      }
      const updated = await appointmentsService.update(a.appointmentID, payload)
      setAppointments((prev) =>
        prev.map((item) => (item.appointmentID === updated.appointmentID ? updated : item))
      )
    } catch (err) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message: unknown }).message)
          : "Could not assign veterinarian."
      alert(message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <AppShell>
      <div className="space-y-4 p-8">
        {/* Tabs + Book button */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 rounded-lg border border-slate-200 bg-white p-1">
            {(["Scheduled", "Completed", "Cancelled", "NoShow"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab === "NoShow" ? "No-Show" : tab}
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

        {isLoading && <p className="text-sm text-slate-500">Loading appointments...</p>}

        {loadError && !isLoading && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        )}

        {/* Appointment cards */}
        {!isLoading && !loadError && (
          <div className="space-y-3">
            {visibleAppointments.map((a) => {
              const { day, month } = formatDateBox(a.appointmentDateTime)
              return (
                <div
                  key={a.appointmentID}
                  className="flex items-center justify-between rounded-2xl border bg-white px-5 py-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex w-14 shrink-0 flex-col items-center rounded-lg bg-teal-50 py-1.5">
                      <span className="text-lg font-bold leading-tight text-teal-700">{day}</span>
                      <span className="text-xs font-medium uppercase text-teal-500">{month}</span>
                    </div>
                    <div className={`h-10 w-10 shrink-0 rounded-full ${colorForId(a.petID)}`} />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {a.petName ?? "—"} <span className="font-normal text-slate-400">—</span>{" "}
                        <span className="font-normal text-teal-600">{ownerNameByPetId.get(a.petID) ?? "—"}</span>
                      </div>
                      <div className="text-xs text-slate-500">{a.reason ?? "General visit"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-900">{formatTime(a.appointmentDateTime)}</div>
                      {isAdmin ? (
                        <select
                          value={a.veterinarianUserID ?? ""}
                          disabled={updatingId === a.appointmentID}
                          onChange={(e) =>
                            handleAssignVeterinarian(a, e.target.value ? Number(e.target.value) : null)
                          }
                          className="mt-0.5 h-7 rounded-md border border-slate-200 bg-slate-50 px-1.5 text-xs text-teal-700 outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-60"
                        >
                          <option value="">Unassigned</option>
                          {veterinarianOptions.map((u) => (
                            <option key={u.userID} value={u.userID}>{userDisplayName(u)}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-xs text-teal-600">{a.veterinarianName ?? "Unassigned"}</div>
                      )}
                    </div>
                    <span
                      className={`rounded-md border px-3 py-1 text-xs font-medium ${
                        a.status === "Scheduled"
                          ? "border-sky-200 bg-sky-50 text-sky-700"
                          : a.status === "Completed"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : a.status === "Cancelled"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {a.status === "NoShow" ? "No-Show" : a.status}
                    </span>
                    {isAdmin && a.status === "Scheduled" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(a, "Completed")}
                          disabled={updatingId === a.appointmentID}
                          title="Mark Completed"
                          className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Complete
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(a, "NoShow")}
                          disabled={updatingId === a.appointmentID}
                          title="Mark No-Show"
                          className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-60"
                        >
                          <UserX className="h-3.5 w-3.5" />
                          No-Show
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(a, "Cancelled")}
                          disabled={updatingId === a.appointmentID}
                          title="Cancel Appointment"
                          className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {visibleAppointments.length === 0 && (
              <p className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
                No {activeTab === "NoShow" ? "no-show" : activeTab.toLowerCase()} appointments.
              </p>
            )}
          </div>
        )}
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
              {saveError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {saveError}
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pet
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewPet((prev) => !prev)}
                    className="text-xs font-semibold text-teal-700 hover:underline"
                  >
                    {isAddingNewPet ? "← Select existing pet" : "+ Add New Pet"}
                  </button>
                </div>

                {isAddingNewPet ? (
                  <div className="space-y-4 rounded-lg border border-teal-100 bg-teal-50/40 p-4">
                    <input
                      type="text"
                      required
                      value={newPetForm.name}
                      onChange={(e) => setNewPetForm({ ...newPetForm, name: e.target.value })}
                      placeholder="Pet name"
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={newPetForm.species}
                        onChange={(e) => setNewPetForm({ ...newPetForm, species: e.target.value })}
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                      >
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        type="text"
                        value={newPetForm.breed}
                        onChange={(e) => setNewPetForm({ ...newPetForm, breed: e.target.value })}
                        placeholder="Breed"
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={newPetForm.dateOfBirth}
                        onChange={(e) => setNewPetForm({ ...newPetForm, dateOfBirth: e.target.value })}
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                      />
                      <select
                        value={newPetForm.gender}
                        onChange={(e) => setNewPetForm({ ...newPetForm, gender: e.target.value })}
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="N">Neutered</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={newPetForm.color}
                        onChange={(e) => setNewPetForm({ ...newPetForm, color: e.target.value })}
                        placeholder="Color"
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                      />
                      <input
                        type="text"
                        value={newPetForm.microchipID}
                        onChange={(e) => setNewPetForm({ ...newPetForm, microchipID: e.target.value })}
                        placeholder="Microchip ID (optional)"
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                      />
                    </div>

                    {isAdmin && (
                      <select
                        required
                        value={newPetForm.ownerUserID}
                        onChange={(e) => setNewPetForm({ ...newPetForm, ownerUserID: e.target.value })}
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                      >
                        <option value="">— Select owner —</option>
                        {ownerOptions.map((u) => (
                          <option key={u.userID} value={u.userID}>{userDisplayName(u)}</option>
                        ))}
                      </select>
                    )}

                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewPetPhoto(e.target.files?.[0] ?? null)}
                        className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-teal-700 hover:file:bg-teal-200"
                      />
                      {newPetPhoto && <p className="mt-1 text-xs text-slate-500">{newPetPhoto.name}</p>}
                    </div>
                  </div>
                ) : (
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
                )}
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
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}