import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './services/auth'
import { LoginForm } from './components/layout/auth/LoginForm'
import DashboardPage from './features/dashboard/Dashboardpage'
import PetProfilesPage from './features/pets/PetProfilespage'
import MedicalRecordsPage from './features/records/MedicalRecordspage'
import VaccinationsPage from './features/vaccinations/Vaccinationspage'
import AppointmentsPage from './features/appointments/Appointmentspage'
import DocumentsPage from './features/documents/Documentspage'
import UserAccountsPage from './features/users/UserAccountspage'
import './App.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/pets" element={<ProtectedRoute><PetProfilesPage /></ProtectedRoute>} />
      <Route path="/records" element={<ProtectedRoute><MedicalRecordsPage /></ProtectedRoute>} />
      <Route path="/vaccinations" element={<ProtectedRoute><VaccinationsPage /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UserAccountsPage /></ProtectedRoute>} />
      <Route path="/" element={<LoginForm />} />
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