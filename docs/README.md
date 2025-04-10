# Neema Project Documentation

## Project Overview
Neema is a modern web application built with React, TypeScript, and Vite. It features a comprehensive authentication system using Clerk, a beautiful UI built with Tailwind CSS and Radix UI components, and various productivity tools including a timesheet and kanban board.

## Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Query
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Charts**: Recharts
- **Notifications**: Sonner

## Project Structure
```
neema/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Application pages/routes
│   ├── lib/           # Utility functions and configurations
│   ├── hooks/         # Custom React hooks
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
├── docs/             # Project documentation
└── [Configuration Files]
```

## Features
1. **Authentication System**
   - User registration and login
   - Waitlist functionality
   - Protected routes

2. **Dashboard**
   - Main application hub
   - User overview and statistics

3. **Timesheet Management**
   - Time tracking functionality
   - Work hour management

4. **Kanban Board**
   - Task management
   - Project organization

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run development server: `npm run dev`

## Environment Variables
Required environment variables:
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk authentication publishable key

## Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run build:dev`: Build for development
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

## Documentation Structure
- [Project Overview](./README.md)
- [Architecture](./architecture.md)
- [Components](./components.md)
- [Authentication](./authentication.md)
- [API Integration](./api-integration.md)
- [Styling Guide](./styling-guide.md)
- [Deployment](./deployment.md) 