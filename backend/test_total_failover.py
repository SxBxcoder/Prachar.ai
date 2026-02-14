#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Prachar.ai - Total Failover Test
Tests that lambda_handler returns 200 even on errors
"""

import json
import sys
import os

# Temporarily break AWS credentials to force failover
original_key = os.environ.get('AWS_ACCESS_KEY_ID')
original_secret = os.environ.get('AWS_SECRET_ACCESS_KEY')

# Set invalid credentials to force error
os.environ['AWS_ACCESS_KEY_ID'] = 'INVALID_KEY'
os.environ['AWS_SECRET_ACCESS_KEY'] = 'INVALID_SECRET'

# Now import agent (will use invalid credentials)
from agent import lambda_handler

def test_total_failover():
    """Test that lambda_handler returns 200 with mock data on errors."""
    
    print("\n" + "="*60)
    print("🧪 TOTAL FAILOVER TEST")
    print("="*60 + "\n")
    
    print("📋 Test Setup:")
    print("   - Using INVALID AWS credentials")
    print("   - This will force an error in the agent")
    print("   - Testing that handler returns 200 with mock data\n")
    
    # Test event
    test_event = {
        'goal': 'KIIT Robotics Club registration',
        'user_id': 'test_user_failover'
    }
    
    print(f"🚀 Calling lambda_handler with goal: '{test_event['goal']}'")
    print(f"{'='*60}\n")
    
    # Call lambda handler (should fail but return 200)
    response = lambda_handler(test_event, context=None)
    
    print(f"\n{'='*60}")
    print("📊 RESPONSE ANALYSIS")
    print(f"{'='*60}\n")
    
    # Check status code
    status_code = response.get('statusCode')
    print(f"Status Code: {status_code}")
    
    if status_code == 200:
        print("✅ PASS: Status code is 200 (frontend won't hang)")
    else:
        print(f"❌ FAIL: Status code is {status_code} (frontend will hang)")
        return False
    
    # Parse body
    body = json.loads(response.get('body', '{}'))
    
    # Check required keys
    required_keys = ['campaign_id', 'user_id', 'goal', 'plan', 'captions', 'image_url', 'status']
    print(f"\n📋 Checking required keys:")
    
    all_present = True
    for key in required_keys:
        present = key in body
        status = "✅" if present else "❌"
        print(f"   {status} {key}: {'Present' if present else 'MISSING'}")
        if not present:
            all_present = False
    
    if not all_present:
        print("\n❌ FAIL: Missing required keys")
        return False
    
    # Verify plan structure
    print(f"\n📋 Plan Structure:")
    plan = body.get('plan', {})
    plan_keys = ['hook', 'offer', 'cta']
    for key in plan_keys:
        present = key in plan
        status = "✅" if present else "❌"
        value = plan.get(key, 'N/A')[:50] if present else 'MISSING'
        print(f"   {status} {key}: {value}...")
    
    # Verify captions
    captions = body.get('captions', [])
    print(f"\n📋 Captions:")
    print(f"   Count: {len(captions)}")
    if len(captions) >= 3:
        print(f"   ✅ Has 3+ captions")
        for i, caption in enumerate(captions[:3], 1):
            print(f"   {i}. {caption[:60]}...")
    else:
        print(f"   ❌ Only {len(captions)} captions (need 3)")
        all_present = False
    
    # Verify image URL
    image_url = body.get('image_url', '')
    print(f"\n📋 Image URL:")
    print(f"   {image_url[:80]}...")
    if image_url.startswith('https://'):
        print(f"   ✅ Valid HTTPS URL")
    else:
        print(f"   ❌ Invalid URL")
        all_present = False
    
    # Final verdict
    print(f"\n{'='*60}")
    if all_present and status_code == 200:
        print("✅ TOTAL FAILOVER TEST PASSED!")
        print("="*60 + "\n")
        print("🎉 Summary:")
        print("   - Lambda handler returned 200 status")
        print("   - All required keys present")
        print("   - Plan structure valid")
        print("   - 3 Hinglish captions included")
        print("   - Beautiful image URL provided")
        print("\n✨ Frontend will NEVER hang, even on AWS errors!\n")
        return True
    else:
        print("❌ TOTAL FAILOVER TEST FAILED!")
        print("="*60 + "\n")
        return False


if __name__ == "__main__":
    try:
        success = test_total_failover()
        
        # Restore original credentials
        if original_key:
            os.environ['AWS_ACCESS_KEY_ID'] = original_key
        if original_secret:
            os.environ['AWS_SECRET_ACCESS_KEY'] = original_secret
        
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Test crashed with error: {e}")
        import traceback
        traceback.print_exc()
        
        # Restore original credentials
        if original_key:
            os.environ['AWS_ACCESS_KEY_ID'] = original_key
        if original_secret:
            os.environ['AWS_SECRET_ACCESS_KEY'] = original_secret
        
        sys.exit(1)
