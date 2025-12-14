# Animedzytsu Site

## Overview

An anime streaming platform built with React and Express, inspired by Netflix and Crunchyroll design patterns. The platform provides anime catalog browsing, detailed anime pages, and video playback functionality. Content is primarily in Russian language, targeting Russian-speaking anime viewers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Theme**: Dark mode by default with light mode support, using CSS variables for theming
- **Build Tool**: Vite with React plugin

**Key Pages**:
- Home (`/`) - Hero section with featured anime and carousels
- Catalog (`/catalog`) - Filterable anime listing with pagination
- Anime Detail (`/anime/:id`) - Full anime information with episode list
- Watch (`/watch/:animeId/:episodeId`) - Video player page

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Server**: HTTP server with Vite middleware in development
- **API Pattern**: RESTful JSON API under `/api/*` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod integration

**API Endpoints**:
- `GET /api/anime` - List anime with filtering (search, genres, status, year, sort, pagination)
- `GET /api/anime/:id` - Get single anime details
- `GET /api/anime/:id/episodes` - Get episodes for anime
- `GET /api/anime/:id/related` - Get related anime

### Data Storage
- **Primary Database**: PostgreSQL (configured via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with schema defined in `shared/schema.ts`
- **Migrations**: Drizzle Kit with migrations output to `./migrations`

**Database Tables**:
- `users` - User accounts with username/password
- `genres` - Anime genres with name and slug
- `anime` - Anime entries with metadata (title, description, poster, rating, etc.)
- `episodes` - Episode data linked to anime

### Video Sources
- Integration with external video parser service (Python Flask with anicli-api)
- Supports multiple sources: AnimeGo, Anilibria, Animevost
- External anime metadata mapping via Jikan API (MyAnimeList) and anime-lists GitHub repository

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and query client
├── server/           # Express backend
│   ├── services/     # External API integrations
│   └── python/       # Video parser Flask service
├── shared/           # Shared types and schema
└── migrations/       # Database migrations
```

## External Dependencies

### APIs and Services
- **Jikan API** (`api.jikan.moe`) - MyAnimeList data wrapper for anime metadata
- **Anime-lists** (GitHub) - Cross-database anime ID mappings (MAL, AniList, Kitsu, etc.)
- **Video Parser** - Local Python Flask service for fetching video streams from anime sources

### Key NPM Packages
- `@tanstack/react-query` - Data fetching and caching
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `express` - HTTP server framework
- `wouter` - Client-side routing
- `zod` - Schema validation
- `@radix-ui/*` - Accessible UI primitives (via shadcn/ui)
- `tailwindcss` - Utility-first CSS framework

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `VIDEO_PARSER_URL` (optional) - URL for Python video parser service (defaults to `http://localhost:3001`)