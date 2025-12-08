# 📦 Parts Database Import Guide

## 🎯 Complete Guide to Populating Your Parts Database

Your application now has **multiple ways** to import parts data into your database!

---

## 🚀 Quick Start

### Option 1: Generate Sample Parts (Fastest - 2 minutes)

**Generate and import 300+ sample parts instantly:**

```bash
# Generate sample parts CSV
npm run parts:generate-sample

# Import them (after starting dev server)
npm run dev
# In another terminal:
npm run parts:import
```

**OR use the API directly:**

```bash
# Generate and import via API
curl -X POST http://localhost:3000/api/parts/generate-sample \
  -H "Content-Type: application/json" \
  -d '{"count": 100}'
```

---

### Option 2: Import from Excel/CSV File

**Step 1: Prepare your CSV/Excel file**

Your file should have these columns (case-insensitive):

**Required:**
- `part_number` (or `Part Number`)
- `description` (or `Description`)

**Optional:**
- `manufacturer_part_number` / `Manufacturer Part Number` / `MPN`
- `category` / `Category`
- `subcategory` / `Subcategory`
- `manufacturer` / `Manufacturer`
- `unit_cost` / `Unit Cost` / `Price`
- `current_stock` / `Current Stock` / `STOCK`
- `min_stock_level` / `Min Stock`
- `oem_equivalents` (comma-separated)
- `technical_specs` (JSON string)
- `motor_compatibility` (JSON string)
- `seo_keywords` (comma-separated)

**Example CSV:**
```csv
part_number,description,category,manufacturer,unit_cost,current_stock
MTR-BAL-0001,Baldor Ball Bearing for 143T frame,bearings,Baldor,45.99,25
MTR-LEE-0002,Leeson Motor Shaft 1.5 inch diameter,shafts,Leeson,125.50,10
```

**Step 2: Import via UI**
1. Go to `/admin/import`
2. Upload your Excel/CSV file
3. Click "Upload"
4. View results

**Step 3: Import via API**
```bash
curl -X POST \
  -F "file=@your-parts.csv" \
  -F "updateExisting=true" \
  -F "skipDuplicates=true" \
  http://localhost:3000/api/parts/import
```

**Step 3: Import via Script**
```bash
chmod +x scripts/import-parts-csv.sh
./scripts/import-parts-csv.sh path/to/your-parts.csv
```

---

### Option 3: Import via JSON API

**Send parts as JSON array:**

```bash
curl -X POST http://localhost:3000/api/parts/import \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {
        "part_number": "MTR-001",
        "description": "Electric Motor Bearing",
        "category": "bearings",
        "manufacturer": "Baldor",
        "unit_cost": 45.99,
        "current_stock": 25
      },
      {
        "part_number": "MTR-002",
        "description": "Motor Shaft",
        "category": "shafts",
        "manufacturer": "Leeson",
        "unit_cost": 125.50
      }
    ],
    "updateExisting": true,
    "skipDuplicates": true
  }'
```

---

## 📊 Import Options

### Update Existing Parts

- **`updateExisting: true`** - Update parts that already exist (default: true)
- **`updateExisting: false`** - Skip existing parts

### Duplicate Handling

- **`skipDuplicates: true`** - Skip duplicates without error (default: true)
- **`skipDuplicates: false`** - Throw error if duplicate found

---

## 🔧 Advanced Features

### Bulk Import with Validation

All parts are automatically validated:
- Part number required
- Description required
- Invalid parts are skipped (logged as warnings)
- Errors are reported in the response

### Performance

- **Batch Processing**: Parts are processed in batches of 100
- **Error Handling**: Individual part errors don't stop the import
- **Audit Logging**: All imports are logged for compliance

### Example Response

```json
{
  "success": true,
  "message": "Imported 150 new parts, updated 25 existing parts",
  "result": {
    "success": true,
    "total": 175,
    "inserted": 150,
    "updated": 25,
    "skipped": 0,
    "errors": [],
    "duration": 1234
  }
}
```

---

## 📋 CSV/Excel Template

**Download this template to get started:**

```csv
part_number,manufacturer_part_number,description,category,subcategory,manufacturer,unit_cost,current_stock,min_stock_level,oem_equivalents,seo_keywords
MTR-BAL-0001,BAL-143T-BRG-001,Baldor Ball Bearing for 143T frame,bearings,Ball Bearing,Baldor,45.99,25,10,BAL-143T-BRG-001-ALT,bearing ball 143t
MTR-LEE-0002,LEE-SHAFT-1.5,Leeson Motor Shaft 1.5 inch diameter,shafts,Motor Shaft,Leeson,125.50,10,5,LEE-SHAFT-1.5-ALT,motor shaft 1.5 inch
```

---

## 🎯 Common Use Cases

### 1. Import from Existing Inventory System

```javascript
// Export from your system as CSV
// Then import using the API
const response = await fetch('/api/parts/import', {
  method: 'POST',
  body: formData, // Your CSV file
});
```

### 2. Import from Manufacturer Catalogs

1. Download manufacturer PDF/Excel catalogs
2. Convert to CSV format
3. Map columns to your schema
4. Import via API

### 3. Generate Test Data

```bash
# Generate 300+ sample parts
npm run parts:generate-sample

# Or generate specific category
curl -X POST http://localhost:3000/api/parts/generate-sample \
  -H "Content-Type: application/json" \
  -d '{"category": "bearings", "count": 50}'
```

---

## 🔍 Verifying Your Import

**Check imported parts:**

```bash
# Via API
curl http://localhost:3000/api/parts/search?limit=10

# Or check database directly
# In Supabase dashboard → Table Editor → parts
```

---

## 📈 Import Statistics

After importing, you can check:
- Total parts in database
- Parts by category
- Parts by manufacturer
- Stock levels
- Import history (via audit logs)

---

## 🛠️ Troubleshooting

### "No valid parts found"
- Check CSV headers match expected column names
- Ensure part_number and description columns exist
- Check file encoding (should be UTF-8)

### "Part already exists"
- Set `updateExisting: true` to update
- Or set `skipDuplicates: true` to skip

### Import is slow
- Normal for large files (1000+ parts)
- Processed in batches for reliability
- Check logs for any errors

### Missing data
- Optional fields can be empty
- Some fields auto-populate defaults
- Check validation errors in response

---

## 🎉 Next Steps

After importing parts:

1. **Verify Data**: Check a few parts in the database
2. **Update Stock**: Adjust stock levels as needed
3. **Add Images**: Upload product images
4. **Enrich Data**: Add technical specs, drawings
5. **Set Pricing**: Update unit costs
6. **Configure Vendors**: Link preferred vendors

---

## 📚 Related Documentation

- `ENTERPRISE_IMPLEMENTATION.md` - Enterprise features
- `API_ROADMAP.md` - API documentation
- `DATABASE_ARCHITECTURE.md` - Database schema

---

**Ready to populate your database? Start with sample parts or upload your own data!** 🚀

