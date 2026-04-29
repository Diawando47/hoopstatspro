import { create } from 'zustand'

// ─── UI Store (état de navigation, modals, notifs) ────
// Les données métier vivent dans Dexie (IndexedDB).
// Ce store gère uniquement l'état d'interface.

export const useUIStore = create((set) => ({
  // Notification toast
  notification: null,
  showNotif: (msg, type = 'success') => {
    set({ notification: { msg, type } })
    setTimeout(() => set({ notification: null }), 2800)
  },

  // Modal
  modal: null, // { type: 'match' | 'player' | 'stat', data: {} }
  openModal:  (type, data = {}) => set({ modal: { type, data } }),
  closeModal: () => set({ modal: null }),

  // Sidebar collapsed (mobile)
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar:  () => set({ sidebarOpen: false }),
}))
