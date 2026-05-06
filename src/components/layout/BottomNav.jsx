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
        {/* ✅ Bug 5 corrigé — button natif évite le double event tap/click sur mobile */}
        <button
          className="fab"
          onClick={openModal.bind(null, 'match')}
          aria-label="Nouveau match"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          +
        </button>
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
