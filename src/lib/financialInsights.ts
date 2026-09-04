import type { Budget, Transaction } from '@/types/finance'

export type Insight = { title: string; message: string; tone: 'positive' | 'neutral' | 'warning' }
export const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
export const previousMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() - 1, 1)
export const transactionsForMonth = (items: Transaction[], date: Date) => items.filter((item) => item.date.slice(0, 7) === monthKey(date))
export const sumByType = (items: Transaction[], type: Transaction['type']) => items.filter((item) => item.type === type).reduce((sum, item) => sum + item.amount, 0)
export const monthTotals = (items: Transaction[], date: Date) => { const month = transactionsForMonth(items, date); const income = sumByType(month, 'income'); const expenses = sumByType(month, 'expense'); return { income, expenses, savings: income - expenses } }
export const percentChange = (current: number, previous: number) => previous === 0 ? (current === 0 ? 0 : 100) : ((current - previous) / previous) * 100
export const topCategory = (items: Transaction[]) => Object.entries(items.filter((item) => item.type === 'expense').reduce<Record<string, number>>((result, item) => { result[item.category] = (result[item.category] ?? 0) + item.amount; return result }, {})).sort(([, a], [, b]) => b - a)[0] ?? null
export const budgetUsage = (budgets: Budget[]) => { const limit = budgets.reduce((sum, budget) => sum + budget.limit, 0); const spent = budgets.reduce((sum, budget) => sum + budget.spent, 0); return { limit, spent, percent: limit ? (spent / limit) * 100 : 0 } }
export function generateFinancialInsights(items: Transaction[], budgets: Budget[], now = new Date()): Insight[] { const current = monthTotals(items, now); const previous = monthTotals(items, previousMonth(now)); const change = percentChange(current.expenses, previous.expenses); const category = topCategory(transactionsForMonth(items, now)); const usage = budgetUsage(budgets); const delta = current.savings - previous.savings; return [
  { title: 'Spending trend', message: `Your expenses ${change >= 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(0)}% compared with last month.`, tone: change > 0 ? 'warning' : 'positive' },
  { title: 'Top category', message: category ? `${category[0]} is your highest spending category.` : 'Add an expense to see your top spending category.', tone: 'neutral' },
  { title: 'Budget progress', message: usage.limit ? `You have used ${Math.round(usage.percent)}% of your monthly budget.` : 'Set a monthly budget to track your progress.', tone: usage.percent > 90 ? 'warning' : 'neutral' },
  { title: 'Savings movement', message: `Your savings ${delta >= 0 ? 'increased' : 'decreased'} by ₱${Math.abs(delta).toLocaleString('en-US', { maximumFractionDigits: 0 })} this month.`, tone: delta >= 0 ? 'positive' : 'warning' },
  { title: 'Spending target', message: usage.limit && current.expenses < usage.limit ? 'You are currently under your monthly spending target.' : 'Review your spending to stay within your monthly target.', tone: usage.limit && current.expenses < usage.limit ? 'positive' : 'warning' },
] }
export const monthlySeries = (items: Transaction[]) => Object.entries(items.reduce<Record<string, { income: number; expenses: number }>>((result, item) => { const key = item.date.slice(0, 7); result[key] ??= { income: 0, expenses: 0 }; result[key][item.type === 'income' ? 'income' : 'expenses'] += item.amount; return result }, {})).sort(([a], [b]) => a.localeCompare(b)).map(([month, totals]) => ({ month: new Date(`${month}-01T12:00:00`).toLocaleDateString('en-US', { month: 'short' }), ...totals }))
export const categorySeries = (items: Transaction[]) => Object.entries(items.filter((item) => item.type === 'expense').reduce<Record<string, number>>((result, item) => { result[item.category] = (result[item.category] ?? 0) + item.amount; return result }, {})).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
export const latestTransactions = (items: Transaction[], count = 5) => [...items].sort((a, b) => b.date.localeCompare(a.date)).slice(0, count)
export const currency = (amount: number) => `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
export const currentMonthDate = () => new Date(2026, 8, 1)
export const insightToneClass = (tone: Insight['tone']) => tone === 'positive' ? 'bg-chart-2/10 text-chart-2' : tone === 'warning' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
export const clampPercent = (value: number) => Math.min(100, Math.max(0, value))
export const formatMonth = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
export const savingsDelta = (items: Transaction[], now = new Date()) => monthTotals(items, now).savings - monthTotals(items, previousMonth(now)).savings
export const expenseChange = (items: Transaction[], now = new Date()) => percentChange(monthTotals(items, now).expenses, monthTotals(items, previousMonth(now)).expenses)
export const getInsights = generateFinancialInsights
export const getBudgetUsage = budgetUsage
export const getTopCategory = topCategory
export const getMonthlySeries = monthlySeries
export const getCategorySeries = categorySeries
export const getLatestTransactions = latestTransactions
export const formatCurrency = currency
export const getMonthTotals = monthTotals
export const getSavingsDelta = savingsDelta
export const getExpenseChange = expenseChange
