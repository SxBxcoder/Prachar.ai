#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simple test to verify total failover returns 200
"""

import json

# Force error by using invalid credentials
import os
os.environ['AWS_ACCESS_KEY_ID'] = 'INVALID_KEY_FOR_TEST'
os.environ['AWS_SECRET_ACCESS_KEY'] = 'INVALID_SECRET_FOR_TEST'

print("\n" + "="*60)
print("🧪 SIMPLE TOTAL FAILOVER TEST")
print("="*60 + "\n")

print("Setting up test with INVALID credentials...")
print("This will force the lambda_handler to use total failover.\n")

# Import after setting invalid credentials
from agent import lambda_handler

# Test event
event = {
    'goal': 'KIIT Robotics Club registration',
    'user_id': 'test_user'
}

print(f"Calling lambda_handler with goal: '{event['goal']}'")
print("Expected: 200 status with mock data\n")
print("="*60 + "\n")

# Call handler
response = lambda_handler(event, context=None)

print("\n" + "="*60)
print("📊 RESULTS")
print("="*60 + "\n")

status = response.get('statusCode')
body = json.loads(response.get('body', '{}'))

print(f"Status Code: {status}")

if status == 200:
    print("✅ SUCCESS: Returns 200 (frontend won't hang)\n")
    
    print("Response contains:")
    print(f"  - campaign_id: {body.get('campaign_id', 'MISSING')}")
    print(f"  - user_id: {body.get('user_id', 'MISSING')}")
    print(f"  - goal: {body.get('goal', 'MISSING')}")
    print(f"  - plan: {body.get('plan', {}).get('hook', 'MISSING')[:50]}...")
    print(f"  - captions: {len(body.get('captions', []))} variations")
    print(f"  - image_url: {body.get('image_url', 'MISSING')[:60]}...")
    print(f"  - status: {body.get('status', 'MISSING')}")
    
    print("\n✅ TOTAL FAILOVER WORKING!")
    print("Frontend will receive valid data even on AWS errors! 🎉\n")
else:
    print(f"❌ FAILED: Returns {status} (frontend will hang)\n")
    print(f"Body: {body}\n")
