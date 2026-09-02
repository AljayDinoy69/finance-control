import { useState } from 'react'
import { RotateCcw, SunMoon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useFinanceContext } from '@/context/FinanceContext'
import { useTheme } from '@/context/ThemeContext'

export default function Settings() {
  const { resetDemoData, preferences, setPreferences } = useFinanceContext()
  const { theme, toggleTheme } = useTheme()
  const [message, setMessage] = useState('')
  const reset = () => { if (window.confirm('Reset transactions, budgets, categories, preferences, and theme to demo defaults?')) { resetDemoData(); if (theme === 'dark') toggleTheme(); setMessage('Demo data and preferences were reset.') } }
  return <section className="mx-auto flex max-w-3xl flex-col gap-6">
    <header><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Settings</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Make Ledgerly yours</h1><p className="mt-2 text-muted-foreground">Your preferences are saved automatically on this device.</p></header>
    <Card><CardHeader><CardTitle>Preferences</CardTitle><CardDescription>Personalize your finance workspace.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><div className="flex items-center justify-between gap-4 rounded-xl border p-4"><div><p className="font-medium">Theme</p><p className="text-sm text-muted-foreground">Currently using {theme} mode.</p></div><Button variant="outline" onClick={toggleTheme}><SunMoon data-icon="inline-start" />Switch theme</Button></div><div className="flex items-center justify-between gap-4 rounded-xl border p-4"><div><p className="font-medium">Currency</p><p className="text-sm text-muted-foreground">Displayed as {preferences.currency}.</p></div><Button variant="outline" onClick={() => setPreferences({ currency: preferences.currency === 'USD' ? 'EUR' : 'USD' })}>{preferences.currency === 'USD' ? 'Use EUR' : 'Use USD'}</Button></div></CardContent></Card>
    <Card><CardHeader><CardTitle>Demo data</CardTitle><CardDescription>Restore the sample workspace without affecting unrelated browser storage.</CardDescription></CardHeader><CardContent className="flex items-center justify-between gap-4"><p className="text-sm text-muted-foreground">This replaces only Ledgerly finance data and preferences.</p><Button variant="destructive" onClick={reset}><RotateCcw data-icon="inline-start" />Reset demo data</Button></CardContent></Card>
    {message && <p role="status" className="text-sm font-medium text-primary">{message}</p>}
  </section>
}
