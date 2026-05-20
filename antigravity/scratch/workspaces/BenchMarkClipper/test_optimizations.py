#!/usr/bin/env python3
"""
Test script to validate BenchMarkClipper optimizations including:
1. Optimized transcript complexity thresholds
2. Enhanced caching with analytics
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.virality_scorer import (
    get_model_for_transcript,
    get_cache_hit_rate,
    MODELS
)

def test_complexity_thresholds():
    """Test optimized transcript complexity thresholds"""
    print("Testing complexity thresholds...")
    
    # Test lite model thresholds (increased from <10, <2000 to <15, <3000)
    lite_cases = [
        (5, 1000),   # Should use lite
        (10, 2500),  # Should use lite
        (14, 2999),  # Should use lite
    ]
    
    for segments, length in lite_cases:
        model = get_model_for_transcript(segments, length)
        assert model == MODELS["lite"], f"Expected lite for {segments} segments, {length} chars, got {model}"
        print(f"✓ Lite model for {segments} segments, {length} chars: {model}")
    
    # Test efficient model thresholds (increased from <30, <8000 to <40, <12000)
    efficient_cases = [
        (15, 3000),   # Should use efficient (just above lite threshold)
        (20, 5000),   # Should use efficient
        (39, 11999),  # Should use efficient
    ]
    
    for segments, length in efficient_cases:
        model = get_model_for_transcript(segments, length)
        assert model == MODELS["efficient"], f"Expected efficient for {segments} segments, {length} chars, got {model}"
        print(f"✓ Efficient model for {segments} segments, {length} chars: {model}")
    
    # Test standard model thresholds (increased from <60, <20000 to <80, <30000)
    standard_cases = [
        (40, 12000),  # Should use standard (just above efficient threshold)
        (60, 20000),  # Should use standard
        (79, 29999),  # Should use standard
    ]
    
    for segments, length in standard_cases:
        model = get_model_for_transcript(segments, length)
        assert model == MODELS["standard"], f"Expected standard for {segments} segments, {length} chars, got {model}"
        print(f"✓ Standard model for {segments} segments, {length} chars: {model}")
    
    # Test premium model thresholds (only for very complex)
    premium_cases = [
        (80, 30000),  # Should use premium (just above standard threshold)
        (100, 50000), # Should use premium
    ]
    
    for segments, length in premium_cases:
        model = get_model_for_transcript(segments, length)
        assert model == MODELS["premium"], f"Expected premium for {segments} segments, {length} chars, got {model}"
        print(f"✓ Premium model for {segments} segments, {length} chars: {model}")
    
    print("✓ Complexity threshold tests passed!")

def test_cost_savings():
    """Test that optimized thresholds provide cost savings"""
    print("\nTesting cost savings impact...")
    
    # Compare old vs new thresholds for common use cases
    
    # Case 1: 12 segments, 2500 chars (previously standard, now lite)
    old_model_standard = "gemini-2.5-flash"  # Would have been standard
    new_model_lite = get_model_for_transcript(12, 2500)
    assert new_model_lite == MODELS["lite"], f"Expected lite for cost savings, got {new_model_lite}"
    print(f"✓ Cost savings: 12 segments/2500 chars upgraded from standard to lite")
    
    # Case 2: 25 segments, 6000 chars (previously efficient, still efficient but higher threshold)
    model = get_model_for_transcript(25, 6000)
    assert model == MODELS["efficient"], f"Expected efficient, got {model}"
    print(f"✓ Efficient model maintained for 25 segments/6000 chars")
    
    # Case 3: 50 segments, 15000 chars (previously standard, still standard but higher threshold)
    model = get_model_for_transcript(50, 15000)
    assert model == MODELS["standard"], f"Expected standard, got {model}"
    print(f"✓ Standard model maintained for 50 segments/15000 chars")
    
    print("✓ Cost savings tests passed!")

def test_caching_analytics():
    """Test enhanced caching with analytics"""
    print("\nTesting caching analytics...")
    
    # Test cache hit rate calculation
    hit_rate = get_cache_hit_rate()
    assert isinstance(hit_rate, float), f"Expected float for hit rate, got {type(hit_rate)}"
    assert 0 <= hit_rate <= 100, f"Expected hit rate between 0-100, got {hit_rate}"
    print(f"✓ Cache hit rate calculation works: {hit_rate}%")
    
    print("✓ Caching analytics tests passed!")

def main():
    """Run all optimization validation tests"""
    print("=" * 60)
    print("BenchMarkClipper Optimization Validation Tests")
    print("=" * 60)
    
    try:
        test_complexity_thresholds()
        test_cost_savings()
        test_caching_analytics()
        
        print("\n" + "=" * 60)
        print("✓ ALL BENCHMARKCLIPPER OPTIMIZATION TESTS PASSED!")
        print("=" * 60)
        return 0
    except Exception as e:
        print(f"\n✗ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())