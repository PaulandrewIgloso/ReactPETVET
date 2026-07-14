import { useState } from "react"
import { AppShell } from "@/components/layout/Appshell"
import { Search, Plus, X } from "lucide-react"

interface Pet {
  id: string
  name: string
  breed: string
  species: "Dog" | "Cat"
  age: string
  weight: string
  gender: "Male" | "Female"
  owner: string
  avatarColor: string
}

const initialPets: Pet[] = [
  { id: "1", name: "Luna", breed: "Labrador Retriever", species: "Dog", age: "3 yrs", weight: "28 kg", gender: "Female", owner: "Carlos Mendez", avatarColor: "bg-orange-200" },
  { id: "2", name: "Mochi", breed: "Scottish Fold", species: "Cat", age: "2 yrs", weight: "4.2 kg", gender: "Male", owner: "Ana Torres", avatarColor: "bg-slate-300" },
  { id: "3", name: "Titan", breed: "German Shepherd", species: "Dog", age: "5 yrs", weight: "35 kg", gender: "Male", owner: "Carlos Mendez", avatarColor: "bg-amber-300" },
  { id: "4", name: "Bella", breed: "Golden Retriever", species: "Dog", age: "1 yr", weight: "22 kg", gender: "Female", owner: "Maria Santos", avatarColor: "bg-yellow-200" },
  { id: "5", name: "Neko", breed: "Maine Coon", species: "Cat", age: "4 yrs", weight: "6.1 kg", gender: "Female", owner: "Ana Torres", avatarColor: "bg-slate-500" },
]

const owners = ["Carlos Mendez", "Ana Torres", "Maria Santos"]
const avatarColors = ["bg-orange-200", "bg-slate-300", "bg-amber-300", "bg-yellow-200", "bg-slate-500", "bg-emerald-200", "bg-sky-200"]

const emptyForm = {
  name: "",
  species: "Dog" as "Dog" | "Cat",
  breed: "",
  age: "",
  gender: "Male" as "Male" | "Female",
  weight: "",
  owner: "",
}

export default function PetProfilesPage() {
  const [query, setQuery] = useState("")
  const [pets, setPets] = useState<Pet[]>(initialPets)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(query.toLowerCase())
  )

  const closeModal = () => {
    setIsModalOpen(false)
    setForm(emptyForm)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.owner) return

    const newPet: Pet = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      breed: form.breed.trim() || "Unknown breed",
      species: form.species,
      age: form.age.trim() || "—",
      weight: form.weight.trim() || "—",
      gender: form.gender,
      owner: form.owner,
      avatarColor: avatarColors[pets.length % avatarColors.length],
    }

    setPets((prev) => [...prev, newPet])
    closeModal()
  }

  return (
    <AppShell>
      <div className="space-y-6 p-8">
        {/* Search + Add */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pets..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-green-500 px-4 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add new pet
          </button>
        </div>

        {/* Pet cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 shrink-0 rounded-full ${pet.avatarColor}`} />
                  <div>
                    <div className="font-semibold text-slate-900">{pet.name}</div>
                    <div className="text-xs text-teal-600">{pet.breed}</div>
                  </div>
                </div>
                <span
                  className={`rounded-md px-2 py-1 text-xs font-medium ${
                    pet.species === "Dog"
                      ? "bg-sky-100 text-sky-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {pet.species}
                </span>
              </div>

              <div className="mb-3 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-slate-100 py-2 text-center">
                  <div className="text-sm font-semibold text-slate-900">{pet.age}</div>
                  <div className="text-[11px] text-slate-500">Age</div>
                </div>
                <div className="rounded-lg bg-slate-100 py-2 text-center">
                  <div className="text-sm font-semibold text-slate-900">{pet.weight}</div>
                  <div className="text-[11px] text-slate-500">Weight</div>
                </div>
                <div className="rounded-lg bg-slate-100 py-2 text-center">
                  <div className="text-sm font-semibold text-slate-900">{pet.gender}</div>
                  <div className="text-[11px] text-slate-500">Gender</div>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Owner: <span className="text-slate-700">{pet.owner}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredPets.length === 0 && (
          <p className="text-sm text-slate-500">No pets match "{query}".</p>
        )}
      </div>

      {/* Add Pet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-teal-800 px-6 py-4">
              <h2 className="font-semibold text-white">Add New Pet</h2>
              <button onClick={closeModal} className="text-white/80 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleSave} className="space-y-4 p-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pet Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Buddy"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Species
                  </label>
                  <select
                    value={form.species}
                    onChange={(e) => setForm({ ...form, species: e.target.value as "Dog" | "Cat" })}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    placeholder="e.g. Labrador"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Age
                  </label>
                  <input
                    type="text"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="e.g. 2 yrs"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as "Male" | "Female" })}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder="e.g. 12 kg"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Owner
                  </label>
                  <select
                    required
                    value={form.owner}
                    onChange={(e) => setForm({ ...form, owner: e.target.value })}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                  >
                    <option value="">— Select owner —</option>
                    {owners.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
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