# Service Apartment Booking Engine

A modern, multi-property booking engine for service apartments with Razorpay integration, OTA compatibility, and n8n automation support.

## Features

- **Multi-property support**: Add 2, 20, or 200 properties, each property is fully isolated
- **Rich inventory management**: 7 unit types × 4 units per property by default
- **Mobile-first booking experience**: Conversion-optimized UI/UX
- **Razorpay integration**: Secure payment processing
- **OTA compatibility**: iCal import/export and webhooks
- **n8n automation**: Normalized webhook events for workflow automation
- **Admin dashboard**: Calendar, rates, bookings, reports, and more

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env

# Start development environment (PostgreSQL + Redis)
pnpm docker:up

# Setup database and seed data
pnpm db:setup

# Start development servers
pnpm dev