#!/bin/bash
echo "Testing API endpoints..."

echo -e "\n1. Testing health endpoint:"
curl -s http://localhost:3000/api/health || echo "❌ Backend not running on port 3000"

echo -e "\n\n2. Testing session creation:"
curl -s -X POST http://localhost:3000/api/modules/session \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}' || echo "❌ Failed to create session"

echo -e "\n\n3. Checking frontend:"
curl -s -I http://localhost:3001 | head -1 || echo "❌ Frontend not running on port 3001"

echo -e "\n\nDone!"

