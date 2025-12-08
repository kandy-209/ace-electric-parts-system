#!/usr/bin/env node

/**
 * Run Migration 2 (Safe Version) via Supabase API
 * This script attempts to execute the SQL migration directly
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function runMigration() {
  console.log('🚀 Running Migration 2 (Safe Version)...\n');
  
  // Read the migration file
  const migrationPath = path.join(__dirname, '..', 'MIGRATION_2_SAFE.sql');
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
  }
  
  const sql = fs.readFileSync(migrationPath, 'utf8');
  console.log(`📄 Loaded migration file (${sql.length} characters)`);
  console.log('⏳ Attempting to execute via Supabase API...\n');
  
  try {
    // Use Supabase REST API to execute SQL
    // Note: This uses the Management API endpoint
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    });
    
    if (!response.ok) {
      // Try alternative endpoint
      console.log('⚠️  First endpoint failed, trying alternative...\n');
      
      // Alternative: Use Supabase Management API directly
      const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
      if (projectRef) {
        const managementUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/pool/sql`;
        
        const altResponse = await fetch(managementUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          },
          body: JSON.stringify({ query: sql })
        });
        
        if (altResponse.ok) {
          const result = await altResponse.json();
          console.log('✅ Migration executed successfully!\n');
          console.log('Result:', JSON.stringify(result, null, 2));
          return;
        }
      }
      
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Migration executed successfully!\n');
    console.log('Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Failed to execute migration via API:');
    console.error(error.message);
    console.error('\n📝 Alternative: Run manually in Supabase SQL Editor');
    console.error('   1. Go to: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe/sql/new');
    console.error('   2. Copy contents of: MIGRATION_2_SAFE.sql');
    console.error('   3. Paste and click "Run"');
    process.exit(1);
  }
}

runMigration();

