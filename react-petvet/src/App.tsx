import { AuthProvider, useAuth } from './services/auth/auth.service'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginForm } from './components/layout/auth/LoginForm'
import DashboardPage from './features/dashboard/Dashboardpage'
import OwnerDashboard from './features/dashboard/OwnerDashboard'
import PetProfilesPage from './features/pets/PetProfilespage'
import MedicalRecordsPage from './features/records/MedicalRecordspage'
import VaccinationsPage from './features/vaccinations/Vaccinationspage'
import AppointmentsPage from './features/appointments/Appointmentspage'
import DocumentsPage from './features/documents/Documentspage'
import UserAccountsPage from './features/users/UserAccountspage'
import './App.css'

function ProtectedRoute({ children, requiredRole }: {
  children: React.ReactNode
  requiredRole?: "Admin" | "PetOwner"
}) {
  const { token, isAdmin } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (requiredRole === "Admin" && !isAdmin) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function DashboardRouter() {
  const { isAdmin } = useAuth()
  return isAdmin ? <DashboardPage /> : <OwnerDashboard />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
      <Route path="/pets" element={<ProtectedRoute requiredRole="Admin"><PetProfilesPage /></ProtectedRoute>} />
      <Route path="/records" element={<ProtectedRoute><MedicalRecordsPage /></ProtectedRoute>} />
      <Route path="/vaccinations" element={<ProtectedRoute><VaccinationsPage /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute requiredRole="Admin"><UserAccountsPage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
export default App