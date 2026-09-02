import { useMemo } from 'react'
import { useFinanceContext } from '@/context/FinanceContext'
import type { DateRange, TransactionType } from '@/types/finance'

export function useFinance() {
  return useFinanceContext()
}

export function useTransactionFilters({ query, category, type, date }: { query?: string; category?: string; type?: TransactionType; date?: DateRange } = {}) {
  const finance = useFinanceContext()
  return useMemo(() => {
    let result = finance.transactions
    if (query) result = finance.searchTransactions(query).filter((item) => result.some(({ id }) => id === item.id))
    if (category && category !== 'all') result = result.filter((item) => item.category === category)
    if (type) result = result.filter((item) => item.type === type)
    if (date) result = result.filter((item) => (!date.from || item.date >= date.from) && (!date.to || item.date <= date.to))
    return result
  }, [finance, query, category, type, date])
}
