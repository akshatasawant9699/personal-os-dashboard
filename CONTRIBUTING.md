# Contributing to Personal OS

First off, thank you for considering contributing to Personal OS! 🎉

It's people like you that make Personal OS such a great tool for developers and creators managing multiple roles.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🤝 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include screenshots or animated GIFs if relevant**
- **Include your environment details** (OS, browser, Node version)

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. chrome, safari]
 - Version: [e.g. 22]
 - Node version: [e.g. 18.0.0]
```

### Suggesting Enhancements ✨

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed feature**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**
- **Include mockups or examples if applicable**

**Feature Request Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request.
```

### Your First Code Contribution 🚀

Unsure where to begin? You can start by looking through these issue labels:

- `good-first-issue` - Issues that are good for newcomers
- `help-wanted` - Issues that need community help
- `documentation` - Improvements to documentation

## 🛠️ Development Setup

### Prerequisites

```bash
Node.js 18+
npm or yarn
Git
```

### Getting Started

1. **Fork the repository** on GitHub

2. **Clone your fork locally**
```bash
git clone https://github.com/YOUR_USERNAME/content-manager-project.git
cd content-manager-project
```

3. **Add upstream remote**
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/content-manager-project.git
```

4. **Install dependencies**
```bash
npm install
```

5. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your Firebase and Google credentials
```

6. **Start the development server**
```bash
npm run dev
```

7. **Create a new branch for your work**
```bash
git checkout -b feature/your-feature-name
```

### Project Structure

```
content-manager-project/
├── src/
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   ├── firebase.js       # Firebase configuration
│   ├── utils/
│   │   └── calendar.js   # Calendar utility functions
│   └── index.css         # Global styles
├── public/               # Static assets
├── docs/                 # Documentation
└── [config files]        # Vite, Tailwind, etc.
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update your fork** with the latest changes from upstream:
```bash
git fetch upstream
git rebase upstream/main
```

2. **Test your changes thoroughly**:
```bash
npm run dev
# Test in the browser
```

3. **Ensure your code follows our style guidelines** (see below)

4. **Update documentation** if you're adding or changing features

5. **Add or update tests** if applicable

### Submitting a Pull Request

1. **Push your changes to your fork**:
```bash
git push origin feature/your-feature-name
```

2. **Open a Pull Request** from your fork to the main repository

3. **Fill out the PR template** with all relevant information:
   - What does this PR do?
   - Why is this change needed?
   - How has it been tested?
   - Screenshots (if applicable)
   - Related issues

4. **Wait for review** - A maintainer will review your PR and may request changes

5. **Make requested changes** if any, and push them to the same branch

6. **Once approved**, your PR will be merged! 🎉

### PR Title Guidelines

Use conventional commit format:
- `feat: Add new synergy visualization`
- `fix: Resolve calendar sync issue`
- `docs: Update setup guide`
- `style: Format code with Prettier`
- `refactor: Simplify task filtering logic`
- `test: Add tests for drag and drop`
- `chore: Update dependencies`

## 🎨 Style Guidelines

### JavaScript/React Guidelines

- Use **functional components** with hooks (no class components)
- Use **meaningful variable and function names**
- Write **clear comments** for complex logic
- Follow **React best practices**:
  - Keep components small and focused
  - Use props destructuring
  - Implement proper error boundaries
  - Optimize re-renders when necessary

### Code Style

We use ESLint and Prettier for code consistency:

```bash
# Format code
npm run format

# Lint code
npm run lint
```

**Example of good code style:**

```javascript
// ✅ Good - Clear, descriptive, follows conventions
const handleTaskUpdate = (taskId, updatedData) => {
  setTasks(prevTasks =>
    prevTasks.map(task =>
      task.id === taskId
        ? { ...task, ...updatedData }
        : task
    )
  );
};

// ❌ Bad - Unclear, not descriptive
const upd = (id, data) => {
  setTasks(tasks.map(t => t.id === id ? { ...t, ...data } : t));
};
```

### CSS/Tailwind Guidelines

- Use **Tailwind utility classes** where possible
- Follow **mobile-first** responsive design
- Maintain the **dark mode** aesthetic
- Use **semantic color names** from the design system

### Commit Message Guidelines

Follow conventional commits:

```bash
# Format
<type>(<scope>): <subject>

# Examples
feat(tasks): add priority levels to tasks
fix(calendar): resolve sync timeout issue
docs(readme): add troubleshooting section
style(app): improve button hover states
refactor(utils): simplify date formatting
test(tasks): add unit tests for task filtering
chore(deps): update React to 18.3.1
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style/formatting (not UI changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🧪 Testing

### Manual Testing

Before submitting a PR, test these core features:

- [ ] Sign in with Google works
- [ ] Tasks can be created, edited, and deleted
- [ ] Drag and drop works across all columns
- [ ] Synergy tags work correctly
- [ ] Hub filtering works
- [ ] Calendar sync works
- [ ] Data persists on page reload
- [ ] Responsive design works on mobile

### Automated Testing

(Future: Add information about automated tests when implemented)

## 📚 Documentation

When adding new features:

1. **Update the README** with usage instructions
2. **Add inline code comments** for complex logic
3. **Update relevant documentation files**
4. **Add examples** where helpful

## 💬 Community

### Getting Help

- 💬 **GitHub Discussions**: Ask questions and share ideas
- 🐛 **GitHub Issues**: Report bugs and request features
- 📧 **Email**: Contact the maintainers directly
- 🔗 **LinkedIn**: Connect with [Akshata Sawant](https://www.linkedin.com/in/akshatasawant02/)

### Recognition

Contributors will be recognized in:
- The project README
- Release notes
- Our Hall of Fame (coming soon!)

## 🌟 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

---

**Questions?** Feel free to reach out to the maintainers or open a discussion on GitHub.

**Happy Contributing! 🚀**
