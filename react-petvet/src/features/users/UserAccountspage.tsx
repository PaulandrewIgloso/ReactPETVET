import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/layout/Appshell"
import { Plus, X, Pencil, UserX, UserCheck } from "lucide-react"
import { usersService } from "@/services/users/users.service"
import type { UserReadDto, UserUpdateDto } from "@/services/users/users.dtos"
import { rolesService } from "@/services/roles/roles.service"
import type { RoleReadDto } from "@/services/roles/roles.dtos"
import { petsService } from "@/services/pets/pets.service"
import type { PetReadDto } from "@/services/pets/pets.dtos"
import { useAuth } from "@/services/auth/auth.service"
import type { UserCreateDto } from "@/services/auth/auth.dtos"

const avatarColors = ["bg-teal-600", "bg-emerald-500", "bg-sky-500", "bg-indigo-600", "bg-green-600", "bg-amber-500"]

function colorForId(id: number) {
  return avatarColors[id % avatarColors.length]
}

function getInitials(user: UserReadDto) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function displayName(user: UserReadDto) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username
}

const emptyForm = {
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  roleID: "",
  password: "",
}

const emptyEditForm = {
  userID: 0,
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  roleID: "",
  isActive: true,
}

export default function UserAccountsPage() {
  const { register, user: currentUser } = useAuth()

  const [users, setUsers] = useState<UserReadDto[]>([])
  const [roles, setRoles] = useState<RoleReadDto[]>([])
  const [pets, setPets] = useState<PetReadDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState(emptyEditForm)
  const [isEditSaving, setIsEditSaving] = useState(false)
  const [editError, setEditError] = useState("")

  const [togglingId, setTogglingId] = useState<number | null>(null)

  const loadUsers = async () => {
    const data = await usersService.getAll()
    setUsers(data)
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      setIsLoading(true)
      setLoadError("")
      try {
        const [usersData, rolesData, petsData] = await Promise.all([
          usersService.getAll(),
          rolesService.getAll(),
          petsService.getAll(),
        ])
        if (!cancelled) {
          setUsers(usersData)
          setRoles(rolesData)
          setPets(petsData)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            typeof err === "object" && err && "message" in err
              ? String((err as { message: unknown }).message)
              : "Failed to load users."
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

  const petsCountByUserId = useMemo(() => {
    const map = new Map<number, number>()
    pets.forEach((p) => map.set(p.ownerUserID, (map.get(p.ownerUserID) ?? 0) + 1))
    return map
  }, [pets])

  const closeModal = () => {
    setIsModalOpen(false)
    setForm(emptyForm)
    setSaveError("")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username.trim() || !form.email.trim() || !form.password || !form.roleID) return

    setIsSaving(true)
    setSaveError("")
    try {
      const payload: UserCreateDto = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim() || undefined,
        lastName: form.lastName.trim() || undefined,
        phone: form.phone.trim() || undefined,
        roleID: Number(form.roleID),
      }
      await register(payload)
      await loadUsers()
      closeModal()
    } catch (err) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message: unknown }).message)
          : "Could not create user."
      setSaveError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const openEditModal = (u: UserReadDto) => {
    setEditForm({
      userID: u.userID,
      username: u.username,
      email: u.email,
      firstName: u.firstName ?? "",
      lastName: u.lastName ?? "",
      phone: u.phone ?? "",
      roleID: String(u.roleID),
      isActive: u.isActive,
    })
    setEditError("")
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditForm(emptyEditForm)
    setEditError("")
  }

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm.username.trim() || !editForm.email.trim() || !editForm.roleID) return

    setIsEditSaving(true)
    setEditError("")
    try {
      const payload: UserUpdateDto = {
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        firstName: editForm.firstName.trim() || undefined,
        lastName: editForm.lastName.trim() || undefined,
        phone: editForm.phone.trim() || undefined,
        roleID: Number(editForm.roleID),
        isActive: editForm.isActive,
      }
      const updated = await usersService.update(editForm.userID, payload)
      setUsers((prev) => prev.map((u) => (u.userID === updated.userID ? updated : u)))
      closeEditModal()
    } catch (err) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message: unknown }).message)
          : "Could not update user."
      setEditError(message)
    } finally {
      setIsEditSaving(false)
    }
  }

  const toggleStatus = async (u: UserReadDto) => {
    setTogglingId(u.userID)
    try {
      const payload: UserUpdateDto = {
        username: u.username,
        email: u.email,
        firstName: u.firstName ?? undefined,
        lastName: u.lastName ?? undefined,
        phone: u.phone ?? undefined,
        roleID: u.roleID,
        isActive: !u.isActive,
      }
      const updated = await usersService.update(u.userID, payload)
      setUsers((prev) => prev.map((item) => (item.userID === updated.userID ? updated : item)))
    } catch (err) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message: unknown }).message)
          : "Could not update user status."
      alert(message)
    } finally {
      setTogglingId(null)
    }
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
            Add User
          </button>
        </div>

        {isLoading && <p className="text-sm text-slate-500">Loading users...</p>}

        {loadError && !isLoading && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        )}

        {!isLoading && !loadError && (
          <div className="overflow-hidden rounded-2xl border bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Pets</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => {
                  const isSelf = currentUser?.id === u.userID
                  const petCount = petsCountByUserId.get(u.userID) ?? 0
                  return (
                    <tr key={u.userID}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${colorForId(u.userID)}`}>
                            {getInitials(u)}
                          </div>
                          <span className="font-medium text-slate-900">{displayName(u)}</span>
                          {isSelf && <span className="text-xs text-slate-400">(you)</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            u.roleName === "Admin"
                              ? "bg-sky-100 text-sky-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {u.roleName ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {u.roleName === "PetOwner" ? petCount : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                            u.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            className="text-slate-500 hover:text-teal-600"
                            aria-label="Edit user"
                            onClick={() => openEditModal(u)}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-400 hover:text-red-600 disabled:opacity-40"
                            aria-label="Toggle active status"
                            title={isSelf ? "You can't deactivate your own account" : undefined}
                            disabled={isSelf || togglingId === u.userID}
                            onClick={() => toggleStatus(u)}
                          >
                            {u.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {users.length === 0 && (
              <p className="p-6 text-sm text-slate-500">No users yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl scrollbar-hide">
            <div className="sticky top-0 flex items-center justify-between bg-gradient-to-r from-slate-900 to-teal-800 px-6 py-4">
              <h2 className="font-semibold text-white">Add New User</h2>
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
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </label>
                <select
                  required
                  value={form.roleID}
                  onChange={(e) => setForm({ ...form, roleID: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                >
                  <option value="">— Select role —</option>
                  {roles.map((r) => (
                    <option key={r.roleID} value={r.roleID}>{r.roleName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="h-11 w-full rounded-lg bg-gradient-to-r from-slate-900 to-teal-800 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
              >
                {isSaving ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl scrollbar-hide">
            <div className="sticky top-0 flex items-center justify-between bg-gradient-to-r from-slate-900 to-teal-800 px-6 py-4">
              <h2 className="font-semibold text-white">Edit User</h2>
              <button onClick={closeEditModal} className="text-white/80 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-4 p-6">
              {editError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {editError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </label>
                <select
                  required
                  value={editForm.roleID}
                  onChange={(e) => setEditForm({ ...editForm, roleID: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                >
                  {roles.map((r) => (
                    <option key={r.roleID} value={r.roleID}>{r.roleName}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/40"
                />
                Account is active
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="h-11 flex-1 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditSaving}
                  className="h-11 flex-1 rounded-lg bg-gradient-to-r from-teal-700 to-emerald-500 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
                >
                  {isEditSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}