#!/bin/bash

echo "🧪 Testing Email System (/api/send-email)"
echo "====================================="

# Test data
TO_EMAIL="test@example.com"
SUBJECT="Test Email from Automated Script"
HTML_CONTENT="<p>This is a test email sent from the automated test script.</p>"

REQUEST_BODY="{\"to\": \"$TO_EMAIL\", \"subject\": \"$SUBJECT\", \"html\": \"$HTML_CONTENT\"}"

for i in 1 2 3; do
  echo ""
  echo "📧 Test $i: Sending email..."
  RESPONSE=$(curl -s -X POST http://localhost:9000/api/send-email \
    -H "Content-Type: application/json" \
    -d "$REQUEST_BODY" \
    -w "\nHTTP_CODE:%{http_code}")

  HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d':' -f2)
  RESPONSE_BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

  echo "Status: $HTTP_CODE"
  echo "Response: $RESPONSE_BODY"

  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Email sent successfully"
  elif [ "$HTTP_CODE" = "429" ]; then
    echo "✅ Rate limit working - email blocked"
  else
    echo "❌ Unexpected response"
  fi

done

echo ""
echo "✅ Email system test completed!" 