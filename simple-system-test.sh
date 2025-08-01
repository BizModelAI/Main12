#!/bin/bash

# BizModelAI Simple System Verification Script
# This script uses curl to test all major endpoints

echo "🚀 Starting BizModelAI System Verification"
echo "📍 Testing server at: http://localhost:3001"
echo "⏰ Started at: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local curl_command="$2"
    local expected_pattern="$3"
    
    echo "🧪 Testing: $test_name"
    
    # Run the curl command and capture output
    local output
    output=$(eval "$curl_command" 2>/dev/null)
    local exit_code=$?
    
    if [ $exit_code -eq 0 ] && [[ "$output" =~ $expected_pattern ]]; then
        echo -e "  ${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "  ${RED}❌ FAIL${NC}"
        echo "    Output: $output"
        ((FAILED++))
    fi
    echo ""
}

echo "============================================================"
echo "🧪 SERVER INFRASTRUCTURE VERIFICATION"
echo "============================================================"

# Test 1: Health endpoint
run_test "Health endpoint" \
    "curl -s http://localhost:3001/api/health" \
    '"status":"healthy"'

# Test 2: Server environment
run_test "Server environment configured" \
    "curl -s http://localhost:3001/api/health | grep -o '\"environment\":\"[^\"]*\"'" \
    '"environment":"production"'

# Test 3: Database connection
run_test "Database connected" \
    "curl -s http://localhost:3001/api/health | grep -o '\"database\":\"[^\"]*\"'" \
    '"database":"connected"'

echo "============================================================"
echo "🧪 AUTHENTICATION SYSTEM VERIFICATION"
echo "============================================================"

# Test 1: User registration
run_test "User registration endpoint accessible" \
    "curl -s -X POST http://localhost:3001/api/auth/signup -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"testpass123\",\"firstName\":\"Test\",\"lastName\":\"User\"}'" \
    '"error":"User already exists"\|"id":[0-9]*'

# Test 2: User login
run_test "User login endpoint accessible" \
    "curl -s -X POST http://localhost:3001/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"wrongpass\"}'" \
    '"error":"Invalid credentials"'

# Test 3: Session debug
run_test "Session debug endpoint" \
    "curl -s http://localhost:3001/api/auth/session-debug" \
    '"sessionId"'

echo "============================================================"
echo "🧪 QUIZ SYSTEM VERIFICATION"
echo "============================================================"

# Test 1: Save quiz data (anonymous)
run_test "Anonymous quiz data saving" \
    "curl -s -X POST http://localhost:3001/api/save-quiz-data -H 'Content-Type: application/json' -d '{\"quizData\":{\"mainMotivation\":\"financial-freedom\",\"weeklyTimeCommitment\":20}}'" \
    '"success":true'

# Test 2: Save quiz data with email
run_test "Email-based quiz data saving" \
    "curl -s -X POST http://localhost:3001/api/save-quiz-data -H 'Content-Type: application/json' -d '{\"quizData\":{\"mainMotivation\":\"financial-freedom\"},\"email\":\"test-email@example.com\"}'" \
    '"success":true'

echo "============================================================"
echo "🧪 AI ANALYSIS SYSTEM VERIFICATION"
echo "============================================================"

# Test 1: AI business fit analysis
run_test "AI business fit analysis" \
    "curl -s -X POST http://localhost:3001/api/ai-business-fit-analysis -H 'Content-Type: application/json' -d '{\"quizData\":{\"mainMotivation\":\"financial-freedom\",\"weeklyTimeCommitment\":20}}'" \
    '"businessPaths"'

# Test 2: Income projections
run_test "Income projections generation" \
    "curl -s -X POST http://localhost:3001/api/generate-income-projections -H 'Content-Type: application/json' -d '{\"businessId\":\"freelancing\"}'" \
    '"monthlyProjections"'

echo "============================================================"
echo "🧪 PAYMENT SYSTEM VERIFICATION"
echo "============================================================"

# Test 1: Stripe configuration
run_test "Stripe configuration endpoint" \
    "curl -s http://localhost:3001/api/stripe-config" \
    '"publishableKey"'

# Test 2: User pricing
run_test "User pricing endpoint" \
    "curl -s http://localhost:3001/api/user-pricing/1" \
    '"error":"User not found"\|"success":true'

# Test 3: Payment status
run_test "Payment status endpoint" \
    "curl -s http://localhost:3001/api/payment-status/999999" \
    '"error":"Payment not found"\|"status"'

echo "============================================================"
echo "🧪 PDF GENERATION SYSTEM VERIFICATION"
echo "============================================================"

# Test 1: PDF generation
run_test "PDF generation endpoint" \
    "curl -s -X POST http://localhost:3001/api/generate-pdf -H 'Content-Type: application/json' -d '{\"quizData\":{\"mainMotivation\":\"financial-freedom\"},\"userEmail\":\"test@example.com\"}'" \
    '%PDF'

# Test 2: PDF report page
run_test "PDF report page accessible" \
    "curl -s http://localhost:3001/pdf-report?data=test" \
    'No data provided\|<!DOCTYPE html'

echo "============================================================"
echo "🧪 EMAIL SYSTEM VERIFICATION"
echo "============================================================"

# Test 1: Contact form
run_test "Contact form endpoint" \
    "curl -s -X POST http://localhost:3001/api/contact -H 'Content-Type: application/json' -d '{\"name\":\"Test\",\"email\":\"test@example.com\",\"subject\":\"Test\",\"message\":\"Test\",\"category\":\"general\"}'" \
    '"success":true\|"message"'

# Test 2: Unsubscribe
run_test "Unsubscribe endpoint" \
    "curl -s -X POST http://localhost:3001/api/auth/unsubscribe -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\"}'" \
    '"success":true'

echo "============================================================"
echo "🧪 ADMIN SYSTEM VERIFICATION"
echo "============================================================"

# Test 1: Admin routes require authentication
run_test "Admin routes require authentication" \
    "curl -s http://localhost:3001/api/admin/payments" \
    '"error":"Unauthorized"\|"error":"Not authenticated"'

# Test 2: Admin routes require admin key
run_test "Admin routes require valid admin key" \
    "curl -s -H 'x-admin-key: test-key' http://localhost:3001/api/admin/payments" \
    '"error":"Unauthorized"'

echo "============================================================"
echo "🧪 FRONTEND SYSTEM VERIFICATION"
echo "============================================================"

# Test 1: Frontend server
run_test "Frontend server running" \
    "curl -s http://localhost:5173" \
    '<!doctype html\|<html'

echo "============================================================"
echo "🧪 ERROR HANDLING VERIFICATION"
echo "============================================================"

# Test 1: 404 handling
run_test "404 error handling" \
    "curl -s http://localhost:3001/api/nonexistent-endpoint" \
    '"error"\|<!DOCTYPE html'

# Test 2: Invalid JSON handling
run_test "Invalid JSON handling" \
    "curl -s -X POST http://localhost:3001/api/save-quiz-data -H 'Content-Type: application/json' -d 'invalid json'" \
    '"error"\|<!DOCTYPE html'

# Test 3: Missing required fields
run_test "Missing required fields handling" \
    "curl -s -X POST http://localhost:3001/api/save-quiz-data -H 'Content-Type: application/json' -d '{}'" \
    '"error"'

echo "============================================================"
echo "🧪 PERFORMANCE VERIFICATION"
echo "============================================================"

# Test 1: Health endpoint response time
start_time=$(date +%s%N)
curl -s http://localhost:3001/api/health > /dev/null
end_time=$(date +%s%N)
response_time=$(( (end_time - start_time) / 1000000 ))

if [ $response_time -lt 1000 ]; then
    echo -e "🧪 Testing: Health endpoint response time < 1s"
    echo -e "  ${GREEN}✅ PASS${NC} (${response_time}ms)"
    ((PASSED++))
else
    echo -e "🧪 Testing: Health endpoint response time < 1s"
    echo -e "  ${RED}❌ FAIL${NC} (${response_time}ms)"
    ((FAILED++))
fi
echo ""

# Test 2: Quiz save response time
start_time=$(date +%s%N)
curl -s -X POST http://localhost:3001/api/save-quiz-data -H 'Content-Type: application/json' -d '{"quizData":{"mainMotivation":"financial-freedom"}}' > /dev/null
end_time=$(date +%s%N)
response_time=$(( (end_time - start_time) / 1000000 ))

if [ $response_time -lt 2000 ]; then
    echo -e "🧪 Testing: Quiz save response time < 2s"
    echo -e "  ${GREEN}✅ PASS${NC} (${response_time}ms)"
    ((PASSED++))
else
    echo -e "🧪 Testing: Quiz save response time < 2s"
    echo -e "  ${RED}❌ FAIL${NC} (${response_time}ms)"
    ((FAILED++))
fi
echo ""

echo "============================================================"
echo "🧪 TEST RESULTS SUMMARY"
echo "============================================================"

echo ""
echo "📊 Test Results:"
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"

if [ $FAILED -eq 0 ]; then
    echo "📈 Success Rate: 100%"
    echo ""
    echo "🎯 Overall System Status: ${GREEN}PASSED${NC}"
    echo "🎉 All systems are working correctly!"
else
    total=$((PASSED + FAILED))
    success_rate=$((PASSED * 100 / total))
    echo "📈 Success Rate: ${success_rate}%"
    echo ""
    echo "🎯 Overall System Status: ${RED}FAILED${NC}"
    echo "⚠️  Some systems need attention. Please review the failures above."
fi

echo ""
echo "⏰ Completed at: $(date)" 