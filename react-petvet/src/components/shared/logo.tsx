import { PawPrint } from "lucide-react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-green-500">
        <PawPrint className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-lg font-bold tracking-tight text-slate-900">
        PetVet <span className="text-teal-600">MR</span>
      </span>
    </div>
  )
}