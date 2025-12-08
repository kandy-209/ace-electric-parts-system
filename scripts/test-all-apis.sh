#!/bin/bash

# Test all API endpoints to verify they work

BASE_URL="${1:-http://localhost:3000}"

echo "🧪 Testing API Endpoints"
echo "========================"
echo "Base URL: $BASE_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local method=$1
    local endpoint=$2
    local name=$3
    
    echo -n "Testing $name ($method $endpoint)... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅ OK${NC} (HTTP $http_code)"
        return 0
    elif [ "$http_code" = "401" ] || [ "$http_code" = "403" ]; then
        echo -e "${YELLOW}⚠️  Auth Required${NC} (HTTP $http_code)"
        return 1
    else
        echo -e "${RED}❌ Failed${NC} (HTTP $http_code)"
        echo "   Response: ${body:0:100}"
        return 1
    fi
}

echo "📋 Core APIs:"
test_endpoint "GET" "/api/orders" "Orders List"
test_endpoint "GET" "/api/customers" "Customers List"
test_endpoint "GET" "/api/vendors" "Vendors List"
test_endpoint "GET" "/api/rfq/recent" "Recent RFQs"

echo ""
echo "📋 Search & Discovery:"
test_endpoint "GET" "/api/parts/search?q=motor" "Parts Search"
test_endpoint "GET" "/api/vendors/discover?query=electric" "Vendor Discovery"

echo ""
echo "📋 Sales APIs:"
test_endpoint "GET" "/api/sales/stats" "Sales Stats"

echo ""
echo "✅ API Testing Complete!"
echo ""
echo "Note: Some endpoints may require authentication or specific parameters."
echo "Check individual API docs for full requirements."

