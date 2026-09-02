import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Category, Transaction } from '@/types/finance'

const schema = z.object({ title: z.string().min(1, 'Title is required'), amount: z.number().positive('Amount must be greater than 0'), category: z.string().min(1, 'Category is required'), date: z.string().min(1, 'Date is required'), description: z.string(), type: z.enum(['income', 'expense']) })
type Values = z.infer<typeof schema>

export function TransactionForm({ categories, initial, onSubmit, onCancel }: { categories: Category[]; initial?: Transaction; onSubmit: (values: Values) => void; onCancel: () => void }) {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: initial ? { ...initial } : { type: 'expense', title: '', amount: 0, category: '', date: new Date().toISOString().slice(0, 10), description: '' } })
  useEffect(() => { form.reset(initial ? { ...initial } : { type: 'expense', title: '', amount: 0, category: '', date: new Date().toISOString().slice(0, 10), description: '' }) }, [initial, form])
  const error = (name: keyof Values) => form.formState.errors[name]?.message
  return <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
    <div className="grid gap-4 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="type">Transaction type</Label><Select value={form.watch('type')} onValueChange={(v) => form.setValue('type', v as Values['type'])}><SelectTrigger id="type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="expense">Expense</SelectItem><SelectItem value="income">Income</SelectItem></SelectContent></Select></div><div className="flex flex-col gap-2"><Label htmlFor="amount">Amount</Label><Input id="amount" type="number" step="0.01" {...form.register('amount', { valueAsNumber: true })} />{error('amount') && <p className="text-xs text-destructive">{error('amount')}</p>}</div></div>
    <div className="flex flex-col gap-2"><Label htmlFor="title">Title</Label><Input id="title" placeholder="e.g. Grocery shopping" {...form.register('title')} />{error('title') && <p className="text-xs text-destructive">{error('title')}</p>}</div>
    <div className="grid gap-4 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="category">Category</Label><Select value={form.watch('category')} onValueChange={(v) => v && form.setValue('category', v, { shouldValidate: true })}><SelectTrigger id="category"><SelectValue placeholder="Choose category" /></SelectTrigger><SelectContent>{categories.filter((c) => c.type === 'both' || c.type === form.watch('type')).map((category) => <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>)}</SelectContent></Select>{error('category') && <p className="text-xs text-destructive">{error('category')}</p>}</div><div className="flex flex-col gap-2"><Label htmlFor="date">Date</Label><Input id="date" type="date" {...form.register('date')} />{error('date') && <p className="text-xs text-destructive">{error('date')}</p>}</div></div>
    <div className="flex flex-col gap-2"><Label htmlFor="description">Description</Label><Input id="description" placeholder="Optional note" {...form.register('description')} /></div>
    <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit">{initial ? 'Save changes' : 'Add transaction'}</Button></div>
  </form>
}
