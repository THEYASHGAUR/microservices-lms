/**
 * Secure cookie utilities for authentication token management
 * Implements security best practices for cookie handling
 */

export interface CookieOptions {
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

export class SecureCookieManager {
  private static readonly DEFAULT_OPTIONS: CookieOptions = {
    maxAge: 15 * 60, // 15 minutes
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  }

  // Sets secure authentication cookie (client-side compatible)
  static setAuthCookie(token: string, options: Partial<CookieOptions> = {}): void {
    if (typeof window === 'undefined') return

    const cookieOptions = { 
      ...this.DEFAULT_OPTIONS, 
      httpOnly: false, // Cannot set httpOnly from client-side
      ...options 
    }
    const cookieString = this.buildCookieString('auth-token', token, cookieOptions)
    document.cookie = cookieString
  }

  // Sets secure refresh token cookie (client-side compatible)
  static setRefreshCookie(refreshToken: string, options: Partial<CookieOptions> = {}): void {
    if (typeof window === 'undefined') return

    const cookieOptions = { 
      ...this.DEFAULT_OPTIONS, 
      maxAge: 7 * 24 * 60 * 60, // 7 days for refresh token
      httpOnly: false, // Cannot set httpOnly from client-side
      ...options 
    }
    const cookieString = this.buildCookieString('refresh-token', refreshToken, cookieOptions)
    document.cookie = cookieString
  }

  // Removes authentication cookies
  static clearAuthCookies(): void {
    if (typeof window === 'undefined') return

    const expiredOptions = { maxAge: 0, path: '/' }
    document.cookie = this.buildCookieString('auth-token', '', expiredOptions)
    document.cookie = this.buildCookieString('refresh-token', '', expiredOptions)
  }

  // Gets cookie value by name
  static getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null

    const cookies = document.cookie.split(';')
    const cookie = cookies.find(c => c.trim().startsWith(`${name}=`))
    
    if (!cookie) return null
    
    return cookie.split('=')[1]?.trim() || null
  }

  // Builds secure cookie string
  private static buildCookieString(name: string, value: string, options: CookieOptions): string {
    let cookieString = `${name}=${value}`

    if (options.maxAge !== undefined) {
      cookieString += `; Max-Age=${options.maxAge}`
    }

    if (options.path) {
      cookieString += `; Path=${options.path}`
    }

    if (options.domain) {
      cookieString += `; Domain=${options.domain}`
    }

    if (options.secure) {
      cookieString += '; Secure'
    }

    if (options.httpOnly) {
      cookieString += '; HttpOnly'
    }

    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`
    }

    return cookieString
  }
}
