/**
 * CSRF protection utilities for secure API communication
 * Implements double-submit cookie pattern for CSRF protection
 */

export class CSRFProtection {
  private static readonly CSRF_TOKEN_COOKIE = 'csrf-token'
  private static readonly CSRF_TOKEN_HEADER = 'X-CSRF-Token'

  // Generates a cryptographically secure random token
  private static generateToken(): string {
    if (typeof window === 'undefined') return ''
    
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // Sets CSRF token in cookie and returns the token
  static setCSRFToken(): string {
    if (typeof window === 'undefined') return ''
    
    const token = this.generateToken()
    const cookieString = `${this.CSRF_TOKEN_COOKIE}=${token}; Path=/; SameSite=Strict; Secure=${process.env.NODE_ENV === 'production'}`
    document.cookie = cookieString
    
    return token
  }

  // Gets CSRF token from cookie
  static getCSRFToken(): string | null {
    if (typeof window === 'undefined') return null
    
    const cookies = document.cookie.split(';')
    const csrfCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${this.CSRF_TOKEN_COOKIE}=`)
    )
    
    if (!csrfCookie) return null
    
    return csrfCookie.split('=')[1]?.trim() || null
  }

  // Validates CSRF token from cookie and header
  static validateCSRFToken(headerToken: string | null): boolean {
    const cookieToken = this.getCSRFToken()
    
    if (!cookieToken || !headerToken) return false
    
    return cookieToken === headerToken
  }

  // Adds CSRF token to request headers
  static addCSRFHeader(headers: Record<string, string> = {}): Record<string, string> {
    const token = this.getCSRFToken()
    
    if (token) {
      headers[this.CSRF_TOKEN_HEADER] = token
    }
    
    return headers
  }

  // Initializes CSRF protection by setting token if not present
  static initialize(): void {
    if (typeof window === 'undefined') return
    
    if (!this.getCSRFToken()) {
      this.setCSRFToken()
    }
  }
}
