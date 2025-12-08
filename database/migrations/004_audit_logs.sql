-- Migration: Audit Logs Table
-- Purpose: Enterprise audit logging for compliance and security

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  user_id UUID,
  user_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
  status TEXT CHECK (status IN ('success', 'failure', 'error')) NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id) WHERE resource_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity) WHERE severity IN ('high', 'critical');
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON audit_logs(status) WHERE status = 'failure';

-- Add comments for documentation
COMMENT ON TABLE audit_logs IS 'Enterprise audit log for compliance and security tracking';
COMMENT ON COLUMN audit_logs.action IS 'Action performed (e.g., user.login, data.create)';
COMMENT ON COLUMN audit_logs.resource_type IS 'Type of resource affected (e.g., user, part, vendor)';
COMMENT ON COLUMN audit_logs.resource_id IS 'ID of the affected resource';
COMMENT ON COLUMN audit_logs.severity IS 'Severity level of the action';
COMMENT ON COLUMN audit_logs.status IS 'Status of the action (success, failure, error)';
COMMENT ON COLUMN audit_logs.metadata IS 'Additional context data in JSON format';

