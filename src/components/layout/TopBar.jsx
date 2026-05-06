// TopBar — visible uniquement sur mobile, en haut de chaque page
import { useUIStore } from '../../store/useStore'

export default function TopBar() {
  const { openModal } = useUIStore()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px 0',
    }}>
      {/* Logo orbite animé */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="34" height="34" viewBox="0 0 64 64">
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
          <circle
            cx="32" cy="32" r="22"
            className="logo-ring-dash"
            fill="none" stroke="#ff6b2b"
            strokeWidth="1" strokeDasharray="5 4" opacity="0.45"
          />
        </svg>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18, fontWeight: 900,
            letterSpacing: 1, lineHeight: 1,
            color: 'var(--text)',
          }}>
            HOOP<span style={{ color: 'var(--orange)' }}>STATS</span>
          </div>
          <div style={{
            fontSize: 8, fontWeight: 600,
            color: 'var(--muted)', letterSpacing: 2.5,
            textTransform: 'uppercase', marginTop: 1,
          }}>
            Pro Analytics
          </div>
        </div>
      </div>
    </div>
  )
}
