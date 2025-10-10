# LMS Mobile App

A React Native mobile application for the Learning Management System (LMS) built with Expo and TypeScript.

## 🏗️ Architecture

This mobile app uses Supabase for authentication and data management, following the same patterns as the web frontend:

- **Supabase Integration**: Direct integration with Supabase for authentication and database operations
- **Service-based API Clients**: Separate API clients for each domain (auth, course, student, etc.)
- **Automatic Session Management**: Supabase handles token storage and refresh automatically
- **Role-based Navigation**: Different navigation flows for students, instructors, and admins

## 🚀 Features

### Authentication
- Login/Signup with form validation
- Password reset functionality
- Secure token management with automatic refresh
- Role-based access control

### Student Features
- Dashboard with learning statistics
- Course browsing and enrollment
- Progress tracking
- Profile management

### Instructor Features (Coming Soon)
- Course management
- Student management
- Analytics dashboard

### Admin Features (Coming Soon)
- User management
- System settings
- Course oversight

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand with AsyncStorage persistence
- **API Client**: Axios with secure token management
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React Native
- **TypeScript**: Full type safety

## 📱 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on device/simulator**:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration (for future microservices integration)
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

**Getting Supabase Credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy the Project URL and anon/public key

## 📁 Project Structure

```
mobile-frontend/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── student/              # Student-specific screens
│   │   ├── instructor/           # Instructor-specific screens
│   │   └── admin/                # Admin-specific screens
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry point
├── src/
│   ├── components/               # Reusable components
│   ├── lib/                      # Utilities and configurations
│   │   └── secure-api-client.ts  # Secure API client
│   ├── services/                 # API service clients
│   │   ├── auth-api-client.ts
│   │   ├── course-api-client.ts
│   │   └── student-api-client.ts
│   ├── stores/                   # Zustand stores
│   │   └── auth-store.ts
│   └── types/                    # TypeScript type definitions
├── global.css                    # Global styles
├── tailwind.config.js            # Tailwind configuration
└── metro.config.js               # Metro bundler configuration
```

## 🔐 Security Features

- **Supabase Authentication**: Secure authentication with automatic session management
- **Automatic Token Refresh**: Supabase handles token expiration and refresh automatically
- **Row Level Security**: Database-level security policies for data access
- **API Error Handling**: Comprehensive error handling with user-friendly messages
- **Form Validation**: Client-side validation with Zod schemas

## 🎨 UI/UX Features

- **NativeWind Styling**: Consistent styling with Tailwind CSS
- **Responsive Design**: Optimized for various screen sizes
- **Pull-to-Refresh**: Refresh functionality on list screens
- **Loading States**: Proper loading indicators throughout the app
- **Error Handling**: User-friendly error messages and alerts

## 🔄 Data Integration

The mobile app integrates directly with Supabase for all data operations:

- **Authentication**: User login, signup, and session management
- **User Profiles**: Profile management and role-based access
- **Courses**: Course browsing, enrollment, and progress tracking
- **Enrollments**: Student enrollment and progress management
- **Lessons**: Course content and completion tracking
- **Real-time Updates**: Live data synchronization with Supabase

## 🚀 Development

### Code Standards

- **TypeScript**: Full type safety with strict mode
- **ESLint**: Code linting and formatting
- **Consistent Naming**: Descriptive file and function names
- **Comments**: Single-line comments for all functions
- **Error Handling**: Comprehensive error handling throughout

### Adding New Features

1. **Create API Client**: Add new service client in `src/services/`
2. **Define Types**: Add TypeScript types in `src/types/`
3. **Create Screens**: Add new screens in appropriate `app/` directory
4. **Update Navigation**: Modify navigation structure as needed
5. **Test Integration**: Ensure proper API integration

## 📦 Building for Production

### Android

```bash
# Build APK
expo build:android

# Build AAB (for Play Store)
expo build:android --type app-bundle
```

### iOS

```bash
# Build for iOS
expo build:ios
```

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start --clear`
2. **TypeScript errors**: Run `npm run type-check` to identify issues
3. **API connection issues**: Verify API Gateway is running on port 3000
4. **Token issues**: Clear app data and re-login

### Debug Mode

Enable debug mode by setting `EXPO_PUBLIC_DEBUG=true` in your environment variables.

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Add proper TypeScript types for all new features
3. Include error handling and loading states
4. Test on both iOS and Android platforms
5. Update documentation for new features

## 📄 License

This project is part of the LMS microservices architecture and follows the same licensing terms.
