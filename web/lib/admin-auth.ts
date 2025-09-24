import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  role: string;
  is_active: boolean;
}

export interface AdminSession {
  admin: AdminUser;
  token: string;
}

// Rate limiting store (in production, use Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export class AdminAuth {
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private static readonly JWT_EXPIRES_IN = '1h';

  static async authenticate(username: string, password: string, ip: string): Promise<AdminSession | null> {
    // Check rate limiting
    if (this.isRateLimited(username, ip)) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    try {
      // Get admin from database
      const { data: admins, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (error || !admins) {
        this.recordFailedAttempt(username, ip);
        return null;
      }

      // Check if account is locked
      if (admins.locked_until && new Date(admins.locked_until) > new Date()) {
        throw new Error('Account is temporarily locked due to too many failed attempts.');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, admins.password_hash);
      if (!isValidPassword) {
        await this.recordFailedLogin(admins.id, username, ip);
        return null;
      }

      // Reset failed login count on successful login
      await this.resetFailedLogins(admins.id);

      // Create JWT token
      const token = jwt.sign(
        {
          sub: admins.id,
          username: admins.username,
          role: admins.role,
          iat: Math.floor(Date.now() / 1000)
        },
        process.env.JWT_SECRET!,
        { expiresIn: this.JWT_EXPIRES_IN }
      );

      // Update last login
      await supabase
        .from('admins')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', admins.id);

      // Log successful login
      await this.logAdminAction(admins.id, 'login', null, null, { ip }, ip, 'admin-login');

      return {
        admin: {
          id: admins.id,
          username: admins.username,
          email: admins.email,
          role: admins.role,
          is_active: admins.is_active
        },
        token
      };

    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  static async verifyToken(token: string): Promise<AdminUser | null> {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Verify admin still exists and is active
      const { data: admin, error } = await supabase
        .from('admins')
        .select('id, username, email, role, is_active')
        .eq('id', payload.sub)
        .eq('is_active', true)
        .single();

      if (error || !admin) {
        return null;
      }

      return {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        is_active: admin.is_active
      };

    } catch (error) {
      return null;
    }
  }

  static async getAdminFromRequest(request: NextRequest): Promise<AdminUser | null> {
    const token = request.cookies.get('admin_session')?.value;
    if (!token) return null;

    return this.verifyToken(token);
  }

  static async logAdminAction(
    adminId: string,
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: any,
    ip?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await supabase
        .from('admin_audit_logs')
        .insert([{
          admin_id: adminId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details,
          ip,
          user_agent: userAgent
        }]);
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  }

  private static isRateLimited(username: string, ip: string): boolean {
    const key = `${username}:${ip}`;
    const attempts = loginAttempts.get(key);

    if (!attempts) return false;

    const now = Date.now();
    const timeSinceLastAttempt = now - attempts.lastAttempt;

    // Reset if enough time has passed
    if (timeSinceLastAttempt > this.LOCKOUT_DURATION) {
      loginAttempts.delete(key);
      return false;
    }

    return attempts.count >= this.MAX_LOGIN_ATTEMPTS;
  }

  private static recordFailedAttempt(username: string, ip: string): void {
    const key = `${username}:${ip}`;
    const attempts = loginAttempts.get(key) || { count: 0, lastAttempt: 0 };
    
    attempts.count++;
    attempts.lastAttempt = Date.now();
    
    loginAttempts.set(key, attempts);
  }

  private static async recordFailedLogin(adminId: string, username: string, ip: string): Promise<void> {
    // Update failed login count in database
    const { data: admin } = await supabase
      .from('admins')
      .select('failed_logins')
      .eq('id', adminId)
      .single();

    const newFailedCount = (admin?.failed_logins || 0) + 1;
    const shouldLock = newFailedCount >= this.MAX_LOGIN_ATTEMPTS;

    await supabase
      .from('admins')
      .update({
        failed_logins: newFailedCount,
        locked_until: shouldLock ? new Date(Date.now() + this.LOCKOUT_DURATION).toISOString() : null
      })
      .eq('id', adminId);

    // Log failed login attempt
    await this.logAdminAction(
      adminId,
      'login_failed',
      null,
      null,
      { failed_count: newFailedCount, ip },
      ip,
      'admin-login'
    );

    // Record in memory for immediate rate limiting
    this.recordFailedAttempt(username, ip);
  }

  private static async resetFailedLogins(adminId: string): Promise<void> {
    await supabase
      .from('admins')
      .update({
        failed_logins: 0,
        locked_until: null
      })
      .eq('id', adminId);
  }
}
