/**
 * Secure API client with proper error handling and CSRF protection
 * Implements security best practices for API communication
 */

import axios from 'axios';
import { CSRFProtection } from './csrf-protection';

export interface ApiErrorResponse {
  message: string;
  code?: string;
  field?: string;
}

export class SecureApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly field?: string;

  constructor(message: string, status: number, code?: string, field?: string) {
    super(message);
    this.name = 'SecureApiError';
    this.status = status;
    this.code = code;
    this.field = field;
  }
}

const secureApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true, // Ensure cookies are sent with requests
});

export class SecureApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Makes secure HTTP requests with proper error handling and CSRF protection
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Add CSRF protection for state-changing operations
    const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET');
    const headers = { ...this.defaultHeaders, ...options.headers };

    // Skip CSRF for auth endpoints as they handle their own security
    const isAuthEndpoint = endpoint.includes('/auth/');

    if (isStateChanging && !isAuthEndpoint) {
      Object.assign(headers, CSRFProtection.addCSRFHeader(headers));
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw this.createSecureError(data, response.status);
      }

      return data;
    } catch (error) {
      if (error instanceof SecureApiError) {
        throw error;
      }

      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new SecureApiError(
          'Unable to connect to the server. Please ensure the API Gateway is running on port 3000.',
          0,
          'NETWORK_ERROR'
        );
      }

      // Other errors
      throw new SecureApiError(
        'An unexpected error occurred. Please try again.',
        0,
        'UNKNOWN_ERROR'
      );
    }
  }

  // Creates secure error with sanitized messages
  private createSecureError(data: ApiErrorResponse, status: number): SecureApiError {
    const message = data.message || 'An error occurred';
    const code = data.code || 'UNKNOWN_ERROR';
    const field = data.field;

    return new SecureApiError(message, status, code, field);
  }
}

export default secureApiClient;
