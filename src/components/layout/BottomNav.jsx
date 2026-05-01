import { NavLink } from 'react-router-dom'
import { useUIStore } from '../../store/useStore'

const NAV = [
  { to: '/',        icon: '📊', label: 'Dashboard', end: true },
  { to: '/matches', icon: '🏀', label: 'Matchs' },
  { to: '/players', icon: '👥', label: 'Joueurs' },
  { to: '/reports', icon: '🤖', label: 'Rapports' },
]

export default function BottomNav() {
  const { openModal } = useUIStore()

  return (
    <nav className="bottom-nav">
      {/* Item 1 + 2 */}
      {NAV.slice(0, 2).map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            'bottom-nav-item' + (isActive ? ' active' : '')
          }
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.label}</span>
              {isActive && <span className="bottom-nav-dot" />}
            </>
          )}
        </NavLink>
      ))}

      {/* FAB central */}
      <div
        className="bottom-nav-item"
        style={{ flex: 'none', padding: '0 8px' }}
      >
        <div className="fab" onClick={() => openModal('match')}>+</div>
      </div>

      {/* Item 3 + 4 */}
      {NAV.slice(2).map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            'bottom-nav-item' + (isActive ? ' active' : '')
          }
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.label}</span>
              {isActive && <span className="bottom-nav-dot" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
