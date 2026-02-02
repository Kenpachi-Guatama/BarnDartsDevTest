# CLAUDE.md - AI Assistant Development Guide

This document provides essential context for AI assistants (like Claude) working with the BarnDartsDevTest repository.

## Project Overview

**Repository:** BarnDartsDevTest
**Purpose:** Development and testing environment for barn darts application
**Status:** Initial development phase

## Repository Structure

```
BarnDartsDevTest/
├── src/                    # Main source code
│   ├── components/         # UI components
│   ├── services/           # Business logic and API services
│   ├── utils/              # Utility functions and helpers
│   └── types/              # Type definitions
├── tests/                  # Test files
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests
├── docs/                   # Documentation
├── config/                 # Configuration files
├── public/                 # Static assets
├── scripts/                # Build and automation scripts
├── .github/                # GitHub configuration
│   └── workflows/          # CI/CD pipeline definitions
├── package.json            # Node.js dependencies (if applicable)
├── README.md               # Project overview
├── CONTRIBUTING.md         # Contribution guidelines
├── CLAUDE.md               # This file - AI assistant guide
└── .gitignore              # Git ignore rules
```

## Quick Reference Commands

```bash
# Install dependencies
npm install          # or: yarn install / pnpm install

# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run all tests
npm run test:unit    # Run unit tests only
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint         # Run linter
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run typecheck    # Run TypeScript type checking
```

## Development Workflow

### Branch Naming Convention

- `feature/<description>` - New features
- `bugfix/<description>` - Bug fixes
- `hotfix/<description>` - Urgent production fixes
- `docs/<description>` - Documentation updates
- `refactor/<description>` - Code refactoring
- `test/<description>` - Test additions or modifications
- `claude/<session-id>` - AI assistant work branches

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons, etc.)
- `refactor` - Code refactoring without feature changes
- `test` - Adding or modifying tests
- `chore` - Build process or auxiliary tool changes
- `perf` - Performance improvements

**Examples:**
```
feat(scoring): add real-time score calculation
fix(game): resolve player turn rotation bug
docs(readme): update installation instructions
test(scoring): add unit tests for score validation
```

### Pull Request Process

1. Create a feature branch from the main branch
2. Make changes and commit with descriptive messages
3. Ensure all tests pass locally
4. Push branch and create pull request
5. Address code review feedback
6. Squash and merge when approved

## Code Style and Conventions

### General Principles

- Write clean, readable, self-documenting code
- Follow DRY (Don't Repeat Yourself) principle
- Keep functions small and focused on a single responsibility
- Use meaningful variable and function names
- Add comments only when the code isn't self-explanatory

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `playerScore`, `currentTurn` |
| Constants | UPPER_SNAKE_CASE | `MAX_SCORE`, `DEFAULT_PLAYERS` |
| Functions | camelCase | `calculateScore()`, `getPlayerName()` |
| Classes | PascalCase | `GameController`, `ScoreBoard` |
| Files (components) | PascalCase | `PlayerCard.tsx`, `GameBoard.tsx` |
| Files (utilities) | camelCase | `scoreUtils.ts`, `gameHelpers.ts` |
| Test files | `*.test.ts` or `*.spec.ts` | `scoring.test.ts` |
| CSS classes | kebab-case | `player-card`, `score-display` |

### TypeScript Guidelines

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Avoid using `any` type; prefer `unknown` when type is uncertain
- Use type guards for runtime type checking
- Export types from a central `types/` directory

### Error Handling

- Always handle potential errors gracefully
- Use try-catch blocks for async operations
- Provide meaningful error messages
- Log errors appropriately for debugging
- Never swallow errors silently

## Testing Guidelines

### Test Structure

```typescript
describe('ComponentName or FunctionName', () => {
  beforeEach(() => {
    // Setup code
  });

  afterEach(() => {
    // Cleanup code
  });

  it('should describe expected behavior', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Testing Best Practices

- Write tests before or alongside code (TDD/BDD encouraged)
- Test one thing per test case
- Use descriptive test names that explain the expected behavior
- Mock external dependencies
- Aim for high coverage but prioritize meaningful tests
- Include edge cases and error scenarios

### Test Categories

1. **Unit Tests** - Test individual functions and components in isolation
2. **Integration Tests** - Test interactions between components
3. **E2E Tests** - Test complete user workflows

## AI Assistant Guidelines

### When Working on This Codebase

1. **Read First, Edit Later**
   - Always read relevant files before making changes
   - Understand the existing patterns and conventions
   - Check for related tests and documentation

2. **Minimal Changes**
   - Make only necessary changes to complete the task
   - Avoid unnecessary refactoring or "improvements"
   - Don't add features that weren't requested

3. **Test Your Changes**
   - Run existing tests to ensure nothing breaks
   - Add tests for new functionality
   - Verify changes work as expected

4. **Security Considerations**
   - Never commit sensitive data (API keys, passwords, etc.)
   - Validate all user inputs
   - Be aware of OWASP top 10 vulnerabilities
   - Use parameterized queries for database operations

5. **Documentation**
   - Update documentation when making significant changes
   - Add inline comments for complex logic
   - Update CLAUDE.md if project conventions change

### Common Tasks

#### Adding a New Feature
1. Create a feature branch
2. Write tests for the new feature
3. Implement the feature
4. Ensure all tests pass
5. Update relevant documentation
6. Commit and push changes

#### Fixing a Bug
1. Write a test that reproduces the bug
2. Fix the bug
3. Verify the test passes
4. Check for similar issues elsewhere
5. Commit with `fix:` prefix

#### Refactoring Code
1. Ensure tests exist for the code being refactored
2. Make incremental changes
3. Run tests after each change
4. Keep commits atomic and focused

## Environment Setup

### Prerequisites

- Node.js (LTS version recommended)
- npm, yarn, or pnpm package manager
- Git

### Environment Variables

Create a `.env.local` file for local development (never commit this file):

```env
# Application
NODE_ENV=development
PORT=3000

# API Configuration
API_URL=http://localhost:3001
API_KEY=your_api_key_here

# Database (if applicable)
DATABASE_URL=your_database_url

# Feature Flags
ENABLE_DEBUG=true
```

### Local Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd BarnDartsDevTest

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Dependencies not installing | Delete `node_modules` and `package-lock.json`, then run `npm install` |
| Tests failing locally | Ensure environment variables are set correctly |
| Build errors | Check for TypeScript errors with `npm run typecheck` |
| Port already in use | Change PORT in `.env.local` or kill the process using the port |

### Getting Help

1. Check existing documentation in `/docs`
2. Search closed issues for similar problems
3. Review recent commits for context
4. Ask team members or create a new issue

## Additional Resources

- [Project README](./README.md) - Project overview and quick start
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Architecture Documentation](./docs/architecture.md) - System design details
- [API Documentation](./docs/api.md) - API endpoints and usage

---

*This document should be kept up-to-date as the project evolves. When making significant changes to project structure, workflows, or conventions, please update this file accordingly.*

**Last Updated:** 2026-02-02
