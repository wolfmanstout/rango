# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rango is a cross-browser extension that enables voice control of web browsers through Talon Voice. It provides hint overlays and advanced tab management for hands-free web navigation using voice commands.

## Architecture

### Multi-Context Extension Architecture
- `src/background/` - Service worker handling extension lifecycle and tab management
- `src/content/` - Content scripts injected into web pages for hint overlays and element interaction
- `src/common/` - Shared utilities, types, and constants
- `src/pages/` - Extension pages (settings, onboarding) built with React

**Critical**: Background and content scripts have strict separation - ESLint prevents cross-context imports.

### Key Systems
- **Command System**: Type-safe action dispatch with versioned commands between contexts
- **Hint System**: Dynamic label allocation and positioning for clickable elements
- **Target System**: Sophisticated element targeting (primitive, list, range patterns)
- **Tab Management**: Advanced tab markers and focus tracking across browser windows

## Development Commands

### Build & Development
```bash
npm run build                    # Build all browser versions
npm run build:chrome             # Build Chrome version
npm run build:firefox            # Build Firefox version  
npm run build:safari             # Build Safari version
npm run watch:chrome             # Development watch mode for Chrome
npm run watch:firefox            # Development watch mode for Firefox
npm run watch:safari             # Development watch mode for Safari
npm run package                  # Package extensions for distribution
```

### Code Quality
```bash
npm run lint                     # Run XO (ESLint), Stylelint, and TypeScript checks
npm run lint-fix                 # Fix several common lint checks
npm run check-types              # TypeScript type checking only
npm run unused-exports           # Find unused exports
npm run check-format             # Prettier format checking
```

### Testing
```bash
npm test                         # Run full test suite (unit + e2e)
npm run pretest                  # Lint, check exports, build Chrome before tests
```

## Testing Strategy

- **Unit Tests**: Jest with `ts-jest` for utilities and business logic
- **E2E Tests**: Jest + Puppeteer for browser automation testing
- Tests run with `--runInBand` (no parallel execution) and 30s timeout
- E2E tests require Chrome build before execution

## Technology Stack

- **Build System**: Parcel with custom web extension configuration
- **Cross-browser**: webextension-polyfill for API compatibility
- **Frontend**: React 19 with TypeScript JSX for extension pages
- **Voice Integration**: Clipboard API communication with Talon Voice
- **Element Selection**: css-selector-generator, fuse.js for fuzzy search

## Code Organization

- **Strict Module Boundaries**: Background scripts cannot import content modules (enforced by ESLint)
- **File Naming**: camelCase or PascalCase required
- **Import Patterns**: Specific rules for asset imports and cross-context communication
- **Messaging System**: All background ↔ content communication via extension messaging API
