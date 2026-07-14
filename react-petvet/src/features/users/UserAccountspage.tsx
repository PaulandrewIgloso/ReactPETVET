import { useState } from "react"
import { AppShell } from "@/components/layout/Appshell"
import { Plus, X, Pencil, UserX } from "lucide-react"

interface UserAccount {
  id: string
  name: string
  email: string
  role: "Admin / Vet" | "Pet Owner"
  petsCount: number | null
  status: "Active" | "Inactive"
  avatarColor: string
}

const initialUsers: UserAccount[] = [
  { id: "1", name: "Dr. Sarah Reyes", email: "admin@petvet.com", role: "Admin / Vet", petsCount: null, status: "Active", avatarColor: "bg-teal-600" },
  { id: "2", name: "Carlos Mendez", email: "carlos@example.com", role: "Pet Owner", petsCount: 2, status: "Active", avatarColor: "bg-emerald-500" },
  { id: "3", name: "Ana Torres", email: "ana@example.com", role: "Pet Owner", petsCount: 2, status: "Active", avatarColor: "bg-sky-500" },
  { id: "4", name: "Dr. James Park", email: "jpark@petvet.com", role: "Admin / Vet", petsCount: null, status: "Active", avatarColor: "bg-indigo-600" },
  { id: "5", name: "Maria Santos", email: "maria@example.com", role: "Pet Owner", petsCount: 1, status: "Active", avatarColor: "bg-green-600" },
]

const roleOptions: UserAccount["role"][] = ["Admin / Vet", "Pet Owner"]
const avatarColors = ["bg-teal-600", "bg-emerald-500", "bg-sky-500", "bg-indigo-600", "bg-green-600", "bg-amber-500"]

function getInitials(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const emptyForm = {
  name: "",
  email: "",
  role: "Pet Owner" as UserAccount["role"],
  password: "",
}

const emptyEditForm = {
  id: "",
  name: "",
  email: "",
  role: "Pet Owner" as UserAccount["role"],
  newPassword: "",
}

export default function UserAccountsPage() {
  const [users, setUsers] = useState<UserAccount[]>(initialUsers)

  // Add User modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  // Edit User modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState(emptyEditForm)

  const closeModal = () => {
    setIsModalOpen(false)
    setForm(emptyForm)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.password) return

    const newUser: UserAccount = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      petsCount: form.role === "Pet Owner" ? 0 : null,
      status: "Active",
      avatarColor: avatarColors[users.length % avatarColors.length],
    }

    setUsers((prev) => [...prev, newUser])
    closeModal()
  }

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u
      )
    )
  }

  const openEditModal = (user: UserAccount) => {
    setEditForm({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      newPassword: "",
    })
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditForm(emptyEditForm)
  }

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm.name.trim() || !editForm.email.trim()) return

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editForm.id
          ? { ...u, name: editForm.name.trim(), email: editForm.email.trim(), role: editForm.role }
          : u
      )
    )
    // editForm.newPassword, if set, would be sent to the backend here once connected —
    // it's intentionally not stored anywhere in local state.
    closeEditModal()
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
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${u.avatarColor}`}>
                        {getInitials(u.name)}
                      </div>
                      <span className="font-medium text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-medium ${
                        u.role === "Admin / Vet"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{u.petsCount ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        u.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {u.status}
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
                        className="text-red-400 hover:text-red-600"
                        aria-label="Toggle active status"
                        onClick={() => toggleStatus(u.id)}
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="p-6 text-sm text-slate-500">No users yet.</p>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">Add New User</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 px-6 pb-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
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
                  placeholder="Email Address"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as UserAccount["role"] })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
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
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Password"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <button
                type="submit"
                className="h-11 w-full rounded-lg bg-gradient-to-r from-slate-900 to-teal-800 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-teal-800 px-6 py-4">
              <h2 className="font-semibold text-white">Edit User</h2>
              <button onClick={closeEditModal} className="text-white/80 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-4 p-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
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
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserAccount["role"] })}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Leave password field empty to keep current password
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                  placeholder="Enter new password or leave blank"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

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