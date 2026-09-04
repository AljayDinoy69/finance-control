import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
export default function MainLayout() { const [open, setOpen] = useState(false); return <div className="flex min-h-screen items-start bg-background"><Sidebar open={open} onClose={() => setOpen(false)} /><div className="flex min-w-0 flex-1 flex-col"><TopNav onMenu={() => setOpen(true)} /><main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto"><Outlet /></main></div></div> }
