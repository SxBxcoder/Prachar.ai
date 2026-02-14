# -*- coding: utf-8 -*-
"""
Complete System Verification Test
Tests all components: bypass mode, mock data quality, frontend compatibility
"""

import json
import time
from agent import lambda_handler, BYPASS_AWS_FOR_DEMO
from mock_data import MOCK_CAMPAIGNS, find_best_match

def test_bypass_mode():
    """Test direct-to-mock bypass"""
    print("\n" + "="*60)
    print("TEST 1: DIRECT-TO-MOCK BYPASS")
    print("="*60)
    
    if not BYPASS_AWS_FOR_DEMO:
        print("❌ BYPASS_AWS_FOR_DEMO is False - should be True for demo")
        return False
    
    print("✅ Bypass mode enabled")
    
    # Test with KIIT Robotics
    event = {
        'goal': 'KIIT Robotics Club registration',
        'user_id': 'test_user'
    }
    
    start = time.time()
    response = lambda_handler(event, None)
    elapsed = (time.time() - start) * 1000  # Convert to ms
    
    print(f"Response time: {elapsed:.2f}ms")
    
    if response['statusCode'] != 200:
        print(f"❌ Expected 200, got {response['statusCode']}")
        return False
    
    body = json.loads(response['body'])
    
    # Verify all required keys
    required_keys = ['campaign_id', 'plan', 'captions', 'image_url']
    for key in required_keys:
        if key not in body:
            print(f"❌ Missing key: {key}")
            return False
    
    print(f"✅ All required keys present")
    print(f"✅ Response time: {elapsed:.2f}ms (target: <100ms)")
    
    if elapsed > 100:
        print(f"⚠️  Warning: Response time exceeds 100ms target")
    
    return True


def test_mock_data_quality():
    """Test upgraded mock data quality"""
    print("\n" + "="*60)
    print("TEST 2: MOCK DATA QUALITY")
    print("="*60)
    
    # Test KIIT Robotics
    kiit = MOCK_CAMPAIGNS['kiit robotics']
    
    print("\n📝 KIIT Robotics Entry:")
    print(f"Hook: {kiit['plan']['hook'][:60]}...")
    print(f"Captions: {len(kiit['captions'])} variations")
    
    # Check for quality markers
    caption = kiit['captions'][0]
    quality_markers = {
        'Hinglish': any(word in caption for word in ['mein', 'aao', 'karo', 'hai']),
        'Technical': any(word in caption for word in ['Arduino', 'ROS', 'PCB', 'sensor']),
        'Cultural': any(word in caption for word in ['chai', 'Maggi', 'canteen', 'late-night']),
        'Emojis': any(emoji in caption for emoji in ['🤖', '🔥', '💯', '✨']),
        'KIIT': 'KIIT' in caption
    }
    
    print("\n✅ Quality Markers:")
    for marker, present in quality_markers.items():
        status = "✅" if present else "❌"
        print(f"  {status} {marker}")
    
    # Test Hackathon
    hackathon = MOCK_CAMPAIGNS['hackathon']
    
    print("\n📝 Hackathon Entry:")
    print(f"Hook: {hackathon['plan']['hook'][:60]}...")
    print(f"Offer: {hackathon['plan']['offer'][:60]}...")
    
    caption = hackathon['captions'][0]
    quality_markers = {
        'Professional': any(word in caption for word in ['MVP', 'deploy', 'launchpad']),
        'FAANG': any(word in caption for word in ['Google', 'Microsoft', 'Amazon']),
        'Prize': '₹5 lakh' in caption or '5L' in caption,
        'Cultural': any(word in caption for word in ['pizza', 'Maggi', 'chai']),
        'Technical': any(word.lower() in caption.lower() for word in ['Git', 'code', 'debug', 'MVP', 'deploy'])
    }
    
    print("\n✅ Quality Markers:")
    for marker, present in quality_markers.items():
        status = "✅" if present else "❌"
        print(f"  {status} {marker}")
    
    return all(quality_markers.values())


def test_fuzzy_matching():
    """Test intelligent fuzzy matching"""
    print("\n" + "="*60)
    print("TEST 3: FUZZY MATCHING")
    print("="*60)
    
    test_cases = [
        ("robot club", "kiit robotics"),
        ("hackathon event", "hackathon"),
        ("python course", "python ai mastery"),  # Updated to new hero entry
        ("AI learning", "python ai mastery"),    # Updated to new hero entry
        ("college fest", "tech fest"),
        ("random goal", "generic")
    ]
    
    all_passed = True
    for goal, expected_key in test_cases:
        result = find_best_match(goal)
        # Check if result matches expected campaign
        if expected_key in ['kiit robotics', 'hackathon', 'python ai mastery', 'tech fest']:
            expected_hook = MOCK_CAMPAIGNS[expected_key]['plan']['hook']
            if result['plan']['hook'] == expected_hook:
                print(f"✅ '{goal}' → {expected_key}")
            else:
                print(f"❌ '{goal}' → unexpected match")
                all_passed = False
        else:
            # Generic fallback
            if result['plan']['hook'] == MOCK_CAMPAIGNS['generic']['plan']['hook']:
                print(f"✅ '{goal}' → generic (fallback)")
            else:
                print(f"❌ '{goal}' → unexpected match")
                all_passed = False
    
    return all_passed


def test_frontend_compatibility():
    """Test frontend data structure compatibility"""
    print("\n" + "="*60)
    print("TEST 4: FRONTEND COMPATIBILITY")
    print("="*60)
    
    event = {
        'goal': 'Test campaign',
        'user_id': 'test_user'
    }
    
    response = lambda_handler(event, None)
    body = json.loads(response['body'])
    
    # Check structure matches frontend expectations
    checks = {
        'Status 200': response['statusCode'] == 200,
        'Has campaign_id': 'campaign_id' in body,
        'Has plan object': 'plan' in body and isinstance(body['plan'], dict),
        'Plan has hook': 'hook' in body.get('plan', {}),
        'Plan has offer': 'offer' in body.get('plan', {}),
        'Plan has cta': 'cta' in body.get('plan', {}),
        'Has captions array': 'captions' in body and isinstance(body['captions'], list),
        '3 captions': len(body.get('captions', [])) == 3,
        'Has image_url': 'image_url' in body,
        'Valid image URL': body.get('image_url', '').startswith('https://')
    }
    
    all_passed = True
    for check, passed in checks.items():
        status = "✅" if passed else "❌"
        print(f"{status} {check}")
        if not passed:
            all_passed = False
    
    return all_passed


def main():
    """Run all tests"""
    print("\n" + "="*70)
    print("🧪 PRACHAR.AI COMPLETE SYSTEM VERIFICATION")
    print("="*70)
    
    tests = [
        ("Direct-to-Mock Bypass", test_bypass_mode),
        ("Mock Data Quality", test_mock_data_quality),
        ("Fuzzy Matching", test_fuzzy_matching),
        ("Frontend Compatibility", test_frontend_compatibility)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            passed = test_func()
            results.append((name, passed))
        except Exception as e:
            print(f"\n❌ Test '{name}' failed with error: {e}")
            import traceback
            traceback.print_exc()
            results.append((name, False))
    
    # Summary
    print("\n" + "="*70)
    print("📊 TEST SUMMARY")
    print("="*70)
    
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {name}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    
    print("\n" + "="*70)
    print(f"TOTAL: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED - SYSTEM READY FOR DEMO!")
    else:
        print("⚠️  Some tests failed - review output above")
    
    print("="*70 + "\n")
    
    return passed == total


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
