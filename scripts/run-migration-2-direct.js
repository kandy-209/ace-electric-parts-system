#!/usr/bin/env node

/**
 * Run Migration 2 (Safe Version) via direct PostgreSQL connection
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Extract database connection details from Supabase URL
// Format: https://[project-ref].supabase.co
const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error('❌ Could not parse Supabase URL');
  process.exit(1);
}

// Construct PostgreSQL connection string
// Supabase connection format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
// We'll use the service role key as password (for direct DB access)
// Note: This requires the database password, not the API key
// For Supabase, we need to get the database password from the dashboard

const dbPassword = process.env.SUPABASE_DB_PASSWORD || SUPABASE_SERVICE_KEY;
const connectionString = `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-us-west-1.pooler.supabase.com:6543/postgres?sslmode=require`;

async function runMigration() {
  console.log('🚀 Running Migration 2 (Safe Version) via PostgreSQL...\n');
  
  // Read the migration file
  const migrationPath = path.join(__dirname, '..', 'MIGRATION_2_SAFE.sql');
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
  }
  
  const sql = fs.readFileSync(migrationPath, 'utf8');
  console.log(`📄 Loaded migration file (${sql.length} characters)`);
  console.log('⏳ Connecting to database...\n');
  
  const client = new Client({
    connectionString: connectionString,
    ssl: { 
      rejectUnauthorized: false,
      require: true
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    console.log('⏳ Executing migration...\n');
    
    // Execute the SQL
    const result = await client.query(sql);
    
    console.log('✅ Migration executed successfully!\n');
    console.log(`📊 Result: ${result.command || 'Completed'}`);
    if (result.rowCount !== null) {
      console.log(`   Rows affected: ${result.rowCount}`);
    }
    
    await client.end();
    console.log('\n🎉 Migration 2 complete!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    
    if (error.message.includes('password') || error.message.includes('authentication')) {
      console.error('\n💡 Note: Direct database connection requires the database password.');
      console.error('   You can find it in: Supabase Dashboard → Project Settings → Database');
      console.error('   Add it to .env.local as: SUPABASE_DB_PASSWORD=your_password');
      console.error('\n📝 Alternative: Run manually in Supabase SQL Editor');
      console.error('   1. Go to: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe/sql/new');
      console.error('   2. Copy contents of: MIGRATION_2_SAFE.sql');
      console.error('   3. Paste and click "Run"');
    }
    
    await client.end().catch(() => {});
    process.exit(1);
  }
}

runMigration();

