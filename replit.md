# MicroMentor - Mentorship Platform

## Overview

MicroMentor is an impact-first mentorship platform that connects ambitious, growth-minded individuals with real mentors through asynchronous, low-commitment interactions. The platform operates on a "Cameo meets Quora for mentorship" model, focusing on accessibility and inclusion. It serves "under-connected strivers" who lack access to traditional mentorship networks, with special emphasis on underrepresented groups including LGBTQ+ professionals and first-generation professionals.

The platform facilitates personalized mentor-mentee interactions through a question-and-answer format, enhanced by AI-generated insights and action steps. Mentors can provide guidance without significant time commitments, while mentees receive tailored advice with actionable next steps.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system featuring warm, inclusive color palette
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Theme System**: Custom light/dark mode implementation with CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with type-safe request/response handling
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Replit OAuth integration with OpenID Connect
- **Development**: Hot module replacement with Vite development server

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple

### Database Schema Design
The system uses a multi-table approach:
- **Users**: Core user profiles with role-based access (mentee, mentor, both)
- **Mentor Profiles**: Extended mentor information including expertise, capacity, and availability
- **Questions**: Mentee-submitted questions with categorization and privacy controls
- **Answers**: Mentor responses with AI-enhanced insights and action steps
- **Mentor Applications**: Application workflow for mentor verification and onboarding

### Authentication and Authorization
- **Provider**: Replit OAuth with OpenID Connect
- **Session Management**: Secure HTTP-only cookies with PostgreSQL persistence
- **User Roles**: Role-based access control (mentee, mentor, both)
- **Security**: CSRF protection, secure session configuration, and domain-restricted access

### AI Integration Architecture
- **Purpose**: Generate actionable insights and next steps from mentor answers
- **Implementation**: Placeholder for OpenAI integration in answer processing
- **Data Flow**: Questions and answers are processed to extract key takeaways and action items
- **Enhancement**: AI augments human mentor responses rather than replacing them

### Mobile-First Design System
- **Responsive Strategy**: Mobile-first approach with progressive enhancement
- **Navigation**: Bottom tab bar for mobile, contextual navigation for desktop
- **Accessibility**: WCAG-compliant color contrasts and inclusive design patterns
- **Performance**: Optimized bundle splitting and lazy loading for mobile networks

## External Dependencies

### Authentication Services
- **Replit OAuth**: Primary authentication provider using OpenID Connect standard
- **Session Management**: PostgreSQL-backed session storage for scalability

### Database Infrastructure
- **Neon PostgreSQL**: Serverless PostgreSQL database for scalable data storage
- **Connection Management**: WebSocket-based connections for optimal performance

### Development and Deployment
- **Replit Platform**: Development environment and deployment infrastructure
- **Vite**: Build tool and development server with HMR capabilities
- **TypeScript**: Type safety across frontend, backend, and shared schemas

### UI and Design Dependencies
- **Radix UI**: Accessible component primitives for complex UI patterns
- **Lucide React**: Consistent icon library for visual hierarchy
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Google Fonts**: Inter font family for accessibility and readability

### Future AI Integration
- **OpenAI API**: Planned integration for generating insights from mentor responses
- **Content Enhancement**: AI-powered action steps and key takeaway extraction
- **Quality Assurance**: AI assistance in maintaining response quality and relevance