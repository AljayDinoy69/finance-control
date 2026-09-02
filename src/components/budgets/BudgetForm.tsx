import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Budget, Category } from '@/types/finance'

const schema = z.object({ category: z.string().min(1, 'Category is required'), limit: z.number().positive('Limit must be greater than 0'), month: z.string(), year: z.string() })
export type BudgetFormValues = z.infer<typeof schema>

export function BudgetForm({ categories, initial, onSubmit, onCancel }: { categories: Category[]; initial?: Budget; onSubmit: (values: BudgetFormValues) => void; onCancel: () => void }) {
  const now = new Date()
  const form = useForm<BudgetFormValues>({ resolver: zodResolver(schema), defaultValues: initial ? { category: initial.category, limit: initial.limit, month: String(initial.month), year: String(initial.year) } : { category: '', limit: 0, month: String(now.getMonth() + 1), year: String(now.getFullYear()) } })
  const error = (name: keyof BudgetFormValues) => form.formState.errors[name]?.message
  return <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4"><div className="flex flex-col gap-2"><Label htmlFor="budget-category">Category</Label><Select value={form.watch('category')} onValueChange={(value) => value && form.setValue('category', value, { shouldValidate: true })}><SelectTrigger id="budget-category"><SelectValue placeholder="Choose category" /></SelectTrigger><SelectContent>{categories.filter((category) => category.type !== 'income').map((category) => <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>)}</SelectContent></Select>{error('category') && <p className="text-xs text-destructive">{error('category')}</p>}</div><div className="flex flex-col gap-2"><Label htmlFor="budget-limit">Monthly limit</Label><Input id="budget-limit" type="number" step="0.01" {...form.register('limit', { valueAsNumber: true })} />{error('limit') && <p className="text-xs text-destructive">{error('limit')}</p>}</div><div className="grid grid-cols-2 gap-4"><div className="flex flex-col gap-2"><Label htmlFor="budget-month">Month</Label><Select value={form.watch('month')} onValueChange={(value) => value && form.setValue('month', value)}><SelectTrigger id="budget-month"><SelectValue /></SelectTrigger><SelectContent>{Array.from({ length: 12 }, (_, index) => <SelectItem key={index + 1} value={String(index + 1)}>{new Date(2026, index).toLocaleString('en', { month: 'long' })}</SelectItem>)}</SelectContent></Select></div><div className="flex flex-col gap-2"><Label htmlFor="budget-year">Year</Label><Input id="budget-year" type="number" {...form.register('year')} /></div></div><div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit">{initial ? 'Save changes' : 'Create budget'}</Button></div></form>
}
