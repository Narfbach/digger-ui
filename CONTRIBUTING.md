# Contributing to Digger

Thank you for considering contributing to Digger! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

**Bug Report Template:**

```markdown
**Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g., Windows 11, macOS 13]
- Browser: [e.g., Chrome 120, Firefox 121]
- Version: [e.g., 0.0.1]

**Screenshots**
If applicable, add screenshots.

**Additional Context**
Any other relevant information.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**Enhancement Template:**

```markdown
**Feature Description**
Clear description of the proposed feature.

**Use Case**
Why this feature would be useful.

**Proposed Implementation**
How you think this could be implemented.

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other relevant information.
```

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/digger-ui.git
   cd digger-ui
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the code style guidelines
   - Add tests if applicable
   - Update documentation

4. **Test Your Changes**
   ```bash
   npm run lint
   npm run check
   npm run build
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Include screenshots if UI changes

## Development Setup

### Prerequisites

- Node.js 18+ or Bun
- Git
- Code editor (VS Code recommended)

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/digger-ui.git
cd digger-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

### Project Structure

```
digger-ui/
├── src/
│   ├── lib/              # Shared utilities and components
│   │   ├── api.ts        # API client
│   │   ├── types.ts      # TypeScript types
│   │   ├── config.ts     # Configuration
│   │   ├── stores/       # Svelte stores
│   │   └── components/   # Reusable components
│   └── routes/           # SvelteKit routes
├── static/               # Static assets
├── tests/                # Test files
└── docs/                 # Documentation
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types
- Document complex types

```typescript
// Good
interface Track {
  id: string;
  title: string;
  artist: Artist;
}

// Bad
const track: any = {...};
```

### Svelte Components

- Use Svelte 5 runes ($state, $derived, $effect)
- Keep components focused and reusable
- Use TypeScript for props

```svelte
<script lang="ts">
  import type { Track } from '$lib/types';
  
  interface Props {
    track: Track;
    onPlay?: (track: Track) => void;
  }
  
  let { track, onPlay }: Props = $props();
</script>
```

### CSS/Tailwind

- Use Tailwind utility classes
- Avoid custom CSS when possible
- Use design tokens for consistency

```svelte
<!-- Good -->
<button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
  Play
</button>

<!-- Avoid -->
<button style="background: blue; padding: 8px 16px;">
  Play
</button>
```

### Naming Conventions

- **Files**: kebab-case (e.g., `audio-player.svelte`)
- **Components**: PascalCase (e.g., `AudioPlayer`)
- **Functions**: camelCase (e.g., `playTrack`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Types/Interfaces**: PascalCase (e.g., `Track`, `PlayerState`)

### Code Organization

- One component per file
- Group related functionality
- Keep functions small and focused
- Extract reusable logic to utilities

## Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(player): add shuffle functionality
fix(search): resolve debounce timing issue
docs(readme): update installation instructions
refactor(api): simplify error handling
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- audio-player.test.ts
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import AudioPlayer from './AudioPlayer.svelte';

describe('AudioPlayer', () => {
  it('renders correctly', () => {
    const { container } = render(AudioPlayer);
    expect(container).toBeTruthy();
  });
  
  it('plays track when play button clicked', async () => {
    // Test implementation
  });
});
```

## Documentation

### Code Comments

- Comment complex logic
- Explain "why" not "what"
- Keep comments up to date

```typescript
// Good: Explains why
// Debounce search to prevent excessive API calls during typing
const debouncedSearch = debounce(search, 300);

// Bad: States the obvious
// Set the variable to true
isPlaying = true;
```

### JSDoc

Use JSDoc for public APIs:

```typescript
/**
 * Fetches track information from the API
 * @param trackId - The unique identifier for the track
 * @returns Promise resolving to track data
 * @throws {Error} If the track is not found
 */
async function getTrack(trackId: string): Promise<Track> {
  // Implementation
}
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Lint checks pass
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots
If applicable

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process

1. Maintainer reviews code
2. Feedback provided if needed
3. Changes requested or approved
4. PR merged after approval

## Release Process

Releases are managed by maintainers:

1. Version bump in `package.json`
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to production

## Getting Help

- **Documentation**: Check README.md and IMPLEMENTATION.md
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community server (if applicable)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## License

By contributing, you agree that your contributions will be licensed under the Mozilla Public License 2.0.

---

Thank you for contributing to Digger!
