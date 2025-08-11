# PnL AI - AI-Powered Crypto Trading Platform

## Overview

PnL AI is a modern web application that combines AI-driven sentiment analysis with crypto trading automation. The platform provides retail traders with a safety-first approach to cryptocurrency trading through real-time sentiment signals, automated risk controls, and multi-exchange portfolio management. Built as a full-stack TypeScript application, it features a React frontend with shadcn/ui components and an Express.js backend with session-based authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Authentication System Fix (August 2025)
- FINAL FIX: Implemented completely stateless token-based authentication system
- Eliminated all session dependencies that caused deployment failures
- Tokens are Base64-encoded user data stored in localStorage and sent via Authorization headers
- Added comprehensive desktop cache-busting solutions (service worker, .htaccess, HTTP headers, URL timestamps)
- Authentication confirmed working on mobile devices (Android/iPhone)
- Desktop cache bypass mechanisms implemented to resolve persistent desktop browser issues
- Demo credentials confirmed working: username="demo", password="demo123"
- System tested and validated to work across all environments without session storage
- Cache refresh timeline: 5-10 minutes for CDN, but bypasses implemented for immediate desktop compatibility

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