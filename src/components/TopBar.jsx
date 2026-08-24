import { useState, useEffect } from 'react'
import { Bell, Search, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNotificationsStore } from '../store/notificationsStore'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import './TopBar.css'

export default function TopBar({ user }) {
  const navigate = useNavigate()
  const { unreadCount, fetchNotifications } = useNotificationsStore()
  
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const ROLE_LABEL = {
    policyholder:    'Claimant Portal',
    adjuster:        'Adjuster Console',
    siu_investigator:'SIU Dashboard',
    supervisor:      'KPI Command Center',
    it_ops:          'IT/Ops Monitor',
  }

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-title">{ROLE_LABEL[user?.role] || 'Dashboard'}</span>
      </div>
      <div className="topbar-right">
        <div className="topbar-search">
          <Search size={14} className="text-muted-foreground"/>
          <input placeholder="Search claims…" className="pl-8 h-9 bg-transparent border-none shadow-none focus:border-border focus:bg-background" />
        </div>
        <button 
          className="topbar-icon-btn"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {isDark ? <Sun size={18}/> : <Moon size={18}/>}
        </button>
        <button 
          className="topbar-icon-btn"
          onClick={() => navigate('/dashboard/notifications')}
        >
          <Bell size={18}/>
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount}</span>
          )}
        </button>
        <div className="topbar-greeting">
          Hi, <strong>{user?.full_name?.split(' ')[0]}</strong>
        </div>
      </div>
    </header>
  )
}
