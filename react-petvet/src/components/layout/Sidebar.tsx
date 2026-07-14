import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/services/auth"
import { LayoutDashboard, PawPrint, FileText, Syringe, FileStack, Calendar, Users, LogOut,} from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Pet Profiles", icon: PawPrint, href: "/pets" },
  { label: "Medical Records", icon: FileText, href: "/records" },
  { label: "Vaccinations", icon: Syringe, href: "/vaccinations" },
  { label: "Documents", icon: FileStack, href: "/documents" },
  { label: "Appointments", icon: Calendar, href: "/appointments" },
  { label: "User Accounts", icon: Users, href: "/users" },
]

export function Sidebar() {
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col bg-slate-950 text-slate-300">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-green-500">
          <PawPrint className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold text-white">PetVet MR</div>
          <div className="text-xs text-teal-400">Clinic Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = item.href === location.pathname
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-sm"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
            DS
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">Dr. Sarah Reyes</div>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Administrator
            </div>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}