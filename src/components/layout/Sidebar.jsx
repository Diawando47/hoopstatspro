import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Trophy, Users, BarChart2, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { useUIStore } from '../../store/useStore'

const NAV = [
  { section: 'Principal' },
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { section: 'Gestion' },
  { to: '/matches', icon: Trophy,          label: 'Matchs' },
  { to: '/players', icon: Users,           label: 'Joueurs' },
  { to: '/stats',   icon: BarChart2,       label: 'Statistiques' },
  { section: 'Analyse' },
  { to: '/reports', icon: FileText,        label: 'Rapports', badge: 'IA' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const w = sidebarOpen ? 220 : 64

  return (
    <aside style={{
      width: w,
      minWidth: w,
      background: 'var(--panel)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width .2s, min-width .2s',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid var(--border)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}>
        {sidebarOpen ? (
          <>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26, fontWeight: 900, letterSpacing: 1, lineHeight: 1,
            }}>
              HOOP<span style={{ color: 'var(--orange)' }}>STATS</span>
            </div>
            <div style={{
              fontSize: 10, fontWeight: 500, color: 'var(--muted)',
              letterSpacing: 3, textTransform: 'uppercase', marginTop: 2,
            }}>
              Pro Analytics
            </div>
          </>
        ) : (
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20, fontWeight: 900,
            color: 'var(--orange)', textAlign: 'center',
          }}>
            🏀
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV.map((item, i) => {
          // Section header
          if (item.section) {
            return sidebarOpen ? (
              <div key={i} style={{
                padding: '8px 16px 4px',
                fontSize: 10, fontWeight: 600,
                color: 'var(--muted)',
                letterSpacing: 2,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                {item.section}
              </div>
            ) : <div key={i} style={{ height: 8 }} />
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
      <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
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
