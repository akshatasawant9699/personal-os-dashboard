# Personal OS - Developer Productivity Dashboard 🚀

<div align="center">

**Built by [Akshata Sawant](https://www.linkedin.com/in/akshatasawant02/)** | Senior Developer Advocate @ Salesforce

[![LinkedIn](https://img.shields.io/badge/LinkedIn-13K_followers-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/akshatasawant02/)
[![MuleSoft Ambassador](https://img.shields.io/badge/MuleSoft-Ambassador-00A1E0?style=for-the-badge&logo=mulesoft&logoColor=white)](https://www.linkedin.com/in/akshatasawant02/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

*A single-page React application designed to manage multiple roles and maximize productivity through synergy. Built for creators, developers, and professionals juggling multiple responsibilities.*

[Live Demo](#) · [Report Bug](https://github.com/yourusername/content-manager-project/issues) · [Request Feature](https://github.com/yourusername/content-manager-project/issues)

</div>

---

## 👋 About the Author

**Akshata Sawant** is a Senior Developer Advocate at Salesforce based in London, specializing in enterprise integration, AI agents, and developer experience. With a strong background in MuleSoft and Salesforce ecosystems, she's passionate about building tools that enhance developer productivity.

### 🎯 Expertise Areas
- 🔷 **Enterprise Integration**: MuleSoft Certified Integration Architect
- 🤖 **AI & Agents**: Salesforce Agentforce, Document AI, Autonomous Agents
- 📚 **Technical Writing**: Co-author of MuleSoft books (2 editions)
- 🎤 **Community Leadership**: London & Mumbai MuleSoft Meetup Leader
- 🌟 **Developer Advocacy**: 13K+ LinkedIn followers, PMC Level I certified

### 🏆 Certifications
- ✅ Salesforce Certified AI Associate (2024)
- ✅ PMC Level I - Pragmatic Institute (2025)
- ✅ MuleSoft Certified Integration Architect (2021)
- ✅ MuleSoft Certified Developer - Level 1 (Mule 4)
- ✅ The Oxford Artificial Intelligence Summit 2025: Autonomous Agents

---

## 📸 Screenshots

> **Note**: Add screenshots of your Personal OS dashboard here to showcase the UI

![Dashboard Overview](./docs/screenshots/dashboard.png)
![Kanban Board](./docs/screenshots/kanban.png)

---

## ✨ Features

### 🎯 Core Productivity Features

- **Rule of 3 Daily Focus**: Set your top 3 non-negotiable tasks for the day
- **Master Kanban Board**: 4-column workflow (Idea Box → In Progress → Ready to Publish → Done)
- **Drag & Drop**: Seamlessly move tasks between columns with intuitive interactions
- **Synergy Tags**: Multi-select role tags to link content across multiple areas
- **Quick Capture**: Brain dump area to capture ideas instantly without context switching
- **Hub Filtering**: Filter tasks by Hub A (Tech/AI), Hub B (Career), or Hub C (Travel)
- **Dark Mode UI**: Beautiful, modern dark interface for reduced eye strain

### 🔐 Authentication & Sync

- **Google Sign-In**: Secure authentication powered by Firebase
- **Google Calendar Integration**: Sync tasks directly to your calendar
- **Local Storage Persistence**: Automatic data saving with no backend required
- **Real-time Updates**: Instant synchronization across all components

### 👥 Built for Multi-Role Creators

Pre-configured for managing multiple professional identities:

| Role | Hub | Focus Area |
|------|-----|------------|
| 🔷 Salesforce Developer Advocate | Tech/AI | Developer relations, technical content |
| 🎥 Tech/AI YouTube Creator | Tech/AI | Video content, tutorials, demos |
| 📊 Product Manager Shadow | Career | Product strategy, roadmaps |
| ✈️ Travel Content Creator | Travel | Travel guides, experiences |
| 💼 LinkedIn Creator | Career | Thought leadership, community building |
| 🛠️ DevRel Consultant | Career | Developer relations consulting |
| 🧠 AI Research Program Member | Tech/AI | AI research, experimentation |

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js 18+ and npm
Firebase account
Google Cloud Project (for Calendar API)
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/content-manager-project.git
cd content-manager-project
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Firebase & Google Calendar**

Follow the detailed setup guide:
- 📖 [Complete Setup Guide](./SETUP_GUIDE.md)
- 🔑 [Get API Keys Guide](./GET_API_KEYS.md)
- 🚀 [Deploy to Vercel Guide](./DEPLOY_TO_VERCEL.md)

4. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see [GET_API_KEYS.md](./GET_API_KEYS.md)):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📚 Usage Guide

### Getting Started with Personal OS

1. **🔐 Sign In**: Click "Sign in with Google" to authenticate
2. **🎯 Set Your Rule of 3**: Define your top 3 priorities for the day
3. **💡 Quick Capture**: Use the brain dump to capture ideas quickly
4. **📝 Create Tasks**: Ideas automatically go to the "Idea Box" column
5. **🏷️ Add Synergy Tags**: Click role tags to mark which areas a task relates to
6. **🔍 Filter by Hub**: Click hub filters to focus on specific areas
7. **🎨 Drag & Drop**: Move tasks through your workflow stages
8. **📅 Sync to Calendar**: Click "Sync Calendar" to add tasks to Google Calendar

### 🔄 Synergy in Action

**Example**: You're working on an AI research paper. Tag it with:
- **AI Research Member** (the core work)
- **LinkedIn Creator** (share insights as posts)
- **Tech/AI YouTuber** (create a video explaining concepts)
- **Salesforce Dev Advocate** (relate findings to Salesforce AI)

**Result**: One piece of content → Multiple outputs across platforms! 🎯

### 🗂️ Hub System

- **Hub A: Tech/AI** 🔷 - Salesforce, YouTube Tech, AI Research
- **Hub B: Career** 💼 - PM Shadow, LinkedIn, DevRel
- **Hub C: Travel** ✈️ - Travel Content Creation

---

## 🛠️ Tech Stack

### Frontend Framework
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

### Libraries & Tools
- **UI Components**: `lucide-react` for beautiful icons
- **Drag & Drop**: `@hello-pangea/dnd` for smooth interactions
- **Authentication**: Firebase Auth with Google OAuth
- **Calendar Integration**: Google Calendar API
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: LocalStorage for client-side persistence

### Development Tools
```json
{
  "framework": "React 18.3",
  "buildTool": "Vite 5.1",
  "styling": "Tailwind CSS 3.4",
  "authentication": "Firebase Auth",
  "deployment": "Vercel / Netlify / Firebase Hosting"
}
```

---

## 🎨 Design Philosophy

### Dark Mode Aesthetic
- **Background**: Deep gray/black gradient (gray-950) for reduced eye strain during long coding sessions
- **Contrast**: Bright accent colors (blue, purple, green) pop against dark background
- **Glassmorphism**: Subtle backdrop blur effects for modern, layered feel
- **Developer-Friendly**: Optimized for developers who work in dark environments

### Color System
- **Hub A (Tech/AI)**: Blue (#3b82f6) - represents intelligence and technology
- **Hub B (Career)**: Purple (#8b5cf6) - represents ambition and leadership
- **Hub C (Travel)**: Green (#10b981) - represents growth and adventure

### Layout Philosophy
- **F-Pattern**: Important actions at top (Rule of 3, Quick Capture)
- **Card-Based**: Each task is a contained, draggable card
- **Visual Hierarchy**: Size and color guide attention to priorities
- **Responsive Grid**: Adapts from 1 to 4 columns based on screen size

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/content-manager-project)

See [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md) for detailed instructions.

### Deploy to Netlify

```bash
# Build command
npm run build

# Publish directory
dist
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 🔧 Customization

### Modify Roles

Edit the `ROLES` array in [src/App.jsx](src/App.jsx:177):

```javascript
const ROLES = [
  { id: 'your-role', label: 'Your Role Name', color: 'bg-color-500', hub: 'tech' },
  // Add more roles...
];
```

### Modify Hubs

Edit the `HUBS` array in [src/App.jsx](src/App.jsx:187):

```javascript
const HUBS = [
  { id: 'your-hub', label: 'Your Hub', icon: YourIcon, color: 'text-color' },
  // Add more hubs...
];
```

### Modify Columns

Edit the `COLUMNS` object in [src/App.jsx](src/App.jsx:197):

```javascript
const COLUMNS = {
  columnId: { id: 'columnId', title: 'Column Title', color: 'border-color' },
  // Add more columns...
};
```

---

## 🤝 Contributing

Contributions are what make the open source community amazing! Any contributions you make are **greatly appreciated**.

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### How to Contribute

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🌟 Acknowledgments

- Built with ❤️ by developers, for developers
- Inspired by the productivity needs of multi-role creators in the developer advocacy space
- Thanks to the open source community for the amazing tools and libraries

---

## 📬 Connect & Support

<div align="center">

**Built by Akshata Sawant**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/akshatasawant02/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/yourusername)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/yourusername)

*Senior Developer Advocate @ Salesforce | MuleSoft Ambassador | Tech Content Creator*

**Found this helpful? Give it a ⭐️ on GitHub!**

</div>

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/content-manager-project?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/content-manager-project?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/content-manager-project?style=social)

---

<div align="center">

**[⬆ back to top](#personal-os---developer-productivity-dashboard-)**

Made with 💙 by a developer advocate who understands the chaos of managing multiple roles

</div>
