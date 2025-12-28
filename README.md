# Digger

A high-fidelity music streaming web application built with SvelteKit, featuring lossless audio playback, advanced download capabilities, and a modern, responsive interface.

[![License: MPL-2.0](https://img.shields.io/badge/License-MPL--2.0-blue.svg)](https://opensource.org/licenses/MPL-2.0)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-5.0-FF3E00?logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## Overview

Digger is a full-featured music streaming platform that provides access to high-fidelity audio content with support for lossless formats including FLAC, MQA, and Dolby Atmos. Built with modern web technologies, it offers a seamless experience across all devices with advanced features like metadata-rich downloads, synced lyrics, and offline PWA capabilities.

## Key Features

### Audio Playback
- **Lossless Streaming**: Support for HI_RES_LOSSLESS (24-bit/192kHz FLAC), LOSSLESS (16-bit/44.1kHz FLAC), and compressed formats
- **Advanced Player Controls**: Full queue management, shuffle, repeat, seek, and volume controls
- **Media Session Integration**: Lock screen controls and rich notifications on supported devices
- **Quality Selection**: Runtime quality switching with optional preloading for gapless transitions

### Content Discovery
- **Powerful Search**: Multi-category search across tracks, albums, artists, and playlists
- **Keyboard Navigation**: Full keyboard support for efficient browsing
- **Rich Metadata**: Detailed information including release dates, ISRC codes, and artist bios
- **Dedicated Pages**: Album, artist, and playlist views with comprehensive metadata

### Download System
- **Metadata Embedding**: Downloads include title, album, artist, ISRC, track/disc numbers, year, and cover art
- **FFmpeg WASM Integration**: Client-side metadata injection without server processing
- **Batch Downloads**: One-click album downloads and full artist discography downloads
- **Quality Preservation**: Downloads honor selected audio quality settings

### Lyrics & Synchronization
- **Synced Lyrics**: Word-by-word karaoke-style highlighting powered by YouLy+
- **Interactive Display**: Popup viewer with refresh and maximize options
- **Real-time Sync**: Lyrics automatically follow playback position

### Progressive Web App
- **Installable**: Add to home screen on mobile and desktop platforms
- **Offline Shell**: Service worker precaches UI for offline navigation
- **Auto-Updates**: Automatic deployment of new versions with seamless refresh
- **Custom Branding**: Configurable icons and manifest

### Performance & Caching
- **Redis Integration**: Optional response caching to reduce API latency
- **Configurable TTL**: Separate cache durations for different content types
- **Smart Caching**: Respects cache headers and only caches appropriate responses
- **CORS Proxy**: Built-in proxy routing with multi-endpoint failover

## Technology Stack

### Frontend
- **SvelteKit 5**: Modern meta-framework with Svelte 5 runes for reactive state management
- **TypeScript**: Full type safety across the entire codebase
- **Tailwind CSS 4**: Utility-first styling with custom design tokens
- **Lucide Svelte**: Comprehensive icon library

### Backend & Infrastructure
- **Node.js Adapter**: Production-ready server with SvelteKit adapter-node
- **Redis**: Optional caching layer for API responses
- **Docker**: Containerized deployment with Docker Compose support
- **FFmpeg WASM**: Client-side audio processing for metadata injection

### APIs & Services
- **HIFI API**: Backend music service providing TIDAL content access
- **YouLy+**: Synchronized lyrics provider
- **Vercel Analytics**: Optional usage analytics

## Installation & Setup

### Prerequisites
- Node.js 18+ or Bun
- Optional: Redis for response caching
- Optional: Docker for containerized deployment

### Local Development

```bash
# Clone the repository
git clone https://github.com/Narfbach/digger-ui.git
cd digger-ui

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Optional: Custom application title
TITLE=Digger

# Optional: Redis caching (recommended for production)
REDIS_URL=redis://localhost:6379

# Or configure Redis components separately
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_USERNAME=

# Optional: Cache tuning
REDIS_CACHE_TTL_SECONDS=300
REDIS_CACHE_TTL_SEARCH_SECONDS=300
REDIS_CACHE_TTL_TRACK_SECONDS=120
REDIS_CACHE_MAX_BODY_BYTES=200000
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Deployment

```bash
# Build and start with Docker Compose
docker compose up --build

# Access at http://localhost:5000
```

The Docker setup automatically configures Redis caching and production optimizations.

## Architecture

### Project Structure

```
digger-ui/
├── src/
│   ├── lib/
│   │   ├── api.ts                    # API client with proxy support
│   │   ├── types.ts                  # TypeScript type definitions
│   │   ├── config.ts                 # Configuration and constants
│   │   ├── stores/
│   │   │   └── player.ts             # Global player state management
│   │   └── components/
│   │       ├── AudioPlayer.svelte    # Main audio player component
│   │       ├── SearchInterface.svelte # Search and discovery UI
│   │       ├── TrackList.svelte      # Track listing component
│   │       └── QualitySelector.svelte # Audio quality selector
│   ├── routes/
│   │   ├── +layout.svelte            # Root layout with navigation
│   │   ├── +page.svelte              # Home page
│   │   ├── album/[id]/+page.svelte   # Album detail page
│   │   ├── artist/[id]/+page.svelte  # Artist detail page
│   │   ├── playlist/[id]/+page.svelte # Playlist detail page
│   │   └── api/proxy/+server.ts      # Backend proxy endpoint
│   └── app.css                       # Global styles and Tailwind config
├── static/
│   ├── icons/                        # PWA icons
│   ├── manifest.webmanifest          # PWA manifest
│   └── offline.html                  # Offline fallback page
├── Dockerfile                        # Production container
├── docker-compose.yml                # Docker Compose configuration
└── package.json                      # Dependencies and scripts
```

### State Management

The application uses Svelte 5's runes system for reactive state:

- `$state`: Reactive variables for player state (current track, playing status, volume)
- `$derived`: Computed values based on reactive state
- Svelte stores: Global player state accessible across components

### API Integration

All API requests are proxied through SvelteKit's backend to handle CORS and caching:

1. Client makes request to `/api/proxy`
2. SvelteKit server checks Redis cache (if configured)
3. On cache miss, fetches from HIFI API
4. Response is cached and returned to client
5. Audio streams are decoded from base64 BTS manifests

### Audio Streaming Flow

```
User Action → Player Store → API Request → Manifest Decode → CDN URL → HTML5 Audio
```

TIDAL CDN URLs are CORS-friendly, allowing direct streaming without additional proxying.

## Audio Quality Specifications

| Quality Level    | Codec | Specifications       | Bitrate    |
|-----------------|-------|---------------------|------------|
| HI_RES_LOSSLESS | FLAC  | 24-bit, up to 192kHz| Variable   |
| HI_RES          | MQA   | Up to 96kHz         | Variable   |
| LOSSLESS        | FLAC  | 16-bit, 44.1kHz     | ~1411 kbps |
| HIGH            | AAC   | 44.1kHz             | 320 kbps   |
| LOW             | AAC   | 44.1kHz             | 96 kbps    |

Additional support for Dolby Atmos and Sony 360 Reality Audio where available.

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Type-check with svelte-check
npm run check:watch  # Type-check in watch mode
npm run format       # Format code with Prettier
npm run lint         # Lint code with ESLint and Prettier
```

### Code Quality

- **ESLint**: Configured with TypeScript and Svelte plugins
- **Prettier**: Consistent code formatting with Svelte and Tailwind plugins
- **TypeScript**: Strict mode enabled for maximum type safety
- **Svelte Check**: Validates Svelte components and TypeScript

### CORS Configuration

The application supports multiple CORS handling strategies:

#### Option 1: Backend Proxy (Recommended for Production)

```typescript
// src/lib/config.ts
export const API_CONFIG = {
  baseUrl: 'https://tidal.401658.xyz',
  useProxy: true,
  proxyUrl: '/api/proxy'
};
```

#### Option 2: External CORS Proxy (Development)

```typescript
// src/lib/config.ts
export const API_CONFIG = {
  baseUrl: 'https://corsproxy.io/?https://tidal.401658.xyz',
  useProxy: false
};
```

#### Option 3: Direct API Calls (Default)

Works in most cases as TIDAL CDN URLs are CORS-friendly for streaming.

## Performance Optimizations

- **Lazy Loading**: Images and components loaded on demand
- **Debounced Search**: Reduces API calls during user input
- **Efficient State**: Minimal re-renders with Svelte's reactive system
- **Bundle Optimization**: Tree-shaking and code splitting
- **Redis Caching**: Reduces API latency and server load
- **Service Worker**: Precaches static assets for instant loading

## Security & Privacy

- No user tracking or analytics (unless explicitly enabled)
- No data collection or storage
- Client-side only processing for sensitive operations
- Secure HTTPS connections for all API calls
- No cookies or persistent storage beyond PWA cache

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

PWA features require modern browser with Service Worker support.

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Cloudflare Pages

```bash
npm run build
# Deploy the 'build' directory
```

### Node.js Server

```bash
npm run build
PORT=3000 node build
```

### Docker

```bash
docker build -t digger .
docker run -p 5000:5000 digger
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Ensure all tests pass and code follows the existing style guidelines.

## License

This project is licensed under the Mozilla Public License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **HIFI API** by [sachinsenal0x64](https://github.com/sachinsenal0x64/hifi-tui) - Backend music service
- **SvelteKit Team** - Modern web framework
- **Tailwind CSS Team** - Utility-first CSS framework
- **Lucide Icons** - Beautiful icon library

## Disclaimer

This project is for educational purposes only. Users are responsible for complying with TIDAL's Terms of Service and applicable copyright laws. Support artists by purchasing music and subscribing to legitimate streaming services.

## Contact

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built with modern web technologies for music enthusiasts**
