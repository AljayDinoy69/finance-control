import { NavLink } from 'react-router-dom'
import { BarChart3, CreditCard, LayoutDashboard, PieChart, Settings, Wallet, X } from 'lucide-react'
import { motion } from 'motion/react'

const links = [{ to: '/dashboard', label: 'Overview', icon: LayoutDashboard }, { to: '/transactions', label: 'Transactions', icon: CreditCard }, { to: '/budgets', label: 'Budgets', icon: Wallet }, { to: '/reports', label: 'Reports', icon: BarChart3 }, { to: '/settings', label: 'Settings', icon: Settings }]
export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <><div className={`fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden ${open ? 'block' : 'hidden'}`} onClick={onClose} /><motion.aside initial={false} animate={{ x: open ? 0 : '-100%' }} className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-sidebar p-5 lg:static lg:translate-x-0">
    <div className="flex items-center justify-between px-2"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><PieChart className="size-5" /></div><div><p className="font-mono text-sm font-bold tracking-tight">ledgerly</p><p className="text-xs text-muted-foreground">Personal finance</p></div></div><button className="lg:hidden" onClick={onClose} aria-label="Close menu"><X className="size-5" /></button></div>
    <div className="mt-10 flex flex-col gap-1"><p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Workspace</p>{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}><Icon className="size-4" />{label}</NavLink>)}</div>
    <div className="mt-auto rounded-2xl bg-accent p-4"><p className="text-xs font-semibold">Your financial snapshot</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Connect your accounts to keep everything in one calm place.</p><button className="mt-3 text-xs font-bold text-primary">Get started →</button></div>
  </motion.aside></>
}
