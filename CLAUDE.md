# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Core Extension is a non-custodial browser extension for Chromium browsers built using Manifest V3. It enables users to seamlessly and securely interact with Web3 applications powered by Avalanche, supporting Bitcoin, Ethereum, and Solana networks.

The project uses a monorepo structure with yarn workspaces and contains two main applications:

- **Legacy**: The current production version (React 17, older architecture) in `apps/legacy/`
- **Next**: The next-generation version (React 19, modern architecture) in `apps/next/`

## Essential Commands

### Development

```bash
# Start development (defaults to legacy)
yarn dev
yarn start

# Start specific versions
yarn dev:legacy
yarn dev:next

# Setup project (install deps + allow-scripts)
yarn setup
```

### Building

```bash
# Build for production
yarn build                    # Legacy (default)
yarn build:legacy             # Legacy explicit
yarn build:next               # Next-gen

# Build alpha versions
yarn build:alpha              # Legacy alpha
yarn build:next:alpha         # Next-gen alpha
yarn build:alpha:no-source-maps  # Alpha without source maps

# Create extension packages
yarn zip                      # Legacy zip for Chrome Store
yarn zip:next                 # Next-gen zip for Chrome Store
```

### Testing & Quality

```bash
# Run tests
yarn test                     # Legacy tests
yarn test:next               # Next-gen tests
yarn test:watch              # Watch mode
yarn test:path <pattern>     # Test specific pattern

# Code quality
yarn lint                    # Legacy lint
yarn lint:next              # Next-gen lint
yarn typecheck              # Legacy typecheck
yarn typecheck:next         # Next-gen typecheck
yarn prettify               # Format all code

# Internationalization
yarn scanner                # Legacy i18n scan
yarn scanner:next           # Next-gen i18n scan
```

### Build System

Built with Rsbuild (Rspack-based) instead of Webpack. Each package has its own build configuration:

- Apps use environment-specific configs (`rsbuild.{app}.{env}.ts`)
- Packages have shared common configs with dev/prod variants

## Architecture

### Extension Structure (Manifest V3)

The extension follows the standard Manifest V3 architecture with 4 isolated components:

1. **Service Worker** (`packages/service-worker/`): Background script handling business logic, network communication, transaction signing, and encrypted storage
2. **Frontend** (`apps/legacy/` or `apps/next/`): React UI for onboarding, main interface, and approval windows
3. **Content Script** (`packages/content-script/`): Bridge between service worker and injected provider
4. **Injected Provider** (`packages/inpage/`): EIP-1193 compliant provider injected into web pages for dApp communication

### Monorepo Packages

- `@core/common`: Shared utilities, constants, and helper functions
- `@core/messaging`: Cross-context communication system with JSON serialization
- `@core/service-worker`: Background script services and business logic
- `@core/types`: Comprehensive TypeScript type definitions
- `@core/ui`: Shared React components, hooks, and providers
- `@core/content-script`: Content script for web page injection bridge
- `@core/inpage`: In-page provider implementing EIP-1193 standard
- `@core/offscreen`: Offscreen document for secure DOM operations

### Service Architecture

The service worker uses dependency injection (TSyringe) with service-oriented architecture:

**Core Services:**

- `AccountsService`: Multi-wallet account management
- `BalancesService`: Token balances and portfolio aggregation
- `NetworkService`: Blockchain network configuration and switching
- `WalletService`: Transaction signing and wallet operations
- `PermissionsService`: dApp permission management
- `BridgeService`: Cross-chain bridge operations
- `SeedlessService`: Seedless wallet authentication via CubeSigner
- `LedgerService`: Hardware wallet integration
- `KeystoneService`: Keystone hardware wallet support
- `StorageService`: Encrypted data persistence

**Architecture Patterns:**

- **Handlers**: RPC method processors combining service functionality
- **Events**: Pub/sub system for cross-component communication
- **Middleware**: Request processing pipeline (auth, logging, permissions)

### Extension Entry Points

The frontend supports multiple contexts determined by `isSpecificContextContainer.ts`:

- **POPUP**: Main extension UI (browser icon click)
- **CONFIRM**: Approval windows for dApp interactions
- **HOME**: Fullscreen onboarding experience

## Development Guidelines

### Critical Manifest V3 Constraints

- **No XMLHttpRequest**: Use `fetch()` only
- **No DOM/window**: Use offscreen documents for DOM operations
- **Service Worker Restarts**: Background script can restart anytime - never rely on in-memory state
- **Strict CSP**: No eval(), limited inline scripts
- **Storage**: Always use encrypted `StorageService`, never direct chrome.storage

### Security Requirements

- **Encrypt Everything**: All storage must be encrypted via `StorageService`
- **No Plain Text Secrets**: Never expose private keys outside respective services
- **Password Fields**: Use password inputs for sensitive data (Chrome caches regular inputs)
- **No Frontend Storage**: Never use localStorage - all state in encrypted background storage

### Code Organization

- **Single Purpose Services**: Keep services focused, combine functionality in handlers
- **Clean State**: Reset all state when wallet locks
- **Event-Driven Communication**: Services communicate via events, not direct calls
- **Handler-Service Pattern**: Handlers orchestrate multiple services for complex operations

### Multi-App Development

- Legacy and next-gen apps share the same service worker and core packages
- Test changes in both applications when modifying shared functionality
- Service worker changes affect both apps simultaneously
- Use appropriate commands: `yarn dev:legacy` vs `yarn dev:next`

### Component Library

- Uses [K2 Components](https://k2-components.pages.dev/) for UI consistency
- Avoid overriding MUI classes - update K2 or Figma instead
- Ask in `k2-product-design-system` Slack for design system questions

### Environment Setup

- Copy `.env.example` to `.env.dev` for development
- Requires Node.js 20.18.0 and Yarn 4.7.0 (managed by Volta)
- Requires access to `@avalabs` packages on npmjs.com with 2FA

### Chrome Extension Development

1. Build: `yarn dev` (legacy) or `yarn dev:next` (next-gen)
2. Chrome: Go to `chrome://extensions/`, enable Developer mode
3. Load: Click "Load unpacked", select `dist/` (legacy) or `dist-next/` (next-gen) folder
4. Hot reload: Changes reload automatically during development
5. Service Worker: Requires extension reload for background script changes

### Blockchain Network Support

- **Avalanche**: C-Chain, P-Chain, X-Chain (primary focus)
- **Bitcoin**: Native Bitcoin and testnet support
- **Ethereum**: EVM-compatible chains
- **Solana**: Next-gen app only

### Testing Strategy

- Unit tests co-located with source (`.test.ts` files)
- Integration tests for service interactions
- Mocks in `__mocks__/` directories
- Jest testing framework across all packages
- Test both legacy and next-gen when changing shared code

### Release Process

- Uses semantic versioning with conventional commits
- `feat:` = minor version bump
- `fix:` = patch version bump
- `BREAKING CHANGE:` = major version bump
- Alpha builds: Automatic on main branch merge
- Production: Manual GitHub Action trigger

### Common Gotchas

- Service worker 5-minute idle timeout and random restarts
- EIP-1193 provider race conditions with other wallets (MetaMask, Rabby)
- WebUSB limitations in service worker (requires frontend for Ledger)
- Encrypted storage key derivation using Scrypt KDF
- Cross-chain bridge complexity with multi-step state management
- Content Security Policy restrictions in Manifest V3

### Performance Considerations

- Balance polling service manages network requests efficiently
- Use incremental promise resolution for batch operations
- Implement proper cleanup in service constructors
- Avoid memory leaks in long-running background processes

Always run `yarn lint` and `yarn typecheck` before committing changes.
