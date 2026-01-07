# PumpVote - Token Voting Platform

## Overview

PumpVote is a Polymarket-style voting application for Pump.fun tokens on Solana. Users can paste a token contract address (CA) to create a public "verdict room" where the community votes whether a token is a "W" (good/hold/potential) or "Trash" (risky/likely rug). The platform combines crowd-sourced voting with on-chain data signals to help users assess token quality without fake certainty.

Key features:
- Token room creation via contract address
- Real-time W vs Trash voting with visual percentage bars
- Rug scale risk assessment (0-100)
- AI-powered token analysis using OpenAI
- Live chat functionality in token rooms
- Trending markets discovery

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with shadcn/ui component library
- **Build Tool**: Vite with custom plugins for Replit integration
- **Fonts**: Plus Jakarta Sans (display) and JetBrains Mono (code/data)

The frontend follows a pages-based structure with reusable components. Key pages include Home (trending markets), TokenRoom (individual voting rooms), and AIAnalyzer (AI-powered analysis).

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Style**: REST endpoints under `/api/*`
- **Development**: Vite dev server with HMR proxied through Express

The server handles API routes, serves static files in production, and integrates with AI services. Routes are registered in `server/routes.ts` with storage abstraction in `server/storage.ts`.

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Drizzle Kit with `drizzle-kit push` command

Core tables:
- `users`: Basic authentication (id, username, password)
- `markets`: Token voting rooms (CA, name, symbol, votes, rug scale, chart data)
- `votes`: Individual votes linking wallets to markets
- `messages`: Chat messages within token rooms

### AI Integration
- **Provider**: OpenAI via Replit AI Integrations
- **Usage**: Token analysis endpoint at `/api/ai/analyse`
- **Configuration**: Uses `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` environment variables

Additional AI utilities exist in `server/replit_integrations/` for batch processing, chat, and image generation.

### Build System
- **Client**: Vite builds to `dist/public`
- **Server**: esbuild bundles to `dist/index.cjs`
- **Scripts**: `npm run dev` for development, `npm run build` for production

## External Dependencies

### Required Services
- **PostgreSQL Database**: Required for data persistence. Set via `DATABASE_URL` environment variable.
- **OpenAI API**: Via Replit AI Integrations for token analysis features.

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `postgres`: PostgreSQL client
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animations (voting bars)
- `shadcn/ui` components: Extensive Radix UI-based component library

### External APIs (Planned)
- **Helius API**: For fetching Solana token metadata from contract addresses (referenced in attached assets but not yet implemented)
- **Pump.fun**: Target platform for token data (integration pending)