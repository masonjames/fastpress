# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm run dev` - Start both frontend (Vite) and backend (Convex) development servers
- `npm run dev:frontend` - Start only the frontend development server  
- `npm run dev:backend` - Start only the Convex backend development server

### Build & Quality
- `npm run build` - Build the production frontend
- `npm run lint` - Run complete lint/typecheck pipeline (includes Convex backend check, frontend TypeScript check, Convex dev validation, and Vite build)

## Application Architecture

FastPress is a WordPress alternative built with React frontend and Convex backend, featuring SEO optimization and AI integration capabilities.

### Core Structure
- **Frontend**: React + TypeScript + Vite, located in `src/`
- **Backend**: Convex serverless functions in `convex/`
- **Styling**: Tailwind CSS with custom component library
- **Auth**: Convex Auth with anonymous authentication
- **Database**: Convex with structured schema for CMS functionality

### Data Model (convex/schema.ts)
The application uses a comprehensive CMS schema with:
- **posts**: Blog posts with SEO fields, categories, tags, and status management
- **categories**: Hierarchical category system with SEO metadata
- **pages**: Static pages with template support
- **comments**: Threaded commenting system with moderation
- **siteSettings**: Key-value configuration storage
- **seoAnalysis**: SEO scoring and optimization recommendations
- **mcpConnections**: AI/MCP integration endpoints

### Routing & Navigation
- Client-side routing via custom navigation state management (no React Router)
- Routes: `/` (home), `/admin` (dashboard), `/category/{slug}`, `/{post-slug}`
- SEO-friendly URLs with slug-based routing

### Key Components
- **AdminDashboard**: Post/page management interface
- **PostEditor**: Rich content editing with SEO analysis
- **SEOAnalyzer**: Real-time SEO scoring and suggestions
- **MCPManager**: AI service integration management

### Authentication Flow
- Anonymous auth enabled by default for easy setup
- Admin access required for content management
- User roles managed through Convex Auth tables

### File Organization
- `src/components/`: React UI components
- `convex/`: Server-side functions, schema, and auth config
- `convex/router.ts`: Custom HTTP routes (separate from auth routes)
- Path alias: `@/` maps to `src/`

### Development Notes
- Convex deployment: `mellow-elephant-188`
- Chef integration for development previews
- ESLint config allows relaxed TypeScript rules for rapid development
- Prettier for code formatting