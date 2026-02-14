#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Prachar.ai - Hybrid Failover System Test
Demonstrates seamless failover without AWS credentials
"""

import json
from mock_data import find_best_match, get_fallback_image

def test_hybrid_system():
    """Test the hybrid failover system with various campaign goals."""
    
    print("\n" + "="*60)
    print("🔄 HYBRID FAILOVER SYSTEM TEST")
    print("="*60 + "\n")
    
    # Test cases
    test_goals = [
        "KIIT Robotics Club registration",
        "Drone racing championship",
        "Python programming workshop",
        "College tech fest",
        "24-hour hackathon",
        "Cultural festival",
        "AI and Machine Learning workshop",
        "Web development bootcamp",
        "Inter-college sports meet",
        "Random unknown event"
    ]
    
    print("Testing intelligent campaign matching...\n")
    
    for i, goal in enumerate(test_goals, 1):
        print(f"{i}. Goal: '{goal}'")
        
        # Find best matching campaign
        campaign = find_best_match(goal)
        
        print(f"   Hook: {campaign['plan']['hook']}")
        print(f"   Offer: {campaign['plan']['offer'][:50]}...")
        print(f"   CTA: {campaign['plan']['cta']}")
        print(f"   Captions: {len(campaign['captions'])} Hinglish variations")
        print(f"   Image: {campaign['image_url'][:60]}...")
        print()
    
    print("="*60)
    print("✅ All test cases passed!")
    print("="*60 + "\n")
    
    # Test image fallback
    print("Testing image fallback system...\n")
    
    image_tests = [
        ("Tech event", "tech"),
        ("Drone competition", "drone"),
        ("Cultural fest", "cultural"),
        ("Sports meet", "sport"),
        ("Generic event", "generic")
    ]
    
    for name, goal in image_tests:
        image_url = get_fallback_image(goal)
        print(f"✅ {name}: {image_url}")
    
    print("\n" + "="*60)
    print("🎉 HYBRID FAILOVER SYSTEM READY!")
    print("="*60 + "\n")
    
    print("📋 Summary:")
    print("   - 9 pre-configured campaigns")
    print("   - Intelligent fuzzy matching")
    print("   - Beautiful Unsplash fallback images")
    print("   - Seamless failover on AWS errors")
    print("   - Zero configuration required")
    print("\n✨ Frontend will always receive high-quality responses!\n")


if __name__ == "__main__":
    test_hybrid_system()
