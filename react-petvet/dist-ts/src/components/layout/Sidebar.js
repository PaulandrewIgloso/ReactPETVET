import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PawPrint, FileText, Syringe, FileStack, Calendar, Users, LogOut, } from "lucide-react";
const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Pet Profiles", icon: PawPrint, href: "/pets" },
    { label: "Medical Records", icon: FileText, href: "/records" },
    { label: "Vaccinations", icon: Syringe, href: "/vaccinations" },
    { label: "Documents", icon: FileStack, href: "/documents" },
    { label: "Appointments", icon: Calendar, href: "/appointments" },
    { label: "User Accounts", icon: Users, href: "/users" },
];
export function Sidebar() {
    const location = useLocation();
    return (_jsxs("aside", { className: "flex h-screen w-64 flex-col bg-slate-950 text-slate-300", children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-white/10 px-5 py-5", children: [_jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-green-500", children: _jsx(PawPrint, { className: "h-5 w-5 text-white", strokeWidth: 2.5 }) }), _jsxs("div", { className: "leading-tight", children: [_jsx("div", { className: "text-sm font-bold text-white", children: "PetVet MR" }), _jsx("div", { className: "text-xs text-teal-400", children: "Clinic Portal" })] })] }), _jsx("nav", { className: "flex-1 space-y-1 px-3 py-4", children: navItems.map((item) => {
                    const isActive = item.href === location.pathname;
                    const Icon = item.icon;
                    return (_jsxs(Link, { to: item.href, className: `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                            ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-sm"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"}`, children: [_jsx(Icon, { className: "h-4 w-4 shrink-0" }), item.label] }, item.href));
                }) }), _jsxs("div", { className: "border-t border-white/10 p-4", children: [_jsxs("div", { className: "mb-2 flex items-center gap-3", children: [_jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white", children: "DS" }), _jsxs("div", { className: "leading-tight", children: [_jsx("div", { className: "text-sm font-semibold text-white", children: "Dr. Sarah Reyes" }), _jsxs("div", { className: "flex items-center gap-1 text-xs text-emerald-400", children: [_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400" }), "Administrator"] })] })] }), _jsxs("button", { className: "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white", children: [_jsx(LogOut, { className: "h-4 w-4" }), "Sign out"] })] })] }));
}
