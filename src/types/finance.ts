export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  title: string
  amount: number
  type: TransactionType
  category: string
  date: string
  description: string
  createdAt: string
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  month: number
  year: number
}

export interface Category {
  id: string
  name: string
  type: TransactionType | 'both'
  icon: string
}

export interface FinancialSummary {
  balance: number
  income: number
  expenses: number
  savings: number
}

export interface DateRange {
  from?: string
  to?: string
}

export interface MonthlyTotal {
  month: string
  total: number
}
