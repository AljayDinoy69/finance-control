import React, { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export type Theme = 'light' | 'dark' | 'system'
type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void; toggleTheme: () => void; resolvedTheme: 'light' | 'dark' }
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>('ledgerly-theme', 'system')
  const [systemDark, setSystemDark] = React.useState(false)
  useEffect(() => { const media = window.matchMedia('(prefers-color-scheme: dark)'); const sync = () => setSystemDark(media.matches); sync(); media.addEventListener('change', sync); return () => media.removeEventListener('change', sync) }, [])
  const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme
  useEffect(() => { document.documentElement.classList.toggle('dark', resolvedTheme === 'dark') }, [resolvedTheme])
  const value = useMemo(() => ({ theme, setTheme, resolvedTheme, toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light') }), [theme, setTheme, resolvedTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
export function useTheme() { const context = useContext(ThemeContext); if (!context) throw new Error('useTheme must be used within ThemeProvider'); return context }
