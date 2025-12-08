#!/bin/bash

# Parts CSV Import Script
# Usage: ./scripts/import-parts-csv.sh <path-to-csv-file>

if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-csv-file>"
  exit 1
fi

CSV_FILE="$1"

if [ ! -f "$CSV_FILE" ]; then
  echo "Error: File not found: $CSV_FILE"
  exit 1
fi

echo "Importing parts from: $CSV_FILE"

# Make API call to import endpoint
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@$CSV_FILE" \
  -F "updateExisting=true" \
  -F "skipDuplicates=true" \
  http://localhost:3000/api/parts/import

echo ""
echo "Import complete!"

