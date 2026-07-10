import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, PawPrint } from "lucide-react"
import catHero from "@/assets/CatDog.jpg"

export function LoginForm() {
  return (
    <div className="flex min-h-screen">
      {/* Left column — hero image */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <img
          src={catHero}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover object-[30%_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-slate-900/60" />

        <div className="relative flex h-full flex-col justify-end p-10">
          <div className="max-w-md space-y-4">
            <h2 className="text-4xl font-bold leading-tight text-white">
              Every pet deserves the{" "}
              <span className="bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">
                best care.
              </span>
            </h2>
            <p className="text-slate-200">
              Centralized clinical records for your clinic — fast, secure, and built around your patients.
            </p>
          </div>
        </div>
      </div>

      {/* Right column — login form */}
      <div className="relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 p-4 lg:w-1/2">
        {/* Decorative blurred blobs */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />

        {/* Frosted glass card */}
        <div className="relative w-full max-w-sm space-y-6 rounded-3xl border border-white/60 bg-white/50 p-8 shadow-xl backdrop-blur-xl">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-green-500">
              <PawPrint className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-slate-900">PetVet MR</span>
          </div>

          <div className="space-y-2">
            <h1 className="!text-slate-900 text-3xl font-extrabold tracking-tight">
              Welcome back!
            </h1>
            <p className="text-sm text-slate-500">
              Sign in to manage your clinic or view your pet's records.
            </p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="username"
                className="h-14 rounded-2xl border-0 bg-white px-5 text-base shadow-sm ring-0 focus-visible:ring-2 focus-visible:ring-teal-500/40"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                className="h-14 rounded-2xl border-0 bg-white px-5 text-base shadow-sm ring-0 focus-visible:ring-2 focus-visible:ring-teal-500/40"
              />
            </div>

            <Button
              type="submit"
              className="h-14 w-full rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-green-500 text-base font-semibold text-white shadow-md hover:opacity-90"
            >
              <span className="flex items-center justify-center gap-2">
                Sign in <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}