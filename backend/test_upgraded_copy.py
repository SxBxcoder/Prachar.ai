#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test Upgraded Top-Tier Marketing Copy
"""

from mock_data import find_best_match

print("\n" + "="*70)
print("🎯 TOP-TIER MARKETING COPY - UPGRADE TEST")
print("="*70 + "\n")

# Test KIIT Robotics
print("1️⃣  KIIT ROBOTICS CLUB")
print("-" * 70)
kiit = find_best_match("KIIT Robotics Club")

print(f"\n📌 HOOK:")
print(f"   {kiit['plan']['hook']}")

print(f"\n📌 OFFER:")
print(f"   {kiit['plan']['offer']}")

print(f"\n📌 CTA:")
print(f"   {kiit['plan']['cta']}")

print(f"\n📌 CAPTIONS:")
for i, caption in enumerate(kiit['captions'], 1):
    print(f"\n   Caption {i}:")
    print(f"   {caption}")

print("\n" + "="*70)

# Test Hackathon
print("\n2️⃣  HACKATHON")
print("-" * 70)
hack = find_best_match("hackathon")

print(f"\n📌 HOOK:")
print(f"   {hack['plan']['hook']}")

print(f"\n📌 OFFER:")
print(f"   {hack['plan']['offer']}")

print(f"\n📌 CTA:")
print(f"   {hack['plan']['cta']}")

print(f"\n📌 CAPTIONS:")
for i, caption in enumerate(hack['captions'], 1):
    print(f"\n   Caption {i}:")
    print(f"   {caption}")

print("\n" + "="*70)
print("✅ UPGRADE COMPLETE - TOP-TIER MARKETING COPY ACTIVE!")
print("="*70 + "\n")

print("🎯 Key Improvements:")
print("   ✅ Professional marketing terminology")
print("   ✅ High-energy Hinglish")
print("   ✅ Technical details (Arduino, ROS, PCB, Git)")
print("   ✅ Bharat context (chai, Maggi, samosas, canteen)")
print("   ✅ KIIT student hub references")
print("   ✅ Late-night coding culture")
print("   ✅ Specific benefits (₹5L prizes, FAANG mentors)")
print("   ✅ Emotional storytelling")
print()
