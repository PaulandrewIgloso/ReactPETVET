import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/services/auth/auth.service"
import { LayoutDashboard, PawPrint, FileText, Syringe, FileStack, Calendar, Users, LogOut, X } from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Pet Profiles", icon: PawPrint, href: "/pets" },
  { label: "Medical Records", icon: FileText, href: "/records" },
  { label: "Vaccinations", icon: Syringe, href: "/vaccinations" },
  { label: "Documents", icon: FileStack, href: "/documents" },
  { label: "Appointments", icon: Calendar, href: "/appointments" },
  { label: "User Accounts", icon: Users, href: "/users" },
]

const adminOnlyPaths = new Set(["/pets", "/users"])

const roleLabels: Record<string, string> = {
  Admin: "Administrator",
  PetOwner: "Pet Owner",
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation()
  const { logout, user, isAdmin } = useAuth()

  const displayName = user?.username ?? "Guest"
  const roleLabel = user?.role ? roleLabels[user.role] ?? user.role : "—"
  const visibleNavItems = navItems.filter((item) => isAdmin || !adminOnlyPaths.has(item.href))

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col bg-slate-950 text-slate-300 transition-transform duration-200 ease-out sm:w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:sticky lg:top-0 lg:z-0 lg:w-64 lg:translate-x-0`}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-green-500">
            <PawPrint className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-bold text-white">PetVet MR</div>
            <div className="truncate text-xs text-teal-400">Clinic Portal</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {visibleNavItems.map((item) => {
            const isActive = item.href === location.pathname
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
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

        <div className="border-t border-white/10 p-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
              {getInitials(displayName)}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold text-white">{displayName}</div>
              <div className="flex items-center gap-1 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="truncate">{roleLabel}</span>
              </div>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
