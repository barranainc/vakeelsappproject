# Vakeel Web Application Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 8043

### Installation

1. **Navigate to the project directory**
   ```bash
   cd vakeel-web
   ```

2. **Run the installation script**
   ```bash
   ./install.sh
   ```

   Or manually install dependencies:
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
vakeel-web/
├── public/                 # Static files
│   ├── index.html         # Main HTML file
│   └── manifest.json      # Web app manifest
├── src/
│   ├── assets/
│   │   └── styles/        # Theme and colors
│   ├── components/        # Reusable components
│   ├── context/          # React Context providers
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── App.tsx           # Main app component
│   └── index.tsx         # Entry point
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── install.sh            # Installation script
└── README.md             # Project documentation
```

## 🎨 Features Implemented

### ✅ Core Features
- **Multi-User Authentication**: Support for Lawyers, Clients, and Paralegal Assistants
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Material-UI components with custom Vakeel branding
- **Protected Routes**: Role-based access control
- **Navigation**: Sidebar navigation with dynamic menu items

### ✅ Pages Created
1. **Onboarding**: Welcome screen with role selection
2. **Login**: Authentication with role-based login
3. **Dashboard**: Overview with statistics and recent cases
4. **Cases**: Case management with search and filtering
5. **Chat**: Real-time messaging interface

### ✅ Components
- **Layout**: Main application layout with navigation
- **AuthContext**: Authentication state management
- **Theme**: Custom Material-UI theme with Vakeel colors

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8043/api
REACT_APP_SOCKET_URL=http://localhost:8043
```

### Backend Integration
The web application is designed to work with the existing Vakeel backend API. Ensure your backend server is running on port 8043.

## 🎯 Key Features

### Authentication Flow
1. User visits `/onboarding`
2. Selects role (Client, Paralegal, Lawyer)
3. Redirected to login with role context
4. After successful login, redirected to dashboard

### Role-Based Navigation
- **Lawyers**: Dashboard, Cases, Clients, Chat, Calendar, Documents, Team Management, Matters
- **Clients**: Dashboard, My Cases, My Lawyers, Chat, Documents, Requests
- **Paralegal**: Dashboard, Cases, Clients, Chat, Calendar, Documents

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interface
- Optimized for all screen sizes

## 🚀 Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style
- TypeScript for type safety
- Material-UI for consistent design
- React hooks for state management
- Functional components with TypeScript

## 🔗 API Integration

The application is ready to integrate with the existing Vakeel backend API. Key endpoints to implement:

- `POST /api/auth/login` - User authentication
- `GET /api/cases` - Fetch cases
- `GET /api/clients` - Fetch clients
- `GET /api/chat` - Chat functionality
- `POST /api/chat/messages` - Send messages

## 🎨 Branding

The application uses the official Vakeel color scheme:
- **Primary**: #0F5189 (Dark Blue)
- **Secondary**: #EAA141 (Orange)
- **Client Button**: #337DBD (Blue)
- **Assistant Button**: #0F5189 (Dark Blue)
- **Lawyer Button**: #EAA141 (Orange)

## 📱 Mobile Responsiveness

The application is fully responsive and includes:
- Mobile-optimized navigation
- Touch-friendly buttons and inputs
- Responsive tables and cards
- Optimized chat interface for mobile

## 🔒 Security Features

- JWT token-based authentication
- Protected routes
- Role-based access control
- Secure API communication
- Session management

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup for Production
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SOCKET_URL=https://your-api-domain.com
```

## 📞 Support

For technical support or questions:
1. Check the README.md file
2. Review the code comments
3. Contact the development team

---

**Vakeel Web Application** - Empowering Legal Practice Management 