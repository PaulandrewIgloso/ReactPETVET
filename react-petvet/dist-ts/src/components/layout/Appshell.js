import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sidebar } from "./Sidebar";
export function AppShell({ children }) {
    return (_jsxs("div", { className: "flex min-h-screen bg-slate-50", children: [_jsx(Sidebar, {}), _jsx("div", { className: "flex-1 overflow-y-auto", children: children })] }));
}
