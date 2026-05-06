import { NavLink } from 'react-router-dom'
import { useUIStore } from '../../store/useStore'
import {
  LayoutDashboard, Trophy, Users,
  BarChart2, FileText, ChevronLeft, ChevronRight
} from 'lucide-react'

const NAV = [
  { section: 'Principal' },
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { section: 'Gestion' },
  { to: '/matches', icon: Trophy,          label: 'Matchs' },
  { to: '/players', icon: Users,           label: 'Joueurs' },
  { to: '/stats',   icon: BarChart2,       label: 'Statistiques' },
  { section: 'Analyse' },
  { to: '/reports', icon: FileText,        label: 'Rapports',     badge: 'IA' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <aside style={{
      width: sidebarOpen ? 'var(--sidebar-w)' : 'var(--sidebar-w-collapsed)',
      minWidth: sidebarOpen ? 'var(--sidebar-w)' : 'var(--sidebar-w-collapsed)',
      background: 'var(--panel)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width .2s, min-width .2s',
      overflow: 'hidden',
      position: 'sticky',
      top: 0,
      height: '100dvh',
      zIndex: 10,
    }}>

      {/* Logo */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid var(--border)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {sidebarOpen ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Logo orbite */}
            <svg width="36" height="36" viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
              <rect width="64" height="64" rx="14" fill="#0f0f18"/>
              <circle cx="32" cy="32" r="28" fill="none" stroke="#ff6b2b" strokeWidth="1.2" opacity="0.15"/>
              <circle cx="32" cy="32" r="22" fill="none" stroke="#ff6b2b" strokeWidth="1" opacity="0.25"/>
              <circle cx="32" cy="32" r="14" fill="#ff6b2b"/>
              <line x1="32" y1="18" x2="32" y2="46" stroke="#0f0f18" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="18" y1="32" x2="46" y2="32" stroke="#0f0f18" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M18 32 Q23 23 32 18" stroke="#0f0f18" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <path d="M18 32 Q23 41 32 46" stroke="#0f0f18" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <path d="M46 32 Q41 23 32 18" stroke="#0f0f18" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <path d="M46 32 Q41 41 32 46" stroke="#0f0f18" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <g className="logo-orbit-dot">
                <circle cx="32" cy="10" r="3.5" fill="#f0b429"/>
              </g>
              <circle cx="32" cy="32" r="22" className="logo-ring-dash" fill="none" stroke="#ff6b2b" strokeWidth="1" strokeDasharray="5 4" opacity="0.45"/>
            </svg>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20, fontWeight: 900, letterSpacing: 1, lineHeight: 1,
                color: 'var(--text)',
              }}>
                HOOP<span style={{ color: 'var(--orange)' }}>STATS</span>
              </div>
              <div style={{
                fontSize: 9, fontWeight: 600, color: 'var(--muted)',
                letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 2,
              }}>
                Pro Analytics
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 64 64">
              <rect width="64" height="64" rx="14" fill="#0f0f18"/>
              <circle cx="32" cy="32" r="28" fill="none" stroke="#ff6b2b" strokeWidth="1.2" opacity="0.15"/>
              <circle cx="32" cy="32" r="22" fill="none" stroke="#ff6b2b" strokeWidth="1" opacity="0.25"/>
              <circle cx="32" cy="32" r="14" fill="#ff6b2b"/>
              <line x1="32" y1="18" x2="32" y2="46" stroke="#0f0f18" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="18" y1="32" x2="46" y2="32" stroke="#0f0f18" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M18 32 Q23 23 32 18" stroke="#0f0f18" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <path d="M18 32 Q23 41 32 46" stroke="#0f0f18" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <path d="M46 32 Q41 23 32 18" stroke="#0f0f18" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <path d="M46 32 Q41 41 32 46" stroke="#0f0f18" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <g className="logo-orbit-dot">
                <circle cx="32" cy="10" r="3.5" fill="#f0b429"/>
              </g>
              <circle cx="32" cy="32" r="22" className="logo-ring-dash" fill="none" stroke="#ff6b2b" strokeWidth="1" strokeDasharray="5 4" opacity="0.45"/>
            </svg>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV.map((item, i) => {
          // Section header
          if (item.section) {
            return sidebarOpen ? (
              <div key={i} style={{
                padding: '8px 16px 3px',
                fontSize: 10, fontWeight: 700,
                color: 'var(--muted)',
                letterSpacing: 2,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                {item.section}
              </div>
            ) : <div key={i} style={{ height: 6 }} />
          }

          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: sidebarOpen ? '9px 18px' : '9px 0',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                textDecoration: 'none',
                fontSize: 14, fontWeight: 500,
                color: isActive ? 'var(--orange)' : 'var(--muted)',
                background: isActive ? 'rgba(255,107,43,.1)' : 'transparent',
                borderLeft: `3px solid ${isActive ? 'var(--orange)' : 'transparent'}`,
                transition: 'all .15s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                minHeight: 40,
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} style={{ flexShrink: 0 }} />
                  {sidebarOpen && (
                    <>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          background: 'var(--danger)',
                          color: '#fff',
                          fontSize: 9, fontWeight: 700,
                          padding: '2px 6px', borderRadius: 10,
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse button */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <button
          onClick={toggleSidebar}
          className="btn btn-ghost btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {sidebarOpen
            ? <><ChevronLeft size={14} /><span>Réduire</span></>
            : <ChevronRight size={14} />
          }
        </button>
      </div>
    </aside>
  )
}
