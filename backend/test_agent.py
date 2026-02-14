"""
Quick test script to verify agent.py fixes with full debug output
Run this to test the agent without starting the full server
"""

import json
from agent import lambda_handler

def test_campaign_generation():
    """Test the campaign generation with mock data."""
    print("\n" + "="*60)
    print("🧪 PRACHAR.AI AGENT TEST - FULL DEBUG MODE")
    print("="*60 + "\n")
    
    # Test event - matches what frontend sends
    test_event = {
        'body': json.dumps({
            'goal': 'Create a campaign for a Tech Club focusing on Hackathon Registration',
            'user_id': 'test_user_hackathon'
        })
    }
    
    print(f"📝 Test Goal: 'Create a campaign for a Tech Club focusing on Hackathon Registration'")
    print(f"👤 Test User: 'test_user_hackathon'")
    print(f"\n{'='*60}")
    print("🚀 Calling lambda_handler...")
    print(f"{'='*60}\n")
    
    try:
        # Call the handler
        response = lambda_handler(test_event, context=None)
        
        # Parse response
        status_code = response.get('statusCode')
        body = json.loads(response.get('body', '{}'))
        
        print(f"\n{'='*60}")
        print(f"📊 FINAL RESPONSE")
        print(f"{'='*60}")
        print(f"Status Code: {status_code}\n")
        
        if status_code == 200:
            print("✅ SUCCESS! Agent generated campaign successfully!\n")
            print(f"🎯 Campaign ID: {body.get('campaign_id')}")
            print(f"\n📋 Plan:")
            plan = body.get('plan', {})
            print(f"  - Hook: {plan.get('hook')}")
            print(f"  - Offer: {plan.get('offer')}")
            print(f"  - CTA: {plan.get('cta')}")
            
            captions = body.get('captions', [])
            print(f"\n✍️  Captions ({len(captions)} generated):")
            for i, caption in enumerate(captions, 1):
                print(f"  {i}. {caption}")
            
            print(f"\n🖼️  Image URL: {body.get('image_url')}")
            print(f"\n📅 Created: {body.get('created_at')}")
            print(f"📊 Status: {body.get('status')}")
            
            # Verify frontend compatibility
            print(f"\n{'='*60}")
            print("🔍 FRONTEND COMPATIBILITY CHECK")
            print(f"{'='*60}")
            required_keys = ['plan', 'captions', 'image_url']
            all_present = True
            for key in required_keys:
                if key in body:
                    print(f"  ✅ {key}: Present")
                else:
                    print(f"  ❌ {key}: MISSING")
                    all_present = False
            
            if all_present:
                print(f"\n🎉 All required keys present! Frontend will work correctly.")
            else:
                print(f"\n⚠️  Some keys missing. Frontend may have issues.")
            
            # Show full JSON for debugging
            print(f"\n{'='*60}")
            print("📦 FULL JSON RESPONSE")
            print(f"{'='*60}")
            print(json.dumps(body, indent=2))
            
        else:
            print(f"\n❌ FAILED with status {status_code}")
            print(f"Error: {body.get('error')}")
            print(f"Details: {body.get('details')}")
    
    except Exception as e:
        print(f"\n{'='*60}")
        print(f"❌ EXCEPTION OCCURRED")
        print(f"{'='*60}")
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_campaign_generation()
    print(f"\n{'='*60}")
    print("🏁 TEST COMPLETE")
    print(f"{'='*60}\n")
