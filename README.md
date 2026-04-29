# 🏀 HoopStats Pro

Application PWA de gestion et d'analyse de performances basketball pour clubs.

## Stack
- **React 18** + Vite
- **Zustand** — state management
- **Dexie.js** — IndexedDB (100% offline)
- **Framer Motion** — animations
- **vite-plugin-pwa** — Service Worker + manifest
- **Claude AI** — rapports intelligents

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvre `http://localhost:5173`

## Build production (PWA)

```bash
npm run build
npm run preview
```

## Structure

```
src/
├── pages/          Dashboard, Matches, MatchDetail, Players, Stats, Reports
├── components/     Sidebar, Modal, Toast, Avatar, StatCard, Sparkline + forms
├── hooks/          useStats.js  — helpers métier + live queries Dexie
├── store/          useStore.js  — Zustand (UI, Toast, Reports)
├── services/       claudeApi.js — appels API Claude + prompt builders
├── db/             db.js        — Dexie schema + seed data
└── styles/         globals.css  — design system dark theme orange
```

## Modules

| Module | Page | Description |
|--------|------|-------------|
| Dashboard | `/` | KPIs, dernier match, MVP, top scoreurs, tendance |
| Matchs | `/matches` | Liste + création de matchs |
| Détail Match | `/matches/:id` | Score, MVP calculé, stats joueurs |
| Joueurs | `/players` | Cartes joueurs + stats moyennes + suppression |
| Statistiques | `/stats` | Classement saison par catégorie |
| Rapports IA | `/reports` | Analyses Claude AI (saison, MVP, tendances, joueur) |

## PWA

L'app s'installe comme une application native sur mobile et desktop.
Les données sont stockées localement via IndexedDB — fonctionne **100% offline** (sauf les rapports IA).

## MVP Formula

```
Impact = points × 1.0 + rebounds × 0.7 + assists × 0.8 + steals × 1.2
```
