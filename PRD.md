# Product Requirements Document — Personal OS

**Version:** 1.0
**Date:** March 2026
**Status:** In Development
**Repository:** [github.com/akshatasawant9699/personal-os-dashboard](https://github.com/akshatasawant9699/personal-os-dashboard)
**Live URL:** personal-os-dashboard-sigma.vercel.app

---

## 1. Product Overview

### 1.1 Problem Statement

Professionals and creators who operate across multiple roles — developer, content creator, freelancer, learner — lack a single workspace that helps them manage daily focus, track tasks across life domains, and connect ideas across those domains for maximum output. Existing tools (Notion, Trello, Todoist) solve one slice of this but require significant setup and don't model the "one idea → multiple outputs" workflow.

### 1.2 Product Vision

Personal OS is a personal productivity dashboard for multi-role individuals. It combines daily intention-setting (Rule of Three), a Kanban board, calendar view, and analytics into one authenticated, cloud-persisted web app. It is intentionally single-user and opinionated — a personal operating system, not a team tool.

### 1.3 Target Users

| Persona | Description |
|---|---|
| Multi-role creator | Manages YouTube, LinkedIn, freelance, and a day job simultaneously |
| Developer advocate | Splits time between coding, content, community, and speaking |
| Ambitious professional | Juggles career growth, side projects, and learning goals |
| Solo founder | Runs product, marketing, and ops without a team |

### 1.4 Design Principles

- **Zero friction capture** — ideas should be saved in under 3 seconds
- **One source of truth** — all data lives in one place, never lost on refresh
- **Role-aware** — every task is tagged to a life domain, enabling filtered focus
- **Calendar-native** — tasks with due dates automatically appear on the calendar; no separate scheduling step

---

## 2. Functional Requirements

### 2.1 Authentication

| ID | Requirement | Priority |
|---|---|---|
| AUTH-1 | User signs in via Google OAuth (Firebase Auth) | P0 |
| AUTH-2 | New users complete a 3-step onboarding flow before accessing the app | P0 |
| AUTH-3 | Returning users skip onboarding; all data is restored from Firestore + localStorage | P0 |
| AUTH-4 | Sign-out saves the latest data, clears the local cache, and returns to the sign-in screen | P0 |
| AUTH-5 | Sign-out button shows a spinner and is disabled while in progress | P1 |
| AUTH-6 | User's name and photo are visible in the header while signed in | P2 |

### 2.2 Onboarding

| ID | Requirement | Priority |
|---|---|---|
| OB-1 | Step 1 — collect the user's main areas of focus (free text) | P1 |
| OB-2 | Step 2 — collect the user's purpose for using the app (free text) | P1 |
| OB-3 | Step 3 — let the user create up to 10 custom role tags | P1 |
| OB-4 | Default roles (Work, Personal, Learning) are always included | P1 |
| OB-5 | Completing onboarding writes the initial data to Firestore and localStorage | P0 |
| OB-6 | User can re-trigger onboarding at any time via the Settings icon | P2 |

### 2.3 Board View (Kanban)

#### 2.3.1 Daily Focus Panel

| ID | Requirement | Priority |
|---|---|---|
| BOARD-1 | User can set up to 3 "Top Priorities" for the day | P0 |
| BOARD-2 | User can set up to 2 "Additional Tasks" for the day | P0 |
| BOARD-3 | "Add to Board" button converts all non-empty tasks into cards in the Ideas column; Top Priorities get `priority: high`, Additional Tasks get `priority: low` | P0 |
| BOARD-4 | After adding to board, all daily task inputs are cleared | P1 |

#### 2.3.2 Quick Capture

| ID | Requirement | Priority |
|---|---|---|
| BOARD-5 | Single-line input to instantly capture a task into the Ideas column | P0 |
| BOARD-6 | Pressing Enter or clicking "Add" submits the quick capture | P0 |
| BOARD-7 | Quick-captured cards default to `priority: medium` | P2 |

#### 2.3.3 Kanban Board

| ID | Requirement | Priority |
|---|---|---|
| BOARD-8 | Four fixed columns: Ideas → In Progress → Ready → Done | P0 |
| BOARD-9 | Cards are drag-and-droppable between and within columns | P0 |
| BOARD-10 | Each card shows: title (inline editable), priority badge, due date picker, role tags | P0 |
| BOARD-11 | Clicking a card title makes it inline-editable | P1 |
| BOARD-12 | Card context menu (⋮) offers: Details (expand description), Duplicate, Delete | P1 |
| BOARD-13 | Description textarea expands when "Details" is selected | P1 |
| BOARD-14 | Priority can be set to High / Medium / Low via a select element | P1 |
| BOARD-15 | Due date can be set via a date picker; changes immediately sync to the Calendar view | P0 |
| BOARD-16 | Role tags are toggle buttons on each card; multiple can be active | P1 |
| BOARD-17 | Deleting a card requires confirmation | P1 |

#### 2.3.4 Hub Filter

| ID | Requirement | Priority |
|---|---|---|
| BOARD-18 | Filter buttons above the board narrow cards to a specific hub (All / Career / Personal / Growth) | P0 |
| BOARD-19 | Hub filter is combined with the search query (both apply simultaneously) | P1 |
| BOARD-20 | Users can add, rename, and colour-code custom hubs via a settings panel | P2 |
| BOARD-21 | The "All Tasks" hub cannot be deleted | P1 |

#### 2.3.5 Search

| ID | Requirement | Priority |
|---|---|---|
| BOARD-22 | Global search bar filters cards across all columns by title or description | P1 |
| BOARD-23 | Pressing `/` focuses the search bar | P2 |
| BOARD-24 | Pressing `n` focuses the quick-capture input | P2 |
| BOARD-25 | Pressing `Escape` clears search and closes any open menus | P2 |

### 2.4 Calendar View

| ID | Requirement | Priority |
|---|---|---|
| CAL-1 | Monthly grid view of the current month | P0 |
| CAL-2 | Navigate backward/forward by month; "Today" button returns to current month | P0 |
| CAL-3 | Any card that has a `dueDate` set on the board automatically appears on the matching calendar day — no additional action required | P0 |
| CAL-4 | Due dates are parsed as local midnight to prevent timezone-offset day-shift bugs | P0 |
| CAL-5 | Calendar day cells show up to 3 task pills; overflow shown as "+N more" | P1 |
| CAL-6 | Task pills are colour-coded by priority (red = high, blue = medium, gray = low) | P1 |
| CAL-7 | Clicking a day opens a detail panel below the grid listing all tasks for that day | P1 |
| CAL-8 | Task detail panel shows: title, description snippet, column (board status), role tags, priority dot | P1 |
| CAL-9 | Today's date is highlighted with an orange filled circle | P2 |
| CAL-10 | Days with tasks have a distinct border/background to signal content | P2 |

### 2.5 Analytics View

| ID | Requirement | Priority |
|---|---|---|
| AN-1 | Summary cards: Total Tasks, In Progress count, Done count | P1 |
| AN-2 | Bar chart — Tasks by Status (Ideas / In Progress / Ready / Done) | P1 |
| AN-3 | Progress bars — Tasks by Category (Hub) with percentage | P1 |
| AN-4 | Progress bars — Tasks by Priority (High / Medium / Low) with percentage | P1 |
| AN-5 | Charts update in real-time as cards are added, moved, or deleted | P1 |

### 2.6 Google Calendar Sync

| ID | Requirement | Priority |
|---|---|---|
| GCS-1 | "Sync" button in the header syncs all tasks that have a `dueDate` to Google Calendar | P1 |
| GCS-2 | Tasks are synced from all columns (Ideas, In Progress, Ready, Done) — not just Ready | P0 |
| GCS-3 | Each synced task creates a 1-hour Google Calendar event at 9–10 AM on the task's due date | P1 |
| GCS-4 | Tasks without a due date are skipped; the result message states how many were skipped | P1 |
| GCS-5 | Sync result alert shows: tasks synced, tasks failed, tasks skipped | P1 |
| GCS-6 | If the access token is missing, a clear message prompts the user to sign out and back in | P0 |
| GCS-7 | If the API returns 401/403, the error message identifies token expiry specifically | P0 |
| GCS-8 | Google access token is stored per user UID in localStorage; cleared on sign-out | P1 |

### 2.7 Data Persistence

| ID | Requirement | Priority |
|---|---|---|
| PERSIST-1 | All state changes write to `localStorage` synchronously — survives hard refresh | P0 |
| PERSIST-2 | A 1.5-second debounced write to Firestore runs after every state change for cloud backup | P0 |
| PERSIST-3 | On app load, localStorage is restored first (instant); Firestore is then fetched and applied if it is strictly newer (cross-device sync) | P0 |
| PERSIST-4 | On page unload (`beforeunload`), localStorage is flushed synchronously via a `useRef` — async Firestore saves are not relied upon here | P0 |
| PERSIST-5 | Each user's data is isolated by their Firebase UID | P0 |
| PERSIST-6 | Sign-out clears the user's localStorage cache so another user on the same device starts fresh | P0 |
| PERSIST-7 | The persistence effect is gated on `hasLoadedUserData` — no empty-state overwrites during load | P0 |

**Fields persisted per user:**

```
ruleOfThree, nonPriorityTasks, cards (all 4 columns),
customRoles, userHubs, areasOfFocus, purposeOfUse,
activeTab, selectedHub, currentDate, selectedDate, lastUpdated
```

---

## 3. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Initial load (cold) < 3 s on a 4G connection |
| Availability | Hosted on Vercel; 99.9% uptime via CDN |
| Offline resilience | App renders and functions from localStorage if Firestore is unreachable |
| Security | Firestore rules enforce `request.auth.uid == userId`; no user can read another's data |
| Browser support | Chrome, Edge, Firefox, Safari — latest 2 versions |
| Responsiveness | Board view collapses to 1-column on mobile, 2 on tablet, 4 on desktop |
| Keyboard accessibility | `/` = search, `n` = quick capture, `Escape` = close modals |

---

## 4. Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18.3 + Vite 5.1 |
| Styling | Tailwind CSS 3.4 |
| Icons | lucide-react |
| Drag & Drop | @hello-pangea/dnd |
| Auth | Firebase Auth (Google OAuth) |
| Database | Firebase Firestore |
| Local cache | Browser localStorage (per-user key) |
| Calendar API | Google Calendar REST API v3 |
| Hosting | Vercel |
| CI | GitHub (manual push deploys to Vercel) |

---

## 5. Data Model

### User document (`users/{uid}`)

```json
{
  "ruleOfThree":       ["string", "string", "string"],
  "nonPriorityTasks":  ["string", "string"],
  "cards": {
    "ideas":           [],
    "inProgress":      [],
    "readyToPublish":  [],
    "done":            []
  },
  "customRoles":       [],
  "userHubs":          [],
  "areasOfFocus":      "string",
  "purposeOfUse":      "string",
  "activeTab":         "kanban | calendar | analytics",
  "selectedHub":       "string",
  "currentDate":       "ISO string",
  "selectedDate":      "ISO string | null",
  "lastUpdated":       "ISO string"
}
```

### Card

```json
{
  "id":          "string (Date.now + index)",
  "title":       "string",
  "description": "string",
  "roles":       ["role-id"],
  "priority":    "high | medium | low",
  "dueDate":     "YYYY-MM-DD | null",
  "createdAt":   "ISO string"
}
```

### Role

```json
{ "id": "string", "label": "string", "color": "Tailwind class", "hub": "hub-id" }
```

### Hub

```json
{ "id": "string", "label": "string", "icon": "string", "color": "hex string" }
```

---

## 6. Out of Scope (v1)

| Feature | Reason |
|---|---|
| Team / shared workspaces | Single-user product by design |
| Google Calendar de-duplication | Requires storing `calendarEventId` on cards and a backend token refresh endpoint |
| Push notifications / reminders | Requires a service worker or server-side scheduler |
| Mobile native app | Web-only for v1; responsive layout covers mobile browsers |
| Recurring tasks | Not in current data model |
| Dark mode | Intentionally warm light theme |
| Offline-first PWA | localStorage provides resilience; full service worker is future scope |
| Custom board columns | Columns are fixed for workflow clarity |

---

## 7. Known Limitations

| Limitation | Workaround |
|---|---|
| Google Calendar access tokens expire after ~1 hour | Sign out and back in to get a fresh token; a backend refresh-token flow would eliminate this |
| Sync creates duplicate events if clicked multiple times | No deduplication in v1; future fix requires storing `calendarEventId` per card |
| All app logic in a single `App.jsx` (~1,500 lines) | Functional but harder to maintain at scale; component splitting is a v2 refactor |
| No offline indicator | App silently uses localStorage if Firestore is unreachable |

---

## 8. Future Roadmap (v2+)

| Feature | Description |
|---|---|
| Recurring tasks | Weekly/monthly repetition with carry-forward |
| Sub-tasks / checklists | Break a card into step-by-step items |
| Calendar de-duplication | Store `calendarEventId` per card; update instead of recreate on sync |
| Backend token refresh | Use refresh token + server endpoint to auto-renew Google access token |
| Push notifications | Browser push notification on task due date |
| Export | Download cards as CSV or Notion import format |
| PWA / offline | Service worker for full offline support |
| Component refactor | Split `App.jsx` into focused components and custom hooks |
| Multi-device badge | Show "last synced" timestamp and device count |
