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
- **posts**: Blog posts with SEO fields, categories, tags, status management, and featured images
- **categories**: Hierarchical category system with SEO metadata  
- **pages**: Static pages with hierarchical parent-child relationships and template support
- **comments**: Threaded commenting system with moderation (pending/approved/spam)
- **media**: File storage with metadata, alt text, and usage tracking
- **siteSettings**: Key-value configuration storage
- **seoAnalysis**: SEO scoring and optimization recommendations
- **mcpConnections**: AI/MCP integration endpoints

### MVP Features (Completed)
**✅ Core Post Management**
- Full CRUD operations with advanced querying
- Visual tag input with pill-style interface
- Checkbox-based category selection
- Featured image integration

**✅ Page Management System**
- Static page creation and editing
- Hierarchical parent-child relationships
- Public-facing page rendering

**✅ Comment System**
- Public comment submission with validation
- Threaded reply system (3-level depth)
- Admin moderation (approve/spam/delete)

**✅ Media Library**
- File upload with validation (10MB limit, image types)
- Grid-based media manager with thumbnails
- Featured image picker integration
- Alt text editing and usage tracking

**✅ Admin Dashboard Enhancements**
- Dynamic statistics (replacing hardcoded values)
- Pagination for posts and pages (5 items per page)
- Real-time SEO scoring based on content optimization

**✅ Search & Filtering**
**✅ SEO Features**

### Routing & Navigation
- React Router for client-side routing with proper navigation
- Routes: `/` (home), `/admin` (dashboard), `/category/{slug}`, `/{post-slug}`, `/{page-slug}`
- SEO-friendly URLs with slug-based routing for posts and pages
- Dynamic route handling for hierarchical pages

### Key Components

**Core CMS Components:**
- **AdminDashboard**: Multi-tab interface (Posts/Pages, Comments, SEO, Media, AI Integration)
  - Dynamic statistics dashboard with real-time metrics
  - Pagination for posts and pages lists (5 items per page)
  - Sub-navigation for posts vs pages management
- **PostEditor**: Rich content editing with enhanced UX
  - Visual tag input system with pill-style tags
  - Checkbox-based category selection (replacing multi-select)
  - Featured image picker with modal selection
  - Real-time SEO analysis and preview
- **PageEditor**: Static page creation and editing with hierarchy support
- **BlogHome**: Main blog interface with advanced search and filtering
- **PostView/PageView**: Public-facing content display with comments integration

**Media Management:**
- **MediaManager**: Comprehensive media library interface
  - File upload with drag & drop and validation
  - Grid-based thumbnail display with filtering
  - File statistics, alt text editing, and usage tracking
- **MediaPickerModal**: Featured image selection interface for editors

**Comment System:**
- **CommentForm**: Public comment submission with validation
- **CommentList**: Threaded comment display (3-level depth)
- **CommentModeration**: Admin interface for comment management

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
- `pages.ts`: Complete CRUD operations for static pages with hierarchy support
- `comments.ts`: Comment system with moderation (create, approve, spam, delete)
- `media.ts`: File upload, storage, and management with Convex storage integration
- `auth.ts`: Anonymous authentication with user management
- `schema.ts`: Comprehensive CMS data model with proper indexing

### Authentication Flow
- Anonymous auth enabled by default for easy setup
- Admin access required for content management
- User roles managed through Convex Auth tables
- Secure post editing/deletion with author verification

### File Organization
- `src/components/`: React UI components (memoized and optimized)
  - `AdminDashboard.tsx`: Main admin interface with multi-tab layout
  - `PostEditor.tsx`: Enhanced post editing with featured images and visual tags
  - `PageEditor.tsx`: Static page creation and editing
  - `MediaManager.tsx`: Comprehensive media library interface
  - `CommentModeration.tsx`: Admin comment management
  - `CommentForm.tsx` & `CommentList.tsx`: Public commenting system
- `convex/`: Server-side functions, schema, and auth config
  - `posts.ts`: Enhanced with full CRUD and search capabilities
  - `pages.ts`: Static page management with hierarchy
  - `comments.ts`: Comment system with moderation
  - `media.ts`: File upload and storage management
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
FastPress is now a **comprehensive WordPress alternative** ready for production use. All major CMS features have been implemented with modern UX patterns and performance optimizations:

### ✅ **Production-Ready Features:**
- **Content Management**: Full CRUD for posts and pages with rich editing experience
- **Media Library**: Complete file upload, management, and integration system
- **Comment System**: Public commenting with threaded replies and admin moderation
- **Admin Experience**: Multi-tab dashboard with dynamic statistics and pagination
- **User Experience**: Visual tag input, checkbox categories, featured image picker
- **SEO Optimization**: Real-time scoring, meta tag management, and content analysis

### 🚀 **Technical Excellence:**
- **Modern Architecture**: React + TypeScript + Convex with proper error handling
- **Performance Optimized**: React.memo, lazy loading, pagination, and efficient queries
- **Production Build**: Clean linting, TypeScript compilation, and build optimization
- **Systematic Development**: 30 completed tasks across 5 feature branches with atomic commits

FastPress successfully bridges the gap between simple blog platforms and complex CMSs, offering WordPress-level functionality with modern development practices and superior performance.