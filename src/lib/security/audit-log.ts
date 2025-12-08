/**
 * Enterprise Audit Logging
 * Tracks all user actions for compliance and security
 */

import { createSupabaseAdmin } from '@/lib/database/supabase-client';

export interface AuditLogEntry {
  action: string;
  resource_type: string;
  resource_id?: string;
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failure' | 'error';
  error_message?: string;
}

/**
 * Create audit log entry
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = createSupabaseAdmin();
    
    // Get client info if available
    const ip_address = entry.ip_address || 'unknown';
    const user_agent = entry.user_agent || 'unknown';
    const timestamp = new Date().toISOString();

    const { error } = await supabase.from('audit_logs').insert({
      action: entry.action,
      resource_type: entry.resource_type,
      resource_id: entry.resource_id,
      user_id: entry.user_id,
      user_email: entry.user_email,
      ip_address,
      user_agent,
      metadata: entry.metadata || {},
      severity: entry.severity || 'low',
      status: entry.status,
      error_message: entry.error_message,
      created_at: timestamp,
    });

    if (error) {
      // Don't throw - audit logging should never break the application
      console.error('Audit log error:', error);
    }
  } catch (error) {
    // Silent fail - audit logging should be resilient
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Extract request metadata for audit logging
 */
export function extractRequestMetadata(req: Request): {
  ip_address?: string;
  user_agent?: string;
} {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip');
  const userAgent = req.headers.get('user-agent');

  return {
    ip_address: ip || undefined,
    user_agent: userAgent || undefined,
  };
}

/**
 * Audit log helpers for common actions
 */
export const auditActions = {
  // Authentication
  userLogin: 'user.login',
  userLogout: 'user.logout',
  userSignup: 'user.signup',
  passwordReset: 'user.password_reset',
  
  // Data Access
  dataView: 'data.view',
  dataCreate: 'data.create',
  dataUpdate: 'data.update',
  dataDelete: 'data.delete',
  dataExport: 'data.export',
  dataImport: 'data.import',
  
  // API Access
  apiCall: 'api.call',
  apiError: 'api.error',
  
  // Security
  permissionDenied: 'security.permission_denied',
  rateLimitExceeded: 'security.rate_limit_exceeded',
  suspiciousActivity: 'security.suspicious_activity',
  
  // Business Actions
  rfqCreated: 'rfq.created',
  rfqUpdated: 'rfq.updated',
  orderPlaced: 'order.placed',
  vendorAdded: 'vendor.added',
  partUpdated: 'part.updated',
};

/**
 * Resource types
 */
export const resourceTypes = {
  user: 'user',
  part: 'part',
  vendor: 'vendor',
  rfq: 'rfq',
  order: 'order',
  customer: 'customer',
  contact: 'contact',
  file: 'file',
  api: 'api',
};

