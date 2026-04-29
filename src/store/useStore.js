import { create } from 'zustand'

// ── TOAST ──────────────────────────────────────────────
export const useToastStore = create((set) => ({
  message: null,
  visible: false,
  show: (message) => {
    set({ message, visible: true })
    setTimeout(() => set({ visible: false }), 2600)
  },
}))

// ── UI / MODAL ─────────────────────────────────────────
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // modal: null | { type: 'match'|'player'|'stat', data: {} }
  modal: null,
  openModal:  (type, data = {}) => set({ modal: { type, data } }),
  closeModal: ()                => set({ modal: null }),
}))

// ── REPORTS ────────────────────────────────────────────
export const useReportStore = create((set) => ({
  loading:  false,
  content:  null,
  type:     null,
  statsTab: 'points',

  setLoading:  (v)    => set({ loading: v }),
  setReport:   (content, type) => set({ content, type, loading: false }),
  clearReport: ()     => set({ content: null, type: null }),
  setStatsTab: (tab)  => set({ statsTab: tab }),
}))
