# LMS Frontend

A modern Learning Management System frontend built with Next.js 15.3, TypeScript, Tailwind CSS, and modern React patterns.

## Features

- **Next.js 15.3** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ESLint** for code quality
- **Authentication** with login/signup
- **Modern Dashboard** with responsive design
- **State Management** with Zustand
- **Form Handling** with React Hook Form and Zod validation
- **API Integration** with Axios

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions
├── services/              # API services
├── stores/                # State management
└── types/                 # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Authentication

The app includes a complete authentication system with:

- Login form with email/password validation
- Signup form with password confirmation
- Protected routes with middleware
- Session management with Zustand
- Token-based authentication

## Dashboard

The dashboard provides:

- Overview statistics
- Recent activities
- Quick actions
- Responsive sidebar navigation
- User profile management

## Tech Stack

- **Framework**: Next.js 15.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **UI Components**: Custom components with Radix UI primitives

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
