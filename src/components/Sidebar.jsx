import { NavLink, useNavigate } from 'react-router-dom'
import {
  Shield, Users, FileText, AlertTriangle, BarChart3,
  Activity, LogOut, ChevronRight, PlusCircle, List,
  ClipboardList, Search, TrendingUp, Server, Network, Bell
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useNotificationsStore } from '../store/notificationsStore'
import toast from 'react-hot-toast'
import { Button } from './ui/Button'
import { Avatar } from './ui/Avatar'
import './Sidebar.css'

const NAV_BY_ROLE = {
  policyholder: [
    { icon: Users, label: 'My Claims', to: '/dashboard', end: true },
    { icon: Shield, label: 'My Policies', to: '/dashboard/policies' },
    { icon: FileText, label: 'Speak to ClaimAI', to: '/dashboard/rag-chat' },
    { icon: Bell, label: 'Notifications', to: '/dashboard/notifications' },
  ],
  adjuster: [
    { icon: FileText, label: 'Claim Queue', to: '/dashboard', end: true },
    { icon: Network, label: 'Knowledge Base', to: '/dashboard/knowledge-graph' },
    { icon: Bell, label: 'Notifications', to: '/dashboard/notifications' },
  ],
  siu_investigator: [
    { icon: Search, label: 'Fraud Cases', to: '/dashboard', end: true },
    { icon: Network, label: 'Knowledge Base', to: '/dashboard/knowledge-graph' },
    { icon: Bell, label: 'Notifications', to: '/dashboard/notifications' },
  ],
  supervisor: [
    { icon: TrendingUp, label: 'KPI Reports', to: '/dashboard', end: true },
    { icon: Network, label: 'Knowledge Base', to: '/dashboard/knowledge-graph' },
    { icon: Bell, label: 'Notifications', to: '/dashboard/notifications' },
  ],
  it_ops: [
    { icon: Server, label: 'System Health', to: '/dashboard', end: true },
    { icon: Network, label: 'Knowledge Base', to: '/dashboard/knowledge-graph' },
    { icon: Bell, label: 'Notifications', to: '/dashboard/notifications' },
  ],
}

const ROLE_COLOR = {
  policyholder: 'var(--primary)',
  adjuster: 'var(--primary)',
  siu_investigator: 'var(--primary)',
  supervisor: 'var(--primary)',
  it_ops: 'var(--primary)',
}

const ROLE_LABEL = {
  policyholder: 'Claimant Portal',
  adjuster: 'Adjuster Console',
  siu_investigator: 'SIU Dashboard',
  supervisor: 'KPI Center',
  it_ops: 'Ops Monitor',
}

export default function Sidebar({ role }) {
  const logout = useAuthStore(s => s.logout)
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()
  const navItems = NAV_BY_ROLE[role] || []
  const color = ROLE_COLOR[role] || 'var(--primary)'
  const unreadCount = useNotificationsStore(s => s.unreadCount)

  function handleLogout() {
    logout()
    toast.success('Signed out')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon" style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${color} 60%, transparent), ${color})` }}>
          <Shield size={16} />
        </div>
        <span className="logo-text">Claim<span className="gradient-text">AI</span></span>
      </div>

      {/* Role badge */}
      <div className="sidebar-role-badge" style={{ '--r-color': color }}>
        {ROLE_LABEL[role] || role}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={!!item.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={{ '--link-color': color }}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
            {item.label === 'Notifications' && unreadCount > 0 && (
              <span className="sidebar-notif-badge">{unreadCount}</span>
            )}
            <ChevronRight
              size={14}
              className="sidebar-link-arrow"
              style={item.label === 'Notifications' && unreadCount > 0 ? { marginLeft: 0 } : {}}
            />
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <Avatar 
            fallback={user?.full_name?.[0] || '?'} 
            // className="w-8 h-8 font-bold text-white shadow-sm"
            style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${color} 50%, transparent), ${color})` }}
          />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.full_name}</div>
            <div className="sidebar-user-role">{user?.email}</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
