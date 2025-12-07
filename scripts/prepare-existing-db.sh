#!/bin/bash

# Script to prepare migrations for existing Supabase database
# Adds 'ace_' prefix to all table names to avoid conflicts

echo "🔧 Preparing Migrations for Existing Database"
echo "=============================================="
echo ""
echo "This script will:"
echo "  1. List all table names in migrations"
echo "  2. Show you what will be prefixed"
echo "  3. Optionally create prefixed versions"
echo ""

MIGRATIONS_DIR="supabase/migrations"

if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "❌ Migrations directory not found: $MIGRATIONS_DIR"
    exit 1
fi

echo "📋 Current migration files:"
ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | while read file; do
    echo "  - $(basename $file)"
done

echo ""
echo "📊 Table names found in migrations:"
grep -h "CREATE TABLE" "$MIGRATIONS_DIR"/*.sql 2>/dev/null | \
    sed 's/CREATE TABLE IF NOT EXISTS //' | \
    sed 's/CREATE TABLE //' | \
    sed 's/ (.*//' | \
    sed 's/[[:space:]]//' | \
    sort -u | \
    while read table; do
        if [ ! -z "$table" ]; then
            echo "  - $table"
        fi
    done

echo ""
echo "💡 Options:"
echo ""
echo "Option 1: Use 'ace_' prefix for all tables"
echo "  - Tables become: ace_parts, ace_vendors, etc."
echo "  - No conflicts with existing tables"
echo ""
echo "Option 2: Use PostgreSQL schema 'ace_electric'"
echo "  - Tables: ace_electric.parts, ace_electric.vendors"
echo "  - More organized but requires schema setup"
echo ""
echo "Option 3: Manual migration review"
echo "  - Review migrations manually"
echo "  - Modify as needed"
echo ""

read -p "Which option? (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "✅ I'll create prefixed migrations for you."
        echo "   Run this command to create them:"
        echo ""
        echo "   node scripts/add-prefix-to-migrations.js"
        echo ""
        ;;
    2)
        echo ""
        echo "✅ I'll create schema-based migrations."
        echo "   This requires running a schema creation first."
        echo ""
        ;;
    3)
        echo ""
        echo "📖 Review migrations manually:"
        echo "   - Check: $MIGRATIONS_DIR/"
        echo "   - Modify table names as needed"
        echo ""
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📝 Next steps:"
echo "   1. Add Supabase credentials to .env.local"
echo "   2. Review/run migrations"
echo "   3. Test connection: npm run test:db"

