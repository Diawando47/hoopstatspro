export default function StatCard({ label, value, change, changeType = 'up', color = 'orange' }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {change && <div className={`stat-change ${changeType}`}>{change}</div>}
    </div>
  )
}
