import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

export default function App() {
  return <Routes><Route element={<MainLayout />}><Route path="/" element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/transactions" element={<Transactions />} /><Route path="/budgets" element={<Budgets />} /><Route path="/reports" element={<Reports />} /><Route path="/settings" element={<Settings />} /></Route></Routes>
}
