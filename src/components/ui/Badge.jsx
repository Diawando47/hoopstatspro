export default function Badge({ type = 'pos', children }) {
  const cls = {
    w:   'badge badge-w',
    l:   'badge badge-l',
    n:   'badge badge-n',
    pos: 'badge badge-pos',
  }
  return <span className={cls[type] ?? 'badge'}>{children}</span>
}
