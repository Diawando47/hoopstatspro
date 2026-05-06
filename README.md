# 🏀 HoopStats Pro

Application PWA de gestion et d'analyse de performances basketball pour clubs.

## Stack
- **React 18** + Vite + **vite-plugin-pwa**
- **Zustand** — state management
- **Dexie.js** — IndexedDB (100% offline)
- **Framer Motion** — animations
- **Gemini Flash 2.0** — rapports IA intelligents

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la clé API Gemini (gratuite)
cp .env.example .env
# Éditez .env et ajoutez votre clé depuis https://aistudio.google.com/apikey

# 3. Lancer en dev
npm run dev
```

## Build production (PWA)

```bash
npm run build
npm run preview
```

## Clé API Gemini

1. Allez sur https://aistudio.google.com/apikey
2. Cliquez **"Create API Key"** (gratuit, 15 req/min)
3. Copiez la clé dans votre fichier `.env` :
   ```
   VITE_GEMINI_API_KEY=AIza...
   ```
4. Sur Vercel : ajoutez la variable dans **Settings → Environment Variables**

## Structure

```
src/
├── pages/          Dashboard, Matches, MatchDetail, Players, Stats, Reports, NotFound
├── components/     Sidebar (desktop), BottomNav (mobile), Modal, Toast, Avatar...
├── hooks/          useStats.js  — helpers métier + live queries Dexie
├── store/          useStore.js  — Zustand (UI, Toast, Reports)
├── services/       geminiApi.js — Gemini Flash 2.0 + prompt builders
├── db/             db.js        — Dexie schema
└── styles/         globals.css  — design system dark theme orange
```

## Navigation adaptative

- **Mobile** → Bottom Navigation Bar + FAB central pour créer un match
- **Desktop** → Sidebar collapsible avec raccourcis

## Bugs corrigés (v1.1)

- StatForm : race condition avec Dexie au premier render
- MatchDetail : crash sur URL invalide (NaN matchId)
- Reports : spinner bloqué sur erreur API (finally manquant)
- Sidebar : 100vh → 100dvh (Safari mobile)
- Route 404 ajoutée

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
