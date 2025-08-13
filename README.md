# PnL AI - Production-Ready Crypto Trading Platform

A comprehensive crypto trading platform built with React, TypeScript, and Express.js, featuring AI-driven sentiment analysis, multi-exchange integrations, and production-grade observability.

## Features

- **AI-Powered Trading**: Real-time sentiment analysis and automated trading strategies
- **Multi-Exchange Support**: Coinbase OAuth and Kraken API integrations
- **Security First**: Helmet security headers, CSP, and GDPR compliance
- **Observability**: Sentry error tracking and Google Analytics 4
- **Accessibility**: WCAG compliant with jsx-a11y integration
- **Performance**: Lazy loading, skeleton screens, and optimized assets

## Production Setup

### Environment Variables

Configure these secrets in Replit Secrets:

```bash
# Analytics (Required)
VITE_GA_MEASUREMENT_ID=G-RBK3HD0C2J

# Error Tracking (Optional)
VITE_SENTRY_DSN=your_sentry_dsn_here

# App Version (Optional)
VITE_APP_VERSION=2.1.0
```

### Health Monitoring

The application exposes a health endpoint at `/health` for monitoring:

```json
{
  "status": "ok",
  "version": "2.1.0",
  "timestamp": "2025-01-13T15:30:00.000Z"
}
```

### UptimeRobot Configuration

1. Go to [UptimeRobot](https://uptimerobot.com)
2. Create new HTTP monitor
3. URL: `https://pnl-ai.replit.app/health`
4. Interval: 5 minutes
5. Keyword monitoring: Look for `"status":"ok"`

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL database (configured via DATABASE_URL)

### Installation

```bash
npm install
```

### Running the Application

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Linting

```bash
# Check accessibility and code quality
npx eslint client/src --ext .tsx,.ts
```

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript 
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Token-based with localStorage
- **Security**: Helmet headers, CSP, CSRF protection
- **Analytics**: GDPR-compliant Google Analytics 4
- **Error Tracking**: Sentry with React Error Boundary

## Security Headers

The application implements comprehensive security headers:

- **Content Security Policy**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

## Deployment

The application is optimized for Replit deployment with:

- Automatic file structure fixing
- Cache busting for desktop browsers
- Health check endpoint
- Error boundary with Sentry integration
- Progressive enhancement with noscript fallback

## Contact

For support or feature requests: support@pnl-ai.com