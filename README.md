# Personal Kanban - Your Daily Productivity Dashboard

A feature-rich React web app for managing tasks, notes, focus sessions, and daily journaling — all in one place. Built for creators, developers, and professionals juggling multiple responsibilities.

**Live app:** [personal-os-dashboard-sigma.vercel.app](https://personal-os-dashboard-sigma.vercel.app)

![React](https://img.shields.io/badge/React-18.3-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan) ![Firebase](https://img.shields.io/badge/Firebase-10.8-orange) ![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

### Dashboard
- Time-of-day greeting with daily task summary
- Today's priorities, due tasks, and overdue count
- Journal mood preview and quick-action navigation

### Kanban Board
- 4-column workflow: Ideas > In Progress > Ready > Done
- Drag-and-drop cards between columns
- Inline editing, priority badges, due dates, role tags
- Quick capture and daily "Rule of Three" focus
- Hub-based filtering and full-text search
- Keyboard shortcuts: `/` search, `n` quick capture, `Esc` close

### Calendar
- Monthly grid with tasks auto-populated from board due dates
- Priority-coded task pills (red/blue/gray)
- Day detail panel with column status and role tags
- Google Calendar sync for all tasks with due dates

### Focus Timer
- Pomodoro technique: 25-min focus / 5-min short break / 15-min long break
- Circular SVG progress ring with play/pause/reset
- Cumulative session and minute tracking

### Notes
- Colour-coded sticky notes (6 colours)
- Create, edit, delete, and search
- Responsive 3-column grid layout

### Journal
- Daily entries with 5-level mood picker
- Date navigation (forward/back)
- Timeline of recent entries with mood and preview

### Analytics
- Task counts by status, category, and priority
- Visual bar charts and progress bars
- Real-time updates as tasks move through the board

### Data & Auth
- Google Sign-In via Firebase Auth
- Per-user data isolation (Firestore + localStorage)
- Instant restore on refresh (localStorage-first, Firestore for cross-device sync)
- Automatic save on every change

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Firebase project with Firestore and Google Auth enabled
- (Optional) Google Cloud project with Calendar API enabled

### Installation

```bash
git clone https://github.com/akshatasawant9699/personal-os-dashboard.git
cd personal-os-dashboard
npm install
```

### Environment Variables

Copy the example and fill in your Firebase credentials:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build for Production

```bash
npm run build
```

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Custom Domain

1. Buy a domain (Namecheap, Cloudflare, Google Domains)
2. In Vercel: Settings > Domains > Add your domain
3. Point DNS records (A / CNAME) to Vercel
4. SSL is provisioned automatically

### Netlify

Build command: `npm run build` | Publish directory: `dist`

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3.4 |
| Icons | lucide-react |
| Drag & Drop | @hello-pangea/dnd |
| Auth & DB | Firebase Auth + Firestore |
| Local Cache | Browser localStorage |
| Calendar | Google Calendar API v3 |
| Hosting | Vercel |

---

## Project Structure

```
src/
  App.jsx              # Main app (state, persistence, board, calendar, analytics)
  firebase.js          # Firebase config, auth, Firestore helpers
  main.jsx             # React entry point
  index.css            # Global styles + Tailwind
  components/
    Dashboard.jsx      # Home overview
    FocusTimer.jsx     # Pomodoro timer
    Notes.jsx          # Sticky notes
    Journal.jsx        # Daily journal with mood
  utils/
    calendar.js        # Google Calendar API helpers
```

---

## Contributing

This is an open-source project. Contributions welcome:

1. Fork the repo
2. Create a feature branch
3. Submit a pull request

---

## License

MIT License - see [LICENSE](LICENSE) for details.
