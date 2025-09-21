export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role?: 'student' | 'instructor' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
  refreshToken: string;
}
