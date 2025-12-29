# Changelog

All notable changes to Digger will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **CRITICAL**: Updated API endpoints to new working URLs (search functionality restored)
  - Replaced obsolete endpoints (hifi.401658.xyz, tidal-api-3.binimum.org)
  - Added new cluster: triton.squid.wtf, tidal.kinoplus.online, qqdl.site endpoints
  - Search for tracks, albums, artists, and playlists now working again

### Planned
- Offline playback with IndexedDB storage
- User authentication and library sync
- Chromecast and AirPlay support
- Equalizer and audio effects
- Comprehensive keyboard shortcuts
- Mini player mode

## [0.0.1] - 2024-12-28

### Added
- Initial release of Digger
- Full-featured audio player with queue management
- Support for lossless audio formats (FLAC, MQA, Dolby Atmos)
- Multi-category search (tracks, albums, artists, playlists)
- Metadata-rich downloads with FFmpeg WASM integration
- Synced lyrics with word-by-word highlighting
- Progressive Web App capabilities
- Service worker for offline shell
- Redis-backed API response caching
- Docker deployment support
- Media Session API integration for lock screen controls
- Quality selector with runtime switching
- Album, artist, and playlist detail pages
- Batch download functionality (albums and discographies)
- CORS proxy with multi-endpoint failover
- Responsive design for all devices
- Dark theme optimized for music listening

### Technical
- Built with SvelteKit 5 and Svelte 5 runes
- TypeScript with strict mode enabled
- Tailwind CSS 4 for styling
- Node.js adapter for production deployment
- ESLint and Prettier configuration
- Comprehensive type definitions
- Optimized bundle with tree-shaking
- Lazy loading for performance

### Infrastructure
- Docker multi-stage build
- Docker Compose configuration
- Redis integration for caching
- Environment-based configuration
- Production-ready server setup

## [0.0.0] - Development

### Initial Development
- Project setup and architecture design
- Core component development
- API integration with HIFI service
- State management implementation
- UI/UX design and implementation

---

## Release Notes

### Version 0.0.1

This is the initial public release of Digger, a high-fidelity music streaming web application. The application provides a complete music streaming experience with support for lossless audio formats, advanced download capabilities, and modern web technologies.

**Key Highlights:**
- Lossless audio streaming up to 24-bit/192kHz
- Client-side metadata embedding for downloads
- Synced lyrics with karaoke-style highlighting
- Progressive Web App for offline access
- Redis caching for improved performance
- Docker deployment for easy hosting

**Browser Support:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Known Limitations:**
- Album track listings require additional API endpoints
- FFmpeg WASM requires modern browser
- Service Worker needs HTTPS (except localhost)

For detailed installation and usage instructions, see [README.md](README.md).

For technical implementation details, see [IMPLEMENTATION.md](IMPLEMENTATION.md).

---

[Unreleased]: https://github.com/Narfbach/digger-ui/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/Narfbach/digger-ui/releases/tag/v0.0.1
