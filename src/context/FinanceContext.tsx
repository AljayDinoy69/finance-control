import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Budget, DateRange, FinancialSummary, MonthlyTotal, Transaction, TransactionType } from '@/types/finance'

const seedTransactions: Transaction[] = [
  { id: 't-1', title: 'Whole Foods Market', amount: 86.42, type: 'expense', category: 'Food', date: '2026-09-02', description: 'Weekly groceries', createdAt: '2026-09-02T09:10:00Z' },
  { id: 't-2', title: 'Acme Corp. Payroll', amount: 7800, type: 'income', category: 'Income', date: '2026-09-01', description: 'September salary', createdAt: '2026-09-01T08:00:00Z' },
  { id: 't-3', title: 'Netflix', amount: 19.99, type: 'expense', category: 'Entertainment', date: '2026-08-30', description: 'Monthly subscription', createdAt: '2026-08-30T12:00:00Z' },
]

const seedBudgets: Budget[] = [
  { id: 'b-1', category: 'Food', limit: 800, spent: 620, month: 9, year: 2026 },
  { id: 'b-2', category: 'Transport', limit: 400, spent: 280, month: 9, year: 2026 },
  { id: 'b-3', category: 'Bills', limit: 500, spent: 480, month: 9, year: 2026 },
]

type EntityInput<T> = Omit<T, 'id' | 'createdAt'>
interface FinanceContextValue {
  transactions: Transaction[]
  budgets: Budget[]
  addTransaction: (transaction: EntityInput<Transaction>) => Transaction
  updateTransaction: (id: string, updates: Partial<EntityInput<Transaction>>) => void
  deleteTransaction: (id: string) => void
  addBudget: (budget: EntityInput<Budget>) => Budget
  updateBudget: (id: string, updates: Partial<EntityInput<Budget>>) => void
  deleteBudget: (id: string) => void
  getBalance: () => number
  getTotalIncome: () => number
  getTotalExpenses: () => number
  getTotalSavings: () => number
  getExpensesByCategory: () => Record<string, number>
  getMonthlyExpenses: () => MonthlyTotal[]
  getMonthlyIncome: () => MonthlyTotal[]
  getSummary: () => FinancialSummary
  searchTransactions: (query: string) => Transaction[]
  filterByCategory: (category: string) => Transaction[]
  filterByType: (type: TransactionType) => Transaction[]
  filterByDate: (range: DateRange) => Transaction[]
}

const FinanceContext = createContext<FinanceContextValue | null>(null)
const makeId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState(seedTransactions)
  const [budgets, setBudgets] = useState(seedBudgets)

  const addTransaction = useCallback((input: EntityInput<Transaction>) => {
    const transaction = { ...input, id: makeId('t'), createdAt: new Date().toISOString() }
    setTransactions((current) => [transaction, ...current])
    return transaction
  }, [])
  const updateTransaction = useCallback((id: string, updates: Partial<EntityInput<Transaction>>) => setTransactions((current) => current.map((item) => item.id === id ? { ...item, ...updates } : item)), [])
  const deleteTransaction = useCallback((id: string) => setTransactions((current) => current.filter((item) => item.id !== id)), [])
  const addBudget = useCallback((input: EntityInput<Budget>) => { const budget = { ...input, id: makeId('b') }; setBudgets((current) => [budget, ...current]); return budget }, [])
  const updateBudget = useCallback((id: string, updates: Partial<EntityInput<Budget>>) => setBudgets((current) => current.map((item) => item.id === id ? { ...item, ...updates } : item)), [])
  const deleteBudget = useCallback((id: string) => setBudgets((current) => current.filter((item) => item.id !== id)), [])

  const getTotalIncome = useCallback(() => transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0), [transactions])
  const getTotalExpenses = useCallback(() => transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0), [transactions])
  const getBalance = useCallback(() => getTotalIncome() - getTotalExpenses(), [getTotalIncome, getTotalExpenses])
  const getTotalSavings = useCallback(() => getTotalIncome() - getTotalExpenses(), [getTotalIncome, getTotalExpenses])
  const getExpensesByCategory = useCallback(() => transactions.filter((item) => item.type === 'expense').reduce<Record<string, number>>((result, item) => { result[item.category] = (result[item.category] ?? 0) + item.amount; return result }, {}), [transactions])
  const monthly = useCallback((type: TransactionType) => Object.entries(transactions.filter((item) => item.type === type).reduce<Record<string, number>>((result, item) => { const key = item.date.slice(0, 7); result[key] = (result[key] ?? 0) + item.amount; return result }, {})).sort(([a], [b]) => a.localeCompare(b)).map(([month, total]) => ({ month, total })), [transactions])
  const getMonthlyExpenses = useCallback(() => monthly('expense'), [monthly])
  const getMonthlyIncome = useCallback(() => monthly('income'), [monthly])
  const searchTransactions = useCallback((query: string) => { const value = query.trim().toLowerCase(); return value ? transactions.filter((item) => `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(value)) : transactions }, [transactions])
  const filterByCategory = useCallback((category: string) => category === 'all' ? transactions : transactions.filter((item) => item.category === category), [transactions])
  const filterByType = useCallback((type: TransactionType) => transactions.filter((item) => item.type === type), [transactions])
  const filterByDate = useCallback((range: DateRange) => transactions.filter((item) => (!range.from || item.date >= range.from) && (!range.to || item.date <= range.to)), [transactions])
  const getSummary = useCallback(() => ({ balance: getBalance(), income: getTotalIncome(), expenses: getTotalExpenses(), savings: getTotalSavings() }), [getBalance, getTotalIncome, getTotalExpenses, getTotalSavings])

  const value = useMemo(() => ({ transactions, budgets, addTransaction, updateTransaction, deleteTransaction, addBudget, updateBudget, deleteBudget, getBalance, getTotalIncome, getTotalExpenses, getTotalSavings, getExpensesByCategory, getMonthlyExpenses, getMonthlyIncome, getSummary, searchTransactions, filterByCategory, filterByType, filterByDate }), [transactions, budgets, addTransaction, updateTransaction, deleteTransaction, addBudget, updateBudget, deleteBudget, getBalance, getTotalIncome, getTotalExpenses, getTotalSavings, getExpensesByCategory, getMonthlyExpenses, getMonthlyIncome, getSummary, searchTransactions, filterByCategory, filterByType, filterByDate])
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinanceContext() {
  const context = useContext(FinanceContext)
  if (!context) throw new Error('useFinanceContext must be used within FinanceProvider')
  return context
}
