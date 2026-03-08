# Project Structure

## Directory Layout

```
content-manager-project/
├── public/                     # Static assets
├── src/
│   ├── App.jsx                # Main application component
│   ├── main.jsx               # React entry point
│   ├── index.css              # Global styles with Tailwind
│   ├── firebase.js            # Firebase config & auth functions
│   └── utils/
│       └── calendar.js        # Google Calendar API utilities
├── .env                       # Environment variables (create from .env.example)
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── vercel.json                # Vercel deployment config
├── netlify.toml               # Netlify deployment config
├── firebase.json              # Firebase Hosting config
├── README.md                  # Main documentation
├── SETUP_GUIDE.md             # Step-by-step setup instructions
└── PROJECT_STRUCTURE.md       # This file
```

## Key Files Explained

### [src/App.jsx](src/App.jsx)
The main application component containing:
- **State Management**: All app state (cards, rule of 3, user, etc.)
- **Authentication Logic**: Firebase auth integration
- **Kanban Board**: Drag & drop implementation
- **Hub Filtering**: Role-based task filtering
- **Calendar Sync**: Integration with Google Calendar
- **Local Storage**: Auto-save functionality

### [src/firebase.js](src/firebase.js)
Firebase configuration and authentication utilities:
- Firebase initialization
- Google OAuth provider setup with Calendar scopes
- `signInWithGoogle()` - Handles Google sign-in flow
- `signOutUser()` - Handles sign-out

### [src/utils/calendar.js](src/utils/calendar.js)
Google Calendar API integration:
- `getCalendarEvents()` - Fetch events from Google Calendar
- `createCalendarEvent()` - Create calendar event from task
- `syncTasksToCalendar()` - Batch sync tasks to calendar

### [index.html](index.html)
HTML entry point that:
- Sets up the root div for React
- Links to the main.jsx entry point
- Sets page title and metadata

### [src/main.jsx](src/main.jsx)
React entry point that:
- Imports CSS
- Renders the App component
- Wraps in React.StrictMode

### [src/index.css](src/index.css)
Global styles with:
- Tailwind directives (@tailwind)
- Custom scrollbar styles
- Base theme configuration

## Configuration Files

### [package.json](package.json)
Defines:
- Project metadata
- Dependencies (React, Firebase, Tailwind, etc.)
- Scripts (dev, build, preview)

### [vite.config.js](vite.config.js)
Vite build configuration:
- React plugin
- Build optimizations

### [tailwind.config.js](tailwind.config.js)
Tailwind CSS configuration:
- Content paths
- Dark mode settings
- Custom colors for hubs
- Theme extensions

### [postcss.config.js](postcss.config.js)
PostCSS configuration for:
- Tailwind CSS processing
- Autoprefixer for browser compatibility

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  (Rule of 3, Quick Capture, Kanban Board, Hub Filter)  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ├─► Local State (useState)
                  │   - ruleOfThree
                  │   - cards
                  │   - selectedHub
                  │   - user
                  │
                  ├─► Firebase Auth
                  │   - Google Sign-In
                  │   - User Session Management
                  │
                  ├─► Local Storage
                  │   - Auto-save on changes
                  │   - Load on user sign-in
                  │
                  └─► Google Calendar API
                      - Fetch events
                      - Create events
                      - Sync tasks
```

## Component Architecture

```
App
├── Header
│   ├── Logo
│   ├── Sync Calendar Button
│   ├── User Info
│   └── Sign Out Button
│
├── Rule of 3 Section
│   └── 3x Text Inputs
│
├── Quick Capture Section
│   ├── Text Input
│   └── Capture Button
│
├── Hub Filter Section
│   └── 4x Hub Buttons (All, Tech/AI, Career, Travel)
│
└── Kanban Board (DragDropContext)
    ├── Idea Box Column (Droppable)
    │   └── Task Cards (Draggable)
    │       ├── Title
    │       ├── Delete Button
    │       └── Role Tags (multi-select)
    │
    ├── In Progress Column (Droppable)
    │   └── Task Cards (Draggable)
    │
    ├── Ready to Publish Column (Droppable)
    │   └── Task Cards (Draggable)
    │
    └── Done Column (Droppable)
        └── Task Cards (Draggable)
```

## State Management

### User State
```javascript
{
  user: {
    uid: 'firebase-user-id',
    displayName: 'User Name',
    email: 'user@example.com',
    photoURL: 'https://...'
  }
}
```

### Rule of 3 State
```javascript
{
  ruleOfThree: ['Task 1', 'Task 2', 'Task 3']
}
```

### Cards State
```javascript
{
  cards: {
    ideas: [
      {
        id: '1234567890',
        title: 'Create AI tutorial video',
        roles: ['youtube-tech', 'ai-research', 'linkedin'],
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ],
    inProgress: [...],
    readyToPublish: [...],
    done: [...]
  }
}
```

### Hub Filter State
```javascript
{
  selectedHub: 'tech' // 'all' | 'tech' | 'career' | 'travel'
}
```

## API Integrations

### Firebase Authentication
- **Provider**: Google OAuth 2.0
- **Scopes**: Email, Profile, Calendar
- **Flow**: Popup-based sign-in
- **Token Storage**: localStorage for Calendar API

### Google Calendar API
- **Base URL**: `https://www.googleapis.com/calendar/v3`
- **Authentication**: Bearer token from Firebase Google Auth
- **Scopes**:
  - `https://www.googleapis.com/auth/calendar`
  - `https://www.googleapis.com/auth/calendar.events`
- **Operations**:
  - GET `/calendars/primary/events` - Fetch events
  - POST `/calendars/primary/events` - Create event

## Local Storage Schema

```javascript
// Key: personal-os-{userId}
{
  ruleOfThree: ['Task 1', 'Task 2', 'Task 3'],
  cards: {
    ideas: [...],
    inProgress: [...],
    readyToPublish: [...],
    done: [...]
  }
}

// Key: google_access_token
"ya29.a0AfH6SMB..." // OAuth access token
```

## Deployment Targets

### Vercel (Recommended)
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite
- Config file: [vercel.json](vercel.json)

### Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Config file: [netlify.toml](netlify.toml)

### Firebase Hosting
- Build command: `npm run build`
- Public directory: `dist`
- Config file: [firebase.json](firebase.json)

## Environment Variables

Required variables in `.env`:

```env
# Firebase
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID

# Google Calendar
VITE_GOOGLE_CLIENT_ID
```

All variables are prefixed with `VITE_` to be accessible in the browser.

## Security Considerations

- Firebase API keys are safe to expose (they identify your app, not authenticate)
- Actual security is handled by Firebase Security Rules
- Google OAuth tokens are short-lived and stored in localStorage
- No sensitive data is stored in the codebase
- All API calls use secure HTTPS

## Performance Optimizations

- Vite for fast HMR (Hot Module Replacement)
- Code splitting by default
- Tailwind CSS purging for minimal CSS
- Local storage for instant data loading
- React.StrictMode for development checks

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features
- CSS Grid & Flexbox
- LocalStorage API
- Fetch API
- Drag & Drop API (via @hello-pangea/dnd)

---

For setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

For feature documentation, see [README.md](README.md)
