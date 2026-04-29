export default function Sparkline({ values = [], height = 48 }) {
  const max = Math.max(...values, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
      {values.map((v, i) => (
        <div
          key={i}
          title={`${v} pts`}
          style={{
            flex: 1,
            minWidth: 8,
            height: `${Math.round(v / max * 100)}%`,
            background: i === values.length - 1 ? 'var(--orange)' : 'var(--border)',
            borderRadius: '2px 2px 0 0',
            transition: 'background .2s',
            cursor: 'default',
          }}
        />
      ))}
    </div>
  )
}
