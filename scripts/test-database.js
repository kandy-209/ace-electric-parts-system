#!/usr/bin/env node

/**
 * Test database connection and verify tables exist
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const requiredTables = [
  'parts',
  'vendors',
  'rfqs',
  'orders',
  'customers',
  'vendor_quotes',
  'rfq_vendors',
  'contacts',
];

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    // Test connection
    const { data, error } = await supabase.from('parts').select('count').limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('⚠️  Database connected but tables may not exist yet.');
      console.log('   You need to run the database migrations.\n');
    } else if (error) {
      console.error('❌ Database connection error:', error.message);
      process.exit(1);
    } else {
      console.log('✅ Database connection successful!\n');
    }
    
    // Check which tables exist
    console.log('Checking for required tables:');
    const tableChecks = await Promise.all(
      requiredTables.map(async (tableName) => {
        const { error: tableError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (tableError && tableError.code === 'PGRST116') {
          return { table: tableName, exists: false };
        } else if (tableError) {
          return { table: tableName, exists: false, error: tableError.message };
        } else {
          return { table: tableName, exists: true };
        }
      })
    );
    
    tableChecks.forEach(({ table, exists, error }) => {
      if (exists) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} - ${error || 'Table not found'}`);
      }
    });
    
    const missingTables = tableChecks.filter(t => !t.exists);
    
    console.log('\n' + '='.repeat(50));
    if (missingTables.length === 0) {
      console.log('✅ All required tables exist!');
      console.log('\nNext: You can start using the application.');
    } else {
      console.log(`❌ ${missingTables.length} table(s) missing.`);
      console.log('\nRun database migrations:');
      console.log('  1. Go to Supabase Dashboard → SQL Editor');
      console.log('  2. Run: supabase/migrations/001_create_tables.sql');
      console.log('  3. Run: supabase/migrations/002_comprehensive_schema.sql');
    }
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

testConnection();

