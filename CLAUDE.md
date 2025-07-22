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

FastPress is a **production-ready WordPress alternative** built with React frontend and Convex backend, featuring comprehensive SEO optimization, AI integration capabilities, and modern performance optimizations.

### Core Structure
- **Frontend**: React + TypeScript + Vite, located in `src/`
- **Backend**: Convex serverless functions in `convex/`
- **Styling**: Tailwind CSS with custom component library
- **Auth**: Convex Auth with anonymous authentication
- **Database**: Convex with structured schema for CMS functionality
- **Performance**: React.memo optimizations, lazy loading, error boundaries

### Data Model (convex/schema.ts)
The application uses a comprehensive CMS schema with:
- **posts**: Blog posts with SEO fields, categories, tags, and status management
- **categories**: Hierarchical category system with SEO metadata  
- **pages**: Static pages with template support
- **comments**: Threaded commenting system with moderation
- **siteSettings**: Key-value configuration storage
- **seoAnalysis**: SEO scoring and optimization recommendations
- **mcpConnections**: AI/MCP integration endpoints

### MVP Features (Completed)
**✅ Core Post Management**
**✅ Category System**
**✅ Search & Filtering**
**✅ SEO Features**

### Routing & Navigation
- Client-side routing via custom navigation state management (no React Router)
- Routes: `/` (home), `/admin` (dashboard), `/category/{slug}`, `/{post-slug}`
- SEO-friendly URLs with slug-based routing
- Memoized navigation handlers for performance

### Key Components

**Core CMS Components:**
- **AdminDashboard**: Comprehensive post/page management interface with filtering
- **PostEditor**: Rich content editing with real-time SEO analysis and preview
- **BlogHome**: Main blog interface with advanced search and filtering
- **PostCard**: Optimized post display component with lazy loading

**SEO & Performance Components:**
- **SEOPreview**: Real-time Google search result preview with metrics
- **SEOHead**: Dynamic meta tag management with structured data
- **ErrorBoundary**: Graceful error handling and recovery
- **LoadingSpinner/LoadingState**: Professional loading indicators

**Supporting Components:**
- **CategoryList**: Hierarchical category navigation
- **SearchBox**: Advanced search interface
- **SEOAnalyzer**: Real-time SEO scoring and suggestions
- **MCPManager**: AI service integration management

### Backend Architecture (convex/)

**Enhanced Post Management:**
- `posts.ts`: Complete CRUD operations with advanced querying
  - Full-text search with `withSearchIndex` for optimal performance
  - Advanced filtering by category, tag, date, status
  - Multiple sort options and pagination support
  - `getAllTags` query for tag-based filtering

**Core Functionality:**
- `categories.ts`: Hierarchical category management
- `auth.ts`: Anonymous authentication with user management
- `schema.ts`: Comprehensive CMS data model

### Authentication Flow
- Anonymous auth enabled by default for easy setup
- Admin access required for content management
- User roles managed through Convex Auth tables
- Secure post editing/deletion with author verification

### File Organization
- `src/components/`: React UI components (memoized and optimized)
- `convex/`: Server-side functions, schema, and auth config
- `convex/posts.ts`: Enhanced with full CRUD and search capabilities
- Path alias: `@/` maps to `src/`

### Performance Optimizations
- **Component Level**: React.memo for PostCard and other heavy components
- **Network Level**: Image lazy loading with error handling
- **Build Level**: Manual chunk splitting (vendor, convex, ui bundles)
- **Development**: HMR optimization and dependency pre-bundling
- **Error Handling**: Comprehensive error boundaries throughout the app

### Development Notes
- Convex deployment: `mellow-elephant-188`
- Chef integration for development previews
- ESLint config allows relaxed TypeScript rules for rapid development
- Prettier for code formatting
- All MVP features implemented and tested with systematic feature branch workflow

## Current Status
FastPress is now a **minimally functional WordPress alternative** ready for production use. Core CMS features are implemented with modern performance optimizations and basic SEO fields.