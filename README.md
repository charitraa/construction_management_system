# 🏗️ BuildCMS - Construction Management System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0.2-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, full-stack construction management system built with React 18, TypeScript, and Express.js. Features comprehensive project management, employee tracking, payroll processing, and real-time analytics for construction companies.

## ✨ Features

### 🏢 Core Management Modules

- **📊 Dashboard** - Real-time overview with key metrics, trends, and quick stats
- **👥 Employee Management** - Complete employee lifecycle management with roles and rates
- **🏗️ Project Management** - Project tracking with status, budget, and timeline management
- **💰 Revenue Tracking** - Project-based revenue recording and analysis
- **💸 Expense Management** - Categorized expense tracking with project association
- **📅 Attendance System** - Daily attendance tracking with statistics
- **💵 Advance Payments** - Employee advance management and tracking
- **📈 Payroll Processing** - Monthly payroll calculation and summary reports

### 🔐 Authentication & Security

- **🔐 JWT Authentication** - Secure login/logout with token refresh
- **👤 User Registration** - New user account creation
- **🛡️ Protected Routes** - Route-level access control
- **🔒 Role-Based Access** - Admin and manager permissions

### 🎨 User Experience

- **📱 Responsive Design** - Mobile-first approach with TailwindCSS
- **🌙 Modern UI** - Clean, professional interface with Radix UI components
- **⚡ Real-time Updates** - Live data synchronization with React Query
- **🔔 Toast Notifications** - User feedback for all actions
- **🔄 Loading States** - Comprehensive loading indicators

## 🛠️ Tech Stack

### Frontend

- **⚛️ React 18** - Modern React with hooks and concurrent features
- **🔷 TypeScript** - Type-safe development experience
- **⚡ Vite** - Lightning-fast build tool and dev server
- **🎨 TailwindCSS** - Utility-first CSS framework
- **🎛️ Radix UI** - Accessible, customizable UI components
- **🔄 TanStack Query** - Powerful data fetching and caching
- **🧭 React Router 6** - Declarative routing for React

### Backend

- **🚀 Express.js** - Fast, unopinionated web framework
- **🔐 JWT** - JSON Web Token authentication
- **📊 RESTful APIs** - Well-structured API endpoints
- **🛡️ CORS** - Cross-origin resource sharing support
- **📝 Request Validation** - Input validation and sanitization

### Development Tools

- **📦 PNPM** - Fast, disk-efficient package manager
- **🔧 ESLint** - Code linting and formatting
- **🎯 Prettier** - Code formatting
- **🧪 Vitest** - Fast unit testing framework
- **📋 TypeScript** - Static type checking
- **🎨 Tailwind Config** - Custom design system

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **PNPM** package manager
- **Backend API** running (see backend repository)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/construction-management-system.git
   cd construction-management-system
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env with your backend API URL
   ```

4. **Start Development Server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   ```
   http://localhost:8080
   ```

## 📁 Project Structure

```
src/
├── features/                 # Feature-based architecture
│   ├── authentication/        # Auth module (login, signup)
│   ├── dashboard/            # Main dashboard
│   ├── employees/            # Employee management
│   ├── projects/             # Project management
│   ├── revenue/              # Revenue tracking
│   ├── expenses/             # Expense management
│   ├── attendance/           # Attendance system
│   ├── advances/             # Advance payments
│   ├── payroll/              # Payroll processing
│   └── NotFound/             # 404 page
├── shared/                   # Shared utilities
│   ├── api/                  # HTTP client & interceptors
│   ├── types/                # Global type definitions
│   └── constants/            # App constants
├── components/               # Reusable components
│   ├── ui/                   # UI component library
│   └── Layout.tsx            # Main layout wrapper
├── context/                  # React contexts
├── hooks/                    # Custom React hooks
└── lib/                      # Utility functions
```

## 🏗️ Architecture

### Feature-Based Architecture

Each feature is self-contained with its own:

- **Pages** - Route components
- **Hooks** - API integration logic
- **API** - Service functions
- **Types** - TypeScript interfaces
- **Constants** - Query keys and endpoints

### API Integration

- **Axios HTTP Client** with interceptors
- **React Query** for data fetching and caching
- **Error Handling** with toast notifications
- **Loading States** with suspense fallbacks

## 📊 API Endpoints

The frontend integrates with a Django REST API backend:

### Authentication

- `POST /api/users/login/` - User login
- `POST /api/users/register/` - User registration
- `GET /api/users/profile/` - Get user profile
- `POST /api/users/refresh/` - Refresh access token

### Core Resources

- `GET/POST /api/employees/` - Employee management
- `GET/POST /api/projects/` - Project management
- `GET/POST /api/revenue/` - Revenue tracking
- `GET/POST /api/expense/` - Expense management
- `GET/POST /api/attendance/` - Attendance tracking
- `GET/POST /api/advance/` - Advance payments
- `GET /api/payroll/` - Payroll processing
- `GET /api/dashboard/` - Dashboard analytics

## 🎨 UI Components

Built with **Radix UI** and **TailwindCSS**:

- **Buttons** - Multiple variants and sizes
- **Dialogs** - Modal dialogs and forms
- **Tables** - Data tables with sorting
- **Forms** - Input validation and error handling
- **Navigation** - Sidebar and breadcrumbs
- **Charts** - Data visualization (future enhancement)

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build           # Production build
pnpm start           # Start production server

# Code Quality
pnpm typecheck       # TypeScript checking
pnpm format.fix      # Code formatting
pnpm test            # Run tests

# Build Commands
pnpm build:client    # Build frontend only
pnpm build:server    # Build backend only
```

### Code Style

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Conventional Commits** for git messages

## 🚀 Deployment

### Production Build

```bash
pnpm build
```

### Environment Variables

```env
VITE_BACKEND_URL=https://your-api-domain.com/api
VITE_IMAGE_URL=https://your-cdn-domain.com
```

### Deployment Options

- **Netlify** - Frontend hosting with serverless functions
- **Vercel** - Full-stack deployment
- **Docker** - Containerized deployment
- **Static Export** - For CDN deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code structure
- Add TypeScript types for new features
- Write tests for new functionality
- Update documentation as needed
- Follow conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

For support and questions:

- 📧 **Email**: support@buildcms.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-org/construction-management-system/issues)
- 📖 **Documentation**: [API Docs](./API_DOCUMENTATION.md)

## 🔄 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vercel** for the inspiration and tooling
- **Tailwind Labs** for the CSS framework
- **Radix UI** for accessible components
- **TanStack** for React Query

---

**Built with ❤️ for construction companies worldwide**
