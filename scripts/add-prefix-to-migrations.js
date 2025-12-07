#!/usr/bin/env node

/**
 * Script to add 'ace_' prefix to all table names in migrations
 * This allows using an existing Supabase database without conflicts
 */

const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
const outputDir = path.join(process.cwd(), 'supabase', 'migrations-prefixed');

// Table names that need prefixing
const tablesToPrefix = [
  'parts', 'part_cross_references', 'vendors', 'rfqs', 'rfq_vendors',
  'vendor_quotes', 'orders', 'order_items', 'customers', 'customer_equipment',
  'quotes', 'repairs', 'jobs', 'equipment', 'contracts', 'employees',
  'training_courses', 'users', 'roles', 'permissions', 'user_roles',
  'role_permissions', 'portal_users', 'contacts', 'contact_interactions',
  'integrations', 'integration_sync_logs', 'webhooks', 'webhook_events',
  'communications', 'communication_templates', 'notifications',
  'inventory', 'inventory_movements', 'scraping_jobs', 'import_jobs',
  'sync_jobs', 'documents', 'audit_logs', 'analytics_events',
  'workflows', 'workflow_executions', 'workflow_approvals',
  'sales_reps', 'sales_teams', 'sales_activities', 'sales_notes',
  'performance_metrics', 'marketplace_listings', 'seller_listings',
  'buyer_intents', 'marketplace_deals', 'commissions',
  'ml_training_data', 'ml_training_jobs', 'ml_models', 'ml_predictions'
];

function addPrefixToTableName(sql, tableName, prefix = 'ace_') {
  const prefixedName = `${prefix}${tableName}`;
  
  // Create regex patterns for different SQL statements
  const patterns = [
    // CREATE TABLE statements
    new RegExp(`CREATE TABLE (IF NOT EXISTS )?${tableName}\\b`, 'gi'),
    new RegExp(`CREATE TABLE (IF NOT EXISTS )?("${tableName}")\\b`, 'gi'),
    // ALTER TABLE statements
    new RegExp(`ALTER TABLE ${tableName}\\b`, 'gi'),
    new RegExp(`ALTER TABLE ("${tableName}")\\b`, 'gi'),
    // References in FOREIGN KEY
    new RegExp(`REFERENCES ${tableName}\\(`, 'gi'),
    new RegExp(`REFERENCES ("${tableName}")\\b`, 'gi'),
    // FROM clauses
    new RegExp(`FROM ${tableName}\\b`, 'gi'),
    new RegExp(`FROM ("${tableName}")\\b`, 'gi'),
    // JOIN clauses
    new RegExp(`JOIN ${tableName}\\b`, 'gi'),
    new RegExp(`JOIN ("${tableName}")\\b`, 'gi'),
    // INSERT INTO
    new RegExp(`INSERT INTO ${tableName}\\b`, 'gi'),
    new RegExp(`INSERT INTO ("${tableName}")\\b`, 'gi'),
    // UPDATE statements
    new RegExp(`UPDATE ${tableName}\\b`, 'gi'),
    new RegExp(`UPDATE ("${tableName}")\\b`, 'gi'),
    // DELETE FROM
    new RegExp(`DELETE FROM ${tableName}\\b`, 'gi'),
    new RegExp(`DELETE FROM ("${tableName}")\\b`, 'gi'),
  ];
  
  let result = sql;
  
  // Replace all occurrences
  tablesToPrefix.forEach(table => {
    const prefixed = `${prefix}${table}`;
    
    // Replace CREATE TABLE
    result = result.replace(
      new RegExp(`CREATE TABLE (IF NOT EXISTS )?${table}\\b`, 'gi'),
      (match) => match.replace(table, prefixed)
    );
    
    // Replace ALTER TABLE
    result = result.replace(
      new RegExp(`ALTER TABLE (IF NOT EXISTS )?${table}\\b`, 'gi'),
      (match) => match.replace(table, prefixed)
    );
    
    // Replace REFERENCES
    result = result.replace(
      new RegExp(`REFERENCES ${table}\\(`, 'gi'),
      (match) => match.replace(table, prefixed)
    );
    
    // Replace FROM
    result = result.replace(
      new RegExp(`\\bFROM ${table}\\b`, 'gi'),
      (match) => match.replace(table, prefixed)
    );
    
    // Replace JOIN
    result = result.replace(
      new RegExp(`\\bJOIN ${table}\\b`, 'gi'),
      (match) => match.replace(table, prefixed)
    );
    
    // Replace INSERT INTO
    result = result.replace(
      new RegExp(`INSERT INTO ${table}\\b`, 'gi'),
      (match) => match.replace(table, prefixed)
    );
    
    // Replace UPDATE
    result = result.replace(
      new RegExp(`UPDATE ${table}\\b`, 'gi'),
      (match) => match.replace(table, prefixed)
    );
    
    // Replace DELETE FROM
    result = result.replace(
      new RegExp(`DELETE FROM ${table}\\b`, 'gi'),
      (match) => match.replace(table, prefixed)
    );
    
    // Replace index names
    result = result.replace(
      new RegExp(`idx_${table}\\b`, 'gi'),
      (match) => match.replace(`idx_${table}`, `idx_${prefixed}`)
    );
  });
  
  return result;
}

function processMigrations() {
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Get all migration files
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  console.log(`📋 Found ${files.length} migration files\n`);
  
  files.forEach(file => {
    const inputPath = path.join(migrationsDir, file);
    const outputPath = path.join(outputDir, file);
    
    console.log(`Processing: ${file}...`);
    
    let content = fs.readFileSync(inputPath, 'utf8');
    
    // Add prefix to all table names
    tablesToPrefix.forEach(table => {
      content = addPrefixToTableName(content, table);
    });
    
    // Add header comment
    const header = `-- Prefixed version for existing database
-- Original: ${file}
-- All tables prefixed with 'ace_' to avoid conflicts
-- Generated: ${new Date().toISOString()}

`;
    
    content = header + content;
    
    // Write prefixed version
    fs.writeFileSync(outputPath, content);
    console.log(`  ✅ Created: ${path.basename(outputPath)}`);
  });
  
  console.log(`\n✅ Done! Prefixed migrations created in: supabase/migrations-prefixed/`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Review the prefixed migrations`);
  console.log(`   2. Copy them to your Supabase SQL Editor`);
  console.log(`   3. Run them in order`);
  console.log(`   4. Update your code to use 'ace_' prefix (see guide)`);
}

processMigrations();

