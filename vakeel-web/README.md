# Vakeel Web Application

A comprehensive legal practice management platform built with React, TypeScript, and Material-UI.

## Overview

Vakeel is a modern web application designed to streamline legal practice management for lawyers, clients, and paralegal assistants. The platform provides a complete solution for case management, client communication, document handling, and legal workflow automation.

## Features

### 🏛️ Multi-User Platform
- **Lawyers**: Complete case management, client handling, team management
- **Clients**: Case tracking, lawyer communication, document access
- **Paralegal Assistants**: Support tools, case assistance, administrative tasks

### 📋 Core Functionality
- **Case Management**: Complete case lifecycle from creation to closure
- **Client Management**: Client profiles, relationship tracking, communication
- **Document Management**: File upload, categorization, version control
- **Communication**: Real-time chat, notifications, messaging system
- **Calendar & Scheduling**: Hearing dates, appointments, reminders
- **Dashboard & Analytics**: Comprehensive reporting and insights

### 🎨 Modern UI/UX
- Responsive design for all devices
- Material-UI components for consistent design
- Custom Vakeel branding and color scheme
- Intuitive navigation and user experience

## Technology Stack

- **Frontend**: React 18, TypeScript, Material-UI
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Material-UI with custom theme
- **Real-time**: Socket.io (planned)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vakeel-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8043/api
REACT_APP_SOCKET_URL=http://localhost:8043
```

## Project Structure

```
src/
├── assets/
│   ├── images/          # Static images
│   └── styles/          # Theme and color definitions
├── components/          # Reusable UI components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services and utilities
└── utils/              # Helper functions
```

## Key Components

### Authentication
- JWT-based authentication
- Role-based access control
- Protected routes
- Session management

### Layout System
- Responsive sidebar navigation
- Mobile-friendly design
- Dynamic menu based on user role

### Dashboard
- Real-time statistics
- Recent cases overview
- Quick action buttons
- Progress tracking

## API Integration

The application is designed to work with the Vakeel backend API. Key endpoints include:

- `/api/auth/*` - Authentication endpoints
- `/api/cases/*` - Case management
- `/api/clients/*` - Client management
- `/api/users/*` - User management
- `/api/chat/*` - Messaging system

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Material-UI design system

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Setup

Ensure all environment variables are properly configured for production:

```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SOCKET_URL=https://your-api-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Vakeel** - Empowering Legal Practice Management 