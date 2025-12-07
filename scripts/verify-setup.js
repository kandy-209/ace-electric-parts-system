#!/usr/bin/env node

/**
 * Verification script to check if environment is set up correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Setup...\n');

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
];

const optionalEnvVars = [
  'SENDGRID_API_KEY',
  'RESEND_API_KEY',
  'GOOGLE_CUSTOM_SEARCH_API_KEY',
  'LINKEDIN_CLIENT_ID',
  'GHL_API_KEY',
];

let allGood = true;

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('   Create it by copying .env.example and filling in your values\n');
  allGood = false;
} else {
  console.log('✅ .env.local file exists\n');
  
  // Load env vars
  require('dotenv').config({ path: envPath });
  
  // Check required vars
  console.log('Required Environment Variables:');
  requiredEnvVars.forEach((varName) => {
    if (process.env[varName]) {
      const value = process.env[varName];
      const displayValue = varName.includes('KEY') || varName.includes('SECRET')
        ? `${value.substring(0, 10)}...` 
        : value;
      console.log(`  ✅ ${varName}: ${displayValue}`);
    } else {
      console.log(`  ❌ ${varName}: NOT SET`);
      allGood = false;
    }
  });
  
  console.log('\nOptional Environment Variables:');
  optionalEnvVars.forEach((varName) => {
    if (process.env[varName]) {
      const value = process.env[varName];
      const displayValue = varName.includes('KEY') || varName.includes('SECRET')
        ? `${value.substring(0, 10)}...` 
        : value;
      console.log(`  ✅ ${varName}: ${displayValue}`);
    } else {
      console.log(`  ⚠️  ${varName}: Not set (optional)`);
    }
  });
}

// Check database migrations
console.log('\nDatabase Migrations:');
const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
if (fs.existsSync(migrationsDir)) {
  const migrations = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  console.log(`  ✅ Found ${migrations.length} migration files:`);
  migrations.forEach(m => console.log(`     - ${m}`));
} else {
  console.log('  ❌ Migrations directory not found');
  allGood = false;
}

// Check node_modules
console.log('\nDependencies:');
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('  ✅ node_modules exists');
} else {
  console.log('  ❌ node_modules not found - run: npm install');
  allGood = false;
}

// Final status
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ Setup looks good! You can proceed to next steps.');
  console.log('\nNext: Run database migrations');
} else {
  console.log('❌ Setup incomplete. Please fix the issues above.');
  console.log('\nSee SETUP_GUIDE.md for detailed instructions.');
}
console.log('='.repeat(50));

process.exit(allGood ? 0 : 1);

