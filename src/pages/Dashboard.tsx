import { motion } from 'motion/react'
import { ArrowDownLeft, ArrowUpRight, Banknote, Car, ChevronDown, CircleDollarSign, CreditCard, Ellipsis, Film, HeartPulse, Home, MoreHorizontal, ShoppingBag, ShoppingCart, Utensils, Wallet, Zap } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis, Area, AreaChart, CartesianGrid } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const monthlySpend = [
  { month: 'Jan', expenses: 2850, income: 7200 }, { month: 'Feb', expenses: 3120, income: 7200 }, { month: 'Mar', expenses: 2640, income: 7600 },
  { month: 'Apr', expenses: 3380, income: 7600 }, { month: 'May', expenses: 2980, income: 7600 }, { month: 'Jun', expenses: 3560, income: 7800 },
  { month: 'Jul', expenses: 3140, income: 7800 }, { month: 'Aug', expenses: 2840, income: 7800 }, { month: 'Sep', expenses: 2260, income: 7800 },
]
const categories = [
  { name: 'Food', value: 620, color: 'var(--chart-1)', icon: Utensils }, { name: 'Bills', value: 480, color: 'var(--chart-2)', icon: Zap },
  { name: 'Shopping', value: 390, color: 'var(--chart-3)', icon: ShoppingBag }, { name: 'Transport', value: 280, color: 'var(--chart-4)', icon: Car },
  { name: 'Health', value: 210, color: 'var(--chart-5)', icon: HeartPulse }, { name: 'Other', value: 180, color: 'var(--muted-foreground)', icon: MoreHorizontal },
]
const transactions = [
  { description: 'Whole Foods Market', category: 'Food', date: 'Sep 02, 2026', type: 'Expense', amount: '-$86.42', icon: Utensils },
  { description: 'Acme Corp. Payroll', category: 'Income', date: 'Sep 01, 2026', type: 'Income', amount: '+$7,800.00', icon: Banknote },
  { description: 'Netflix', category: 'Entertainment', date: 'Aug 30, 2026', type: 'Expense', amount: '-$19.99', icon: Film },
  { description: 'Uber', category: 'Transport', date: 'Aug 29, 2026', type: 'Expense', amount: '-$24.80', icon: Car },
  { description: 'CVS Pharmacy', category: 'Health', date: 'Aug 28, 2026', type: 'Expense', amount: '-$42.15', icon: HeartPulse },
]
const budgets = [
  { name: 'Food', spent: 620, limit: 800, icon: Utensils }, { name: 'Transport', spent: 280, limit: 400, icon: Car },
  { name: 'Bills', spent: 480, limit: 500, icon: Zap }, { name: 'Entertainment', spent: 180, limit: 300, icon: Film },
]
const currency = (amount: number) => `$${amount.toLocaleString('en-US')}`

function SummaryCard({ title, value, change, detail, icon: Icon, tone }: { title: string; value: string; change: string; detail: string; icon: typeof Wallet; tone: string }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
    <div className="flex items-start justify-between"><div className={`grid size-10 place-items-center rounded-xl ${tone}`}><Icon className="size-5" /></div><Tooltip><TooltipTrigger aria-label={`More about ${title}`}><span className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><Ellipsis className="size-4" /></span></TooltipTrigger><TooltipContent>View details</TooltipContent></Tooltip></div>
    <p className="mt-5 text-sm text-muted-foreground">{title}</p><p className="mt-1 font-mono text-2xl font-semibold tracking-tight">{value}</p>
    <div className="mt-3 flex items-center gap-2 text-xs"><span className="flex items-center gap-1 font-semibold text-primary"><ArrowUpRight className="size-3" />{change}</span><span className="text-muted-foreground">{detail}</span></div>
    <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted"><div className="h-full w-2/3 rounded-full bg-primary" /></div>
  </motion.div>
}

export default function Dashboard() {
  return <TooltipProvider><div className="mx-auto flex max-w-[1500px] flex-col gap-6 p-5 md:gap-8 md:p-8">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-primary">Tuesday, September 2, 2026</p><h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Good morning, Alex.</h2><p className="mt-2 text-muted-foreground">Here&apos;s your financial pulse for this month.</p></div><Button><ArrowUpRight data-icon="inline-start" />Add transaction</Button></motion.div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard title="Total balance" value="$24,680.00" change="8.4%" detail="vs. last month" icon={Wallet} tone="bg-primary/10 text-primary" /><SummaryCard title="Total income" value="$7,800.00" change="5.2%" detail="vs. last month" icon={ArrowDownLeft} tone="bg-chart-2/15 text-chart-2" /><SummaryCard title="Total expenses" value="$2,260.40" change="12.1%" detail="vs. last month" icon={ArrowUpRight} tone="bg-destructive/10 text-destructive" /><SummaryCard title="Total savings" value="$5,539.60" change="14.8%" detail="vs. last month" icon={CircleDollarSign} tone="bg-chart-4/15 text-chart-4" /></div>
    <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
      <Card><CardHeader><CardTitle>Spending overview</CardTitle><CardDescription>Your expenses and income over the last 9 months.</CardDescription><CardAction><Button variant="outline" size="sm">This year <ChevronDown data-icon="inline-end" /></Button></CardAction></CardHeader><CardContent><div className="h-[280px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthlySpend} margin={{ left: -20, right: 8, top: 10 }}><defs><linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} /><ChartTooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12 }} /><Area type="monotone" dataKey="expenses" stroke="var(--primary)" strokeWidth={3} fill="url(#expenseFill)" /><Area type="monotone" dataKey="income" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="5 5" fill="none" /></AreaChart></ResponsiveContainer></div><div className="mt-2 flex items-center gap-5 text-xs text-muted-foreground"><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-primary" />Expenses</span><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-chart-2" />Income</span></div></CardContent></Card>
      <Card><CardHeader><CardTitle>Expense categories</CardTitle><CardDescription>Where your money went this month.</CardDescription></CardHeader><CardContent><div className="relative mx-auto h-[190px] w-full max-w-[280px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categories} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3} strokeWidth={0}>{categories.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><ChartTooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12 }} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center"><div className="text-center"><p className="font-mono text-xl font-semibold">$2,160</p><p className="text-xs text-muted-foreground">Total spent</p></div></div></div><div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-3">{categories.slice(0, 6).map(({ name, value, color }) => <div key={name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-muted-foreground"><i className="size-2 rounded-full" style={{ backgroundColor: color }} />{name}</span><span className="font-medium">{currency(value)}</span></div>)}</div></CardContent></Card>
    </div>
    <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]"><Card><CardHeader><CardTitle>Recent transactions</CardTitle><CardDescription>Your latest account activity.</CardDescription><CardAction><Button variant="ghost" size="sm">View all <ArrowUpRight data-icon="inline-end" /></Button></CardAction></CardHeader><CardContent className="px-0"><Table><TableHeader><TableRow><TableHead className="pl-6">Description</TableHead><TableHead>Category</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead className="pr-6 text-right">Amount</TableHead></TableRow></TableHeader><TableBody>{transactions.map(({ description, category, date, type, amount, icon: Icon }) => <TableRow key={description}><TableCell className="pl-6"><div className="flex items-center gap-3"><div className="grid size-8 place-items-center rounded-lg bg-muted"><Icon className="size-4 text-muted-foreground" /></div><span className="font-medium">{description}</span></div></TableCell><TableCell><Badge variant="secondary">{category}</Badge></TableCell><TableCell className="text-muted-foreground">{date}</TableCell><TableCell><span className={`text-xs ${type === 'Income' ? 'text-chart-2' : 'text-muted-foreground'}`}>{type}</span></TableCell><TableCell className={`pr-6 text-right font-mono font-medium ${type === 'Income' ? 'text-chart-2' : ''}`}>{amount}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      <Card><CardHeader><CardTitle>Budget overview</CardTitle><CardDescription>Monthly category limits.</CardDescription><CardAction><Button variant="ghost" size="icon-sm" aria-label="More budget options"><MoreHorizontal /></Button></CardAction></CardHeader><CardContent className="flex flex-col gap-5">{budgets.map(({ name, spent, limit, icon: Icon }) => { const percentage = Math.round(spent / limit * 100); return <div key={name}><div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-medium"><Icon className="size-4 text-muted-foreground" />{name}</span><span className="font-mono text-xs text-muted-foreground">{currency(spent)} / {currency(limit)}</span></div><Progress value={percentage} className={`mt-2 ${percentage > 90 ? '[&_[data-slot=progress-indicator]]:bg-destructive' : ''}`} /><div className="mt-1 text-right text-[11px] text-muted-foreground">{percentage}% used</div></div>})}</CardContent></Card>
    </div>
  </div></TooltipProvider>
}
