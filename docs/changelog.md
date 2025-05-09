# Neema Project Changelog

## Project Overview

Neema is a productivity application with the following features:
- Task management with Kanban board functionality
- Project organization
- Note-taking functionality
- Time tracking/timesheet features
- User authentication using Clerk
- Modern UI built with React, Tailwind CSS, and Radix UI components

## Architecture

### Frontend
- **Framework**: React with TypeScript
- **Routing**: React Router v6
- **State Management**: React Query for server state
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives with custom styling
- **Authentication**: Clerk for authentication and user management
- **Build Tool**: Vite

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Clerk SDK for server-side validation
- **API Security**: Helmet, CORS, rate limiting
- **Data Validation**: Express Validator

## Data Models

### User
- Basic user information managed through Clerk
- Additional user metadata stored in MongoDB

### Task
- Core entity for task management
- Properties: title, description, status, priority, due date, etc.
- Relationships to User (owner) and Project

### Project
- Organization unit for tasks
- Properties: name, description, status, etc.
- Relationships to User (owner) and Tasks

### Note
- Text content with support for rich formatting
- Properties: title, content, tags
- Relationships to User (owner)

## API Endpoints

### Tasks API
- CRUD operations for task management
- Filtering, sorting, and pagination

### Projects API
- CRUD operations for projects
- Association with tasks

### Notes API
- CRUD operations for notes

### Users API
- User profile management
- Preference settings

### AI API
- AI-assisted productivity features with rate limiting

## User Interface

### Pages
- Landing Page (Index)
- Authentication (Login, Signup, Join Waitlist)
- Dashboard
- Kanban Board for task management
- Timesheet for time tracking

### Key Components
- Modern, responsive design
- Consistent styling with Tailwind CSS
- Interactive UI elements with proper accessibility support

## Development Guidelines

- TypeScript for type safety
- Consistent code formatting
- Component-based architecture
- API-first approach with proper error handling
- Security best practices

## Deployment

The application is designed to be deployed as:
- Frontend: Static site 
- Backend: Node.js server 
- Database: MongoDB Atlas

## Local Development Setup

1. Clone the repository
2. Install dependencies:
   - Frontend: `npm install` in root directory
   - Backend: `npm install` in the backend directory
3. Set up environment variables:
   - Create `.env` file in root and backend directories
   - Configure MongoDB connection and Clerk API keys
4. Start development servers:
   - Frontend: `npm run dev`
   - Backend: `npm run dev` in backend directory

## Next Steps

- Implement comprehensive test coverage
- Enhance AI feature integration
- Improve mobile responsiveness
- Add advanced analytics
- Integrate with third-party services 

## Version 1.1.1 - [Current Date]

### Added
- Standardized environment variable naming convention with `VITE_` prefix for frontend variables
- Comprehensive environment variable documentation in API integration and deployment guides

### Updated
- Environment variable references in frontend services to use `import.meta.env.VITE_*`
- Documentation to reflect proper environment variable usage in Vite applications
- API client configuration to use standardized environment variables

### Fixed
- Environment variable access in frontend services to properly use Vite's `import.meta.env`
- Inconsistent environment variable naming across the application

### Notes
- All frontend environment variables must now be prefixed with `VITE_` to be accessible in the Vite application
- Backend environment variables remain unchanged (no `VITE_` prefix required)

## Version 1.1.0 - [Date]

### Added
- `ChatWithNeema` component with voice input using the Web Speech API.
- Integration with OpenRouter, Google Calendar, Notion, and LinkedIn services.
- `CalendarPreview` component to display Google Calendar events.
- Backend routes for calendar integration using mock data for development.

### Updated
- Modular implementation with frontend components, service files for API calls, and backend routes for data processing.

### Notes
- Application uses mock data for development until full OAuth implementation is completed.

--- 