import { initials } from '../../hooks/useStats'

export default function Avatar({ name = '', color = '#ff6b2b', size = 32 }) {
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: `${color}22`,
        color,
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  )
}
