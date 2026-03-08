# Personal OS - Your Ultimate Productivity Dashboard

A single-page React application designed to manage multiple roles and maximize productivity through synergy. Built for creators, developers, and professionals juggling multiple responsibilities.

![Personal OS](https://img.shields.io/badge/React-18.3-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan) ![Firebase](https://img.shields.io/badge/Firebase-10.8-orange)

## Features

### Core Productivity Features

- **Rule of 3 Daily Focus**: Set your top 3 non-negotiable tasks for the day
- **Master Kanban Board**: 4-column workflow (Idea Box → In Progress → Ready to Publish → Done)
- **Drag & Drop**: Seamlessly move tasks between columns
- **Synergy Tags**: Multi-select role tags to link content across multiple areas
- **Quick Capture**: Brain dump area to capture ideas instantly
- **Hub Filtering**: Filter tasks by Hub A (Tech/AI), Hub B (Career), or Hub C (Travel)

### Authentication & Sync

- **Google Sign-In**: Secure authentication with Firebase
- **Google Calendar Integration**: Sync tasks directly to your calendar
- **Local Storage Persistence**: Your data is saved automatically

### Built for Multi-Role Creators

Pre-configured for 7 roles:
1. Salesforce Developer Advocate
2. Tech/AI YouTube Creator
3. Product Manager Shadow
4. Travel Content Creator
5. LinkedIn Creator (Target: 20K followers)
6. DevRel Consultant
7. AI Research Program Member

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Google Cloud Project (for Calendar API)

### Installation

1. **Clone or download this repository**

```bash
cd content-manager-project
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Firebase**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Google Authentication:
     - Go to Authentication → Sign-in method
     - Enable Google provider
   - Get your Firebase config:
     - Go to Project Settings → General
     - Scroll to "Your apps" and create a Web app
     - Copy the config values

4. **Set up Google Calendar API**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create or select a project
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials:
     - Go to APIs & Services → Credentials
     - Create OAuth client ID (Web application)
     - Add authorized JavaScript origins: `http://localhost:5173`
     - Add authorized redirect URIs: `http://localhost:5173`
     - Copy the Client ID

5. **Configure environment variables**

   Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

   Edit `.env` with your Firebase and Google credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

6. **Run the development server**

```bash
npm run dev
```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage Guide

### Getting Started

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Set Your Rule of 3**: Define your top 3 priorities for the day
3. **Quick Capture**: Use the brain dump to capture ideas quickly
4. **Create Tasks**: Ideas automatically go to the "Idea Box" column
5. **Add Synergy Tags**: Click role tags to mark which areas a task relates to
6. **Filter by Hub**: Click hub filters to focus on specific areas
7. **Drag & Drop**: Move tasks through your workflow
8. **Sync to Calendar**: Click "Sync Calendar" to add tasks to Google Calendar

### Synergy in Action

Example: You're working on an AI research paper. Tag it with:
- **AI Research Member** (the work itself)
- **LinkedIn Creator** (share insights as posts)
- **Tech/AI YouTuber** (create a video explaining concepts)
- **Salesforce Dev Advocate** (relate findings to Salesforce AI)

One piece of content → Multiple outputs!

### Hub System

- **Hub A: Tech/AI** - Salesforce, YouTube Tech, AI Research
- **Hub B: Career** - PM Shadow, LinkedIn, DevRel
- **Hub C: Travel** - Travel Content Creation

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

Update authorized domains in Firebase and Google Cloud Console.

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables
7. Deploy!

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Customization

### Modify Roles

Edit the `ROLES` array in [src/App.jsx](src/App.jsx):

```javascript
const ROLES = [
  { id: 'your-role', label: 'Your Role Name', color: 'bg-color-500', hub: 'tech' },
  // Add more roles...
];
```

### Modify Hubs

Edit the `HUBS` array in [src/App.jsx](src/App.jsx):

```javascript
const HUBS = [
  { id: 'your-hub', label: 'Your Hub', icon: YourIcon, color: 'text-color' },
  // Add more hubs...
];
```

### Modify Columns

Edit the `COLUMNS` object in [src/App.jsx](src/App.jsx):

```javascript
const COLUMNS = {
  columnId: { id: 'columnId', title: 'Column Title', color: 'border-color' },
  // Add more columns...
};
```

## UI Design Choices

### Dark Mode Aesthetic
- **Background**: Deep gray/black gradient (gray-950) for reduced eye strain
- **Contrast**: Bright accent colors (blue, purple, green) pop against dark background
- **Glassmorphism**: Subtle backdrop blur effects for modern, layered feel

### Color System
- **Hub A (Tech/AI)**: Blue (#3b82f6) - represents intelligence and technology
- **Hub B (Career)**: Purple (#8b5cf6) - represents ambition and leadership
- **Hub C (Travel)**: Green (#10b981) - represents growth and adventure

### Layout Philosophy
- **F-Pattern**: Important actions at top (Rule of 3, Quick Capture)
- **Card-Based**: Each task is a contained, draggable card
- **Visual Hierarchy**: Size and color guide attention to priorities
- **Responsive Grid**: Adapts from 1 to 4 columns based on screen size

### Interactions
- **Drag & Drop**: Natural, tactile feel for moving tasks
- **Color-Coded Tags**: Quick visual identification of synergies
- **Hover States**: Clear feedback for all interactive elements
- **Smooth Transitions**: Subtle animations enhance the experience

## Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 5.1
- **Styling**: Tailwind CSS 3.4
- **Icons**: lucide-react
- **Drag & Drop**: @hello-pangea/dnd
- **Authentication**: Firebase Auth
- **Calendar**: Google Calendar API
- **Storage**: localStorage (client-side)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

This is an open-source productivity tool! Feel free to:
- Fork the repository
- Submit pull requests
- Report issues
- Suggest features

## License

MIT License - feel free to use this for your own productivity system!

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing discussions
- Review the documentation

---

Built with by creators, for creators. Maximize your synergy and crush your goals!
