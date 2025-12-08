# 🧪 Testing Guide

## Overview

Your application now has comprehensive testing infrastructure set up!

---

## 🚀 Quick Start

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

---

## 📁 Test Structure

```
src/
├── lib/
│   └── import/
│       ├── __tests__/
│       │   └── parts-importer.test.ts
│       └── parts-importer.ts
└── app/
    └── api/
        └── parts/
            └── import/
                ├── __tests__/
                │   └── route.test.ts
                └── route.ts
```

---

## ✅ Current Tests

### Parts Importer Tests
- ✅ CSV/Excel row mapping
- ✅ Column name format handling
- ✅ Array parsing (comma-separated)
- ✅ JSON field parsing
- ✅ Missing field handling
- ✅ Part validation

### API Route Tests
- ✅ CSV file import
- ✅ JSON import
- ✅ Invalid file type rejection
- ✅ Error handling

---

## 🎯 Writing New Tests

### Example: Testing a Utility Function

```typescript
import { myFunction } from '../my-module';

describe('My Module', () => {
  describe('myFunction', () => {
    it('should handle valid input', () => {
      const result = myFunction('valid');
      expect(result).toBe('expected');
    });

    it('should handle invalid input', () => {
      expect(() => myFunction('invalid')).toThrow();
    });
  });
});
```

### Example: Testing an API Route

```typescript
import { POST } from '../route';
import { NextRequest } from 'next/server';

describe('POST /api/my-endpoint', () => {
  it('should process valid request', async () => {
    const request = new NextRequest('http://localhost:3000/api/my-endpoint', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

---

## 🧪 Test Coverage Goals

- **Unit Tests**: 80%+ coverage for utility functions
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows (future)

---

## 📊 Current Coverage

Run `npm run test:coverage` to see current coverage.

---

## 🔧 Configuration

- **Jest Config**: `jest.config.js`
- **Setup File**: `jest.setup.js`
- **Test Environment**: jsdom for React components

---

## 🎉 Next Steps

1. ✅ Add more unit tests
2. ✅ Add integration tests
3. ✅ Add E2E tests (Playwright)
4. ✅ Set up CI/CD testing

---

**Happy Testing!** 🚀

