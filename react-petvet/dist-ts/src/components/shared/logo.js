import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PawPrint } from "lucide-react";
export function Logo({ className }) {
    return (_jsxs("div", { className: `flex items-center gap-2 ${className ?? ""}`, children: [_jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-green-500", children: _jsx(PawPrint, { className: "h-5 w-5 text-white", strokeWidth: 2.5 }) }), _jsxs("span", { className: "text-lg font-bold tracking-tight text-slate-900", children: ["PetVet ", _jsx("span", { className: "text-teal-600", children: "MR" })] })] }));
}
