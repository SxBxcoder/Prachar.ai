#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test Direct-to-Mock Bypass for Instant Demo Responses
"""

import json
import time

print("\n" + "="*60)
print("⚡ TESTING DIRECT-TO-MOCK BYPASS")
print("="*60 + "\n")

# Import after setting up
from agent import lambda_handler, BYPASS_AWS_FOR_DEMO

print(f"BYPASS_AWS_FOR_DEMO = {BYPASS_AWS_FOR_DEMO}")

if not BYPASS_AWS_FOR_DEMO:
    print("\n⚠️  WARNING: BYPASS_AWS_FOR_DEMO is False")
    print("   Set it to True in agent.py for instant responses\n")
else:
    print("✅ Bypass mode is ENABLED\n")

# Test event
event = {
    'goal': 'KIIT Robotics Club registration',
    'user_id': 'test_user_bypass'
}

print(f"Testing with goal: '{event['goal']}'")
print("="*60 + "\n")

# Measure response time
start_time = time.time()

response = lambda_handler(event, context=None)

end_time = time.time()
response_time = (end_time - start_time) * 1000  # Convert to milliseconds

print("\n" + "="*60)
print("📊 RESULTS")
print("="*60 + "\n")

status = response.get('statusCode')
body = json.loads(response.get('body', '{}'))

print(f"Status Code: {status}")
print(f"Response Time: {response_time:.2f}ms")

if response_time < 100:
    print(f"✅ INSTANT RESPONSE (<100ms)")
elif response_time < 1000:
    print(f"✅ FAST RESPONSE (<1s)")
else:
    print(f"⚠️  SLOW RESPONSE (>{response_time/1000:.1f}s)")

print(f"\nResponse contains:")
print(f"  - campaign_id: {body.get('campaign_id', 'MISSING')}")
print(f"  - plan.hook: {body.get('plan', {}).get('hook', 'MISSING')[:50]}...")
print(f"  - captions: {len(body.get('captions', []))} variations")
print(f"  - image_url: {body.get('image_url', 'MISSING')[:60]}...")

if status == 200 and response_time < 100:
    print("\n✅ DIRECT-TO-MOCK BYPASS WORKING PERFECTLY!")
    print("   Frontend will receive instant responses! ⚡\n")
else:
    print("\n⚠️  Check BYPASS_AWS_FOR_DEMO setting in agent.py\n")
