// ─── Composants UI réutilisables ──────────────────────

// Button
export function Btn({ children, variant = 'primary', size = 'md', onClick, type = 'button', style = {} }) {
  const base = {
    padding: size === 'sm' ? '6px 12px' : '9px 18px',
    fontSize: size === 'sm' ? 12 : 13,
    fontWeight: 600,
    fontFamily: "'Barlow', sans-serif",
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all .15s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    ...style,
  }
  const variants = {
    primary: { background: 'var(--orange)', color: '#fff' },
    ghost:   { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
    danger:  { background: 'rgba(231,76,60,.15)', color: 'var(--danger)', border: '1px solid rgba(231,76,60,.3)' },
  }
  return (
    <button type={type} onClick={onClick} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  )
}

// Badge résultat
export function ResultBadge({ result }) {
  const cfg = {
    V: { bg: 'rgba(46,204,113,.15)',  color: 'var(--success)', label: 'Victoire' },
    D: { bg: 'rgba(231,76,60,.15)',   color: 'var(--danger)',  label: 'Défaite'  },
    N: { bg: 'rgba(112,112,160,.15)', color: 'var(--muted)',   label: 'Nul'      },
  }
  const c = cfg[result] || cfg.N
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      background: c.bg,
      color: c.color,
    }}>
      {c.label}
    </span>
  )
}

// Position badge
export function PosBadge({ pos }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 700,
      background: 'rgba(58,134,255,.12)',
      color: 'var(--blue)',
    }}>
      {pos}
    </span>
  )
}

// Card wrapper
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function CardHeader({ title, children }) {
  return (
    <div style={{
      padding: '14px 18px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <span style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 16, fontWeight: 700, letterSpacing: .5,
        textTransform: 'uppercase', color: 'var(--muted)',
      }}>
        {title}
      </span>
      {children}
    </div>
  )
}

export function CardBody({ children, style = {} }) {
  return <div style={{ padding: 18, ...style }}>{children}</div>
}

// StatCard (top metrics)
export function StatCard({ label, value, change, changeDir, accent = 'orange' }) {
  const accents = { orange: 'var(--orange)', gold: 'var(--gold)', blue: 'var(--blue)', green: 'var(--success)' }
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '16px 18px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accents[accent] }} />
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5 }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 36, fontWeight: 800, lineHeight: 1.1, margin: '4px 0 2px',
      }}>
        {value}
      </div>
      {change && (
        <div style={{ fontSize: 12, fontWeight: 500, color: changeDir === 'up' ? 'var(--success)' : 'var(--danger)' }}>
          {changeDir === 'up' ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  )
}

// Avatar initiales
export function Avatar({ name = '', color = '#3498db', size = 32 }) {
  const inits = name.split(' ').map(w => w[0] || '').join('').toUpperCase().slice(0, 2)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.35,
      background: `${color}20`, color,
      flexShrink: 0,
    }}>
      {inits}
    </div>
  )
}

// Barre de progression (impact score)
export function ProgressBar({ value, max = 60, width = 60 }) {
  const pct = Math.min(value / max * 100, 100)
  return (
    <div style={{ height: 6, width, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--orange)', borderRadius: 3 }} />
    </div>
  )
}

// Sparkline mini graphique
export function Sparkline({ data = [], height = 40 }) {
  if (!data.length) return null
  const max = Math.max(...data)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${Math.round(v / max * 100)}%`,
          background: i === data.length - 1 ? 'var(--orange)' : 'var(--border)',
          borderRadius: '2px 2px 0 0',
          minWidth: 8,
          transition: 'background .2s',
        }} title={`${v}pts`} />
      ))}
    </div>
  )
}

// Score display
export function ScoreDisplay({ scoreA, scoreB, result, size = 44 }) {
  const colorA = result === 'V' ? 'var(--success)' : result === 'D' ? 'var(--danger)' : 'var(--text)'
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: size, fontWeight: 900, color: colorA }}>
        {scoreA}
      </span>
      <span style={{ color: 'var(--muted)', fontSize: size * 0.6 }}>–</span>
      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: size, fontWeight: 900, color: 'var(--muted)' }}>
        {scoreB}
      </span>
    </div>
  )
}
