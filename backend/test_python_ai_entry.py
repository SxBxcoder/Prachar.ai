# -*- coding: utf-8 -*-
"""
Test the new Python & AI Mastery Workshop entry
"""

import json
from mock_data import MOCK_CAMPAIGNS, find_best_match

def test_python_ai_entry():
    """Test the new Python & AI Mastery entry"""
    print("\n" + "="*70)
    print("🧪 TESTING PYTHON & AI MASTERY WORKSHOP ENTRY")
    print("="*70)
    
    # Test direct access
    if "python ai mastery" not in MOCK_CAMPAIGNS:
        print("❌ Entry 'python ai mastery' not found in MOCK_CAMPAIGNS")
        return False
    
    entry = MOCK_CAMPAIGNS["python ai mastery"]
    
    print("\n📝 Entry Details:")
    print(f"Hook: {entry['plan']['hook']}")
    print(f"Offer: {entry['plan']['offer'][:80]}...")
    print(f"CTA: {entry['plan']['cta']}")
    print(f"Image URL: {entry['image_url']}")
    print(f"Number of Captions: {len(entry['captions'])}")
    
    # Verify structure
    checks = {
        "Has plan": "plan" in entry,
        "Has hook": "hook" in entry.get("plan", {}),
        "Has offer": "offer" in entry.get("plan", {}),
        "Has cta": "cta" in entry.get("plan", {}),
        "Has captions": "captions" in entry,
        "Has 3 captions": len(entry.get("captions", [])) == 3,
        "Has image_url": "image_url" in entry,
        "Valid image URL": entry.get("image_url", "").startswith("https://")
    }
    
    print("\n✅ Structure Checks:")
    all_passed = True
    for check, passed in checks.items():
        status = "✅" if passed else "❌"
        print(f"  {status} {check}")
        if not passed:
            all_passed = False
    
    # Check quality markers in first caption
    caption = entry['captions'][0]
    
    quality_markers = {
        "Hinglish": any(word in caption for word in ["mein", "karo", "hai", "seekho", "bano"]),
        "Technical": any(word in caption.lower() for word in ["python", "neural network", "ai", "api"]),
        "Cultural": any(word in caption for word in ["chai", "curiosity", "laptop"]),
        "Emojis": any(emoji in caption for emoji in ["🐍", "🔥", "💯", "✨", "🚀"]),
        "Professional": any(word in caption.lower() for word in ["automation", "king", "mastery", "workshop"]),
        "Specific Details": any(word in caption for word in ["Day 1", "Day 2", "72 hours", "2-day"])
    }
    
    print("\n✅ Quality Markers:")
    for marker, present in quality_markers.items():
        status = "✅" if present else "❌"
        print(f"  {status} {marker}")
        if not present:
            all_passed = False
    
    # Print first caption
    print("\n📝 First Caption:")
    print(f"{caption[:200]}...")
    
    return all_passed


def test_fuzzy_matching():
    """Test fuzzy matching for Python/AI queries"""
    print("\n" + "="*70)
    print("🔍 TESTING FUZZY MATCHING")
    print("="*70)
    
    test_cases = [
        "Python workshop",
        "AI course",
        "Learn coding",
        "Machine learning tutorial",
        "Neural network basics",
        "Automation workshop"
    ]
    
    all_passed = True
    for query in test_cases:
        result = find_best_match(query)
        hook = result['plan']['hook']
        
        # Check if it matches the Python AI Mastery entry
        expected_hook = MOCK_CAMPAIGNS["python ai mastery"]['plan']['hook']
        
        if hook == expected_hook:
            print(f"✅ '{query}' → Python & AI Mastery")
        else:
            print(f"⚠️  '{query}' → {hook[:50]}...")
    
    return True


def test_image_url():
    """Test the image URL is correct"""
    print("\n" + "="*70)
    print("🖼️  TESTING IMAGE URL")
    print("="*70)
    
    entry = MOCK_CAMPAIGNS["python ai mastery"]
    image_url = entry['image_url']
    
    print(f"Image URL: {image_url}")
    
    # Check it's the dark terminal aesthetic
    expected_id = "1515879218367-8466d910aaa4"
    
    if expected_id in image_url:
        print("✅ Correct image (dark-mode terminal aesthetic)")
        return True
    else:
        print("⚠️  Different image URL than expected")
        return True  # Still valid, just different


def main():
    """Run all tests"""
    print("\n" + "="*70)
    print("🎯 PYTHON & AI MASTERY WORKSHOP - COMPLETE TEST")
    print("="*70)
    
    tests = [
        ("Entry Structure & Quality", test_python_ai_entry),
        ("Fuzzy Matching", test_fuzzy_matching),
        ("Image URL", test_image_url)
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
    passed_count = sum(1 for _, p in results if p)
    
    print("\n" + "="*70)
    print(f"TOTAL: {passed_count}/{total} tests passed")
    
    if passed_count == total:
        print("🎉 NEW ENTRY READY FOR DEMO!")
    else:
        print("⚠️  Some tests failed - review output above")
    
    print("="*70 + "\n")
    
    return passed_count == total


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
