import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun, UserRound } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFinanceContext } from '@/context/FinanceContext'
import { useTheme, type Theme } from '@/context/ThemeContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { supabase } from '@/lib/supabase'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }
const currencies = ['PHP', 'USD', 'EUR', 'GBP', 'JPY']

export default function AccountSettingsModal({ open, onOpenChange }: Props) {
  const { preferences, setPreferences } = useFinanceContext()
  const { theme, setTheme } = useTheme()
  const [profile, setProfile] = useLocalStorage('ledgerly-profile', { name: 'Alex Morgan', email: 'alex@example.com' })
  const [draft, setDraft] = useState({ ...profile, currency: preferences.currency, compactMode: preferences.compactMode, theme })

  useEffect(() => { if (open) setDraft({ ...profile, currency: preferences.currency, compactMode: preferences.compactMode, theme }) }, [open, profile, preferences, theme])
  const initials = draft.name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U'
  const save = async () => { const name = draft.name.trim() || 'User'; const email = draft.email.trim() || 'user@example.com'; setProfile({ name, email }); setPreferences({ currency: draft.currency, compactMode: draft.compactMode }); setTheme(draft.theme); const { data } = await supabase.auth.getSession(); if (data.session?.user) { await supabase.from('profiles').upsert({ id: data.session.user.id, full_name: name, email }); await supabase.from('user_preferences').upsert({ user_id: data.session.user.id, currency: draft.currency, compact_mode: draft.compactMode, theme: draft.theme }) } onOpenChange(false) }

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[min(720px,calc(100dvh-2rem))] overflow-y-auto sm:max-w-lg"><DialogHeader><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{initials}</div><div><DialogTitle>Profile & system settings</DialogTitle><DialogDescription>Update your account details and workspace preferences.</DialogDescription></div></div></DialogHeader><div className="grid gap-5 py-2"><section className="grid gap-3"><h3 className="text-sm font-semibold">Profile</h3><div className="grid gap-2"><Label htmlFor="account-name">Full name</Label><Input id="account-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></div><div className="grid gap-2"><Label htmlFor="account-email">Email address</Label><Input id="account-email" type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></div></section><section className="grid gap-3"><h3 className="text-sm font-semibold">System</h3><div className="grid gap-2"><Label>Theme</Label><Select value={draft.theme} onValueChange={(value) => value && setDraft({ ...draft, theme: value as Theme })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="light"><Sun data-icon="inline-start" /> Light</SelectItem><SelectItem value="dark"><Moon data-icon="inline-start" /> Dark</SelectItem><SelectItem value="system"><Monitor data-icon="inline-start" /> System</SelectItem></SelectContent></Select></div><div className="grid gap-2"><Label>Currency</Label><Select value={draft.currency} onValueChange={(value) => value && setDraft({ ...draft, currency: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{currencies.map((currency) => <SelectItem key={currency} value={currency}>{currency}</SelectItem>)}</SelectContent></Select></div><label className="flex cursor-pointer items-center justify-between rounded-lg border p-3 text-sm"><span><span className="block font-medium">Compact mode</span><span className="text-muted-foreground">Use tighter spacing across the dashboard.</span></span><input className="size-4 accent-primary" type="checkbox" checked={draft.compactMode} onChange={(event) => setDraft({ ...draft, compactMode: event.target.checked })} /></label></section></div><DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={save}><UserRound data-icon="inline-start" />Save changes</Button></DialogFooter></DialogContent></Dialog>
}
