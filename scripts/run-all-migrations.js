#!/usr/bin/env node

/**
 * Script to run all remaining migrations via Supabase API
 * This will execute migrations 2 and 3 automatically
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

async function runMigration(migrationFile) {
  const filePath = path.join(process.cwd(), 'supabase', 'migrations', migrationFile);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Migration file not found: ${filePath}`);
    return false;
  }

  const sql = fs.readFileSync(filePath, 'utf8');
  
  console.log(`\n📋 Running migration: ${migrationFile}`);
  console.log(`   Size: ${sql.length} characters`);
  
  try {
    // Use Supabase REST API to run SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (response.ok) {
      console.log(`   ✅ Success!`);
      return true;
    } else {
      const error = await response.text();
      console.error(`   ❌ Error: ${error}`);
      return false;
    }
  } catch (error) {
    console.error(`   ❌ Failed: ${error.message}`);
    console.log(`\n💡 Manual option: Copy and paste the SQL file into Supabase SQL Editor`);
    return false;
  }
}

async function main() {
  console.log('🚀 Running Remaining Migrations');
  console.log('================================\n');

  const migrations = [
    '002_comprehensive_schema.sql',
    '002_enhanced_schema.sql',
  ];

  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (!success) {
      console.log(`\n⚠️  Migration ${migration} failed. Please run it manually in Supabase SQL Editor.`);
      console.log(`   File: supabase/migrations/${migration}`);
      break;
    }
    
    // Small delay between migrations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ Migration process complete!');
  console.log('\n📋 Next: Run "npm run test:db" to verify all tables were created.');
}

main().catch(console.error);

