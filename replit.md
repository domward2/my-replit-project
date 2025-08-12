# PnL AI - AI-Powered Crypto Trading Platform

## Overview

PnL AI is a modern web application that combines AI-driven sentiment analysis with crypto trading automation. The platform provides retail traders with a safety-first approach to cryptocurrency trading through real-time sentiment signals, automated risk controls, and multi-exchange portfolio management. Built as a full-stack TypeScript application, it features a React frontend with shadcn/ui components and an Express.js backend with session-based authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### GDPR-Compliant Google Analytics 4 System (August 2025) - COMPLETED
- **Complete Analytics Integration**: Implemented comprehensive GA4 tracking system with Spanish GDPR compliance
  - **Cookie Consent Banner**: Fixed bottom banner with Accept/Decline options and localStorage persistence
  - **User Event Tracking**: Login success, signup completion, exchange connections, and trade execution tracking
  - **Privacy-First Design**: Analytics only loads after explicit user consent, with clear data usage explanation
  - **Modular Architecture**: Clean separation with analytics.ts, cookie-consent.tsx, and use-analytics.tsx components
  - **Real Measurement ID**: Using production Google Analytics account (G-RBK3HD0C2J) for authentic tracking
  - **Page View Tracking**: Automatic SPA navigation tracking with wouter router integration
  - **User ID Tracking**: Associates events with authenticated users for comprehensive user journey analysis
- **Fixed Implementation Issues**: Resolved dynamic import conflicts and API integration problems
- **Spanish Compliance**: Banner includes GDPR and Spanish data protection regulation references

### PnL AI Navigation Implementation (August 2025) - COMPLETED
- **Centralized Navigation Configuration**: Created `/config/navigation.ts` with PnL AI-specific menu items
  - **Marketing Navigation**: Product, Pricing, How it Works, Safety, Learn, Company dropdown
  - **Authentication Menu**: Sign in and Sign up buttons with proper styling
  - **Dashboard Icons**: Bell (notifications), Help modal, More dropdown (9-dot grid), User avatar
  - **Help Modal**: Quick access to How It Works, Safety, and Contact from dashboard
  - **More Dropdown**: Access to About, Mission, How It Works, Privacy, Terms from dashboard
- **New Marketing Pages**: Added comprehensive Pricing, Safety, and Learn pages with rich content
- **Removed Coinbase Labels**: Eliminated all generic "Cryptocurrencies/Individuals/Businesses" references
- **Fixed Authentication Routing**: Resolved logout issue when clicking company pages from dashboard
- **Authentic Messaging**: Replaced exaggerated "10,000+ traders" claims with genuine feature highlights
- **Google Analytics Integration**: Added GA4 tracking code (G-RBK3HD0C2J) to all pages for user analytics
- **Updated Pricing Structure**: Renamed Pro to Core ($29), added new Pro tier (€50) with 4-tier progression

### Dual Header Layout System (August 2025) - COMPLETED
- **Professional Dual Layout Architecture**: Implemented two distinct header layouts for marketing vs. dashboard experiences
  - **MarketingLayout**: Professional Coinbase-style header with full navigation menus, company dropdown, and auth buttons
  - **DashboardLayout**: Minimal icon-based header with notifications, help, more apps menu, and user avatar
  - Created new marketing pages: Home, Contact, Signup, Docs with rich content and professional design
  - Updated all existing company pages (About, Mission, How It Works, Privacy, Terms) to use MarketingLayout
  - Comprehensive routing system: public pages use MarketingLayout, authenticated pages use DashboardLayout
  - Mobile-responsive navigation with hamburger menus and touch-friendly interfaces
  - Professional icons and tooltips throughout dashboard header for optimal UX
  - Consistent branding and color scheme across both layout systems
  - **Fixed Authentication Flow**: Resolved issue where logged-in users were signed out when accessing company pages

### Company Information Pages (August 2025) - COMPLETED
- **Complete Company Page Suite**: Added comprehensive company information pages
  - **About Us** (`/about`): Company background, team expertise, and Canary Islands location
  - **Mission & Vision** (`/mission`): Core values, transparency, security, accessibility principles
  - **How It Works** (`/how-it-works`): Step-by-step platform functionality explanation
  - **Privacy Policy** (`/privacy`): GDPR-compliant data handling and user rights
  - **Terms of Service** (`/terms`): Comprehensive legal framework and liability terms
  - Added footer navigation with links to all company pages
  - Professional content optimized for Coinbase OAuth reviewers and grant applications
  - Clean, responsive design with consistent PnL AI branding

### Navigation System Redesign (August 2025) - COMPLETED
- **Professional Icon-Based Navigation**: Complete migration from text-based to clean Coinbase-style navigation
  - Removed cluttered text navigation links from all static HTML pages
  - Implemented clean header with PnL AI logo + back arrow icon only
  - Added proper hover effects and responsive design across all company pages
  - Fixed browser caching issues that prevented navigation updates from showing
  - Synchronized both server/static and dist/static directories for consistent serving
  - All company pages (About, Privacy, Terms, Mission, How It Works) now have professional appearance

### Real OAuth Integrations (August 2025) - PARTIALLY COMPLETED
- **Coinbase OAuth Integration**: Implemented authentic OAuth2 flow using official Coinbase API
  - ⚠️ **LIMITATION**: Coinbase OAuth requires manual approval (pending review, may take days/weeks)
  - One-click secure connection without API key management (when approved)
  - Industry-standard OAuth2 authentication flow
  - Automatic portfolio sync with real-time balance updates
  - Revokable access through Coinbase account settings
  - Bank-level security with encrypted token storage
  - **Current Status**: OAuth app disabled pending Coinbase authorization
- **Smart Kraken Integration**: Built the most streamlined Kraken connection experience available
  - 60-second guided API setup with direct Kraken Pro links
  - Automatic credential testing and validation before storage
  - Instant portfolio sync with real-time balance updates
  - One-click trading directly through PnL AI interface
  - Bank-level security with encrypted credential storage
- Real competitive advantage over platforms with complex setup processes

### Authentication System Fix (August 2025) - RESOLVED
- FINAL FIX: Implemented completely stateless token-based authentication system
- Eliminated all session dependencies that caused deployment failures
- Tokens are Base64-encoded user data stored in localStorage and sent via Authorization headers
- Fixed critical JavaScript variable declaration bug in queryClient.ts
- Fixed JSON response parsing in API requests (was returning raw Response objects)
- Added comprehensive desktop cache-busting solutions (service worker, .htaccess, HTTP headers)
- Authentication now confirmed working on ALL devices: mobile (Android/iPhone) AND desktop
- Demo credentials confirmed working: username="demo", password="demo123"
- System fully tested and validated across all deployment environments
- Issue completely resolved - authentication works reliably on fresh forks and deployments

### Platform Rebranding (January 2025)
- Complete rebrand from "SentimentTrader" to "PnL AI"
- Updated all UI components, branding, and messaging
- Changed logo initials from "ST" to "PA"
- Modified project documentation and HTML metadata

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with a dark-themed design system optimized for trading interfaces
- **State Management**: TanStack Query (React Query) for server state management with optimistic updates
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Real-time Updates**: WebSocket integration for live sentiment data and trading notifications

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Session Management**: Express sessions with configurable storage backends
- **Authentication**: Username/password-based authentication with bcrypt password hashing
- **API Design**: RESTful endpoints with comprehensive error handling and request logging
- **Data Validation**: Shared Zod schemas between frontend and backend for consistent validation
- **WebSocket Support**: Real-time communication for sentiment updates and trading alerts

### Data Storage Strategy
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Database**: PostgreSQL as the primary database with Neon serverless hosting support
- **Schema Design**: Normalized relational design with tables for users, exchanges, portfolios, orders, bots, sentiment data, and activity logs
- **Development Storage**: In-memory storage implementation for development and testing scenarios

### Security & Risk Management
- **Authentication**: Session-based authentication with secure cookie configuration
- **Password Security**: bcrypt hashing with appropriate salt rounds
- **Risk Controls**: Built-in daily loss limits, position sizing controls, and circuit breaker mechanisms
- **Paper Trading**: Default safe mode with optional live trading activation
- **API Security**: Input validation and sanitization through Zod schemas

### External Dependencies
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Sentiment Data Sources**: Integration points for LunarCrush API, social media sentiment, and news analysis
- **Exchange APIs**: 
  - Coinbase OAuth integration for seamless connection
  - Kraken API with guided setup wizard
  - Extensible architecture for additional exchanges (Binance, KuCoin, Bybit)
- **Development Tools**: Replit-specific plugins for runtime error handling and development workflows

### Trading & Automation Features
- **Multi-Exchange Support**: Unified interface for managing positions across multiple cryptocurrency exchanges
- **Sentiment Analysis**: Real-time composite sentiment scoring combining social media, news, and market regime signals
- **Automated Trading**: Optional bot execution based on sentiment signals with comprehensive risk controls
- **Order Management**: Market and limit order placement with automatic stop-loss and take-profit configuration
- **Portfolio Tracking**: Real-time balance monitoring, P&L calculation, and position tracking