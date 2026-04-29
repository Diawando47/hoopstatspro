export default function PageHeader({ title, titleAccent, subtitle, children }) {
  return (
    <div style={{
      padding: '24px 28px 0',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
    }}>
      <div>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 32, fontWeight: 800, letterSpacing: .5,
        }}>
          {title}{' '}
          {titleAccent && <span style={{ color: 'var(--orange)' }}>{titleAccent}</span>}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{subtitle}</p>
        )}
      </div>
      {children && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          {children}
        </div>
      )}
    </div>
  )
}
