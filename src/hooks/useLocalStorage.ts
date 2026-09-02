import { useCallback, useEffect, useState } from 'react'

function readValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue
  try {
    const stored = window.localStorage.getItem(key)
    return stored === null ? initialValue : (JSON.parse(stored) as T)
  } catch {
    window.localStorage.removeItem(key)
    return initialValue
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readValue(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be unavailable in private browsing or when quota is exceeded.
    }
  }, [key, value])

  const reset = useCallback(() => setValue(initialValue), [initialValue])
  return [value, setValue, reset] as const
}

export function removeLocalStorage(key: string) {
  try { window.localStorage.removeItem(key) } catch { /* Storage unavailable. */ }
}
