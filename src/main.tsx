import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { FinanceProvider } from './context/FinanceContext'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(<StrictMode><ThemeProvider><FinanceProvider><BrowserRouter><App /></BrowserRouter></FinanceProvider></ThemeProvider></StrictMode>)
