import { useStore } from '../../store/useStore'
import { useEffect } from 'react'

export default function PWABanner() {
  const { showInstallBanner, setDeferredPrompt, dismissInstallBanner, installPWA } = useStore(s => ({
    showInstallBanner:    s.showInstallBanner,
    setDeferredPrompt:    s.setDeferredPrompt,
    dismissInstallBanner: s.dismissInstallBanner,
    installPWA:           s.installPWA,
  }))

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [setDeferredPrompt])

  if (!showInstallBanner) return null

  return (
    <div className="pwa-banner">
      <span style={{ fontSize: 28 }}>🏀</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Installer HoopStats Pro</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Accès rapide depuis votre écran d'accueil</div>
      </div>
      <button className="btn btn-primary btn-sm" onClick={installPWA}>Installer</button>
      <button className="btn btn-ghost btn-sm btn-icon" onClick={dismissInstallBanner}>✕</button>
    </div>
  )
}
