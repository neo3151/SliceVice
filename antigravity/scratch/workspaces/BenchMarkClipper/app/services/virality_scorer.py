import json
from pathlib import Path
from datetime import datetime
from google import genai
from google.genai import types
from app.core.config import settings

# Usage tracking for BenchMarkClipper project
PROJECT_NAME = "BenchMarkClipper"
BASE_DIR = Path(__file__).parent.parent.parent
usage_log_file = BASE_DIR / "api_usage_log.json"

# Model selection strategy for video analysis
MODELS = {
    "premium": "gemini-2.5-pro",      # Highest quality for complex video analysis
    "standard": "gemini-2.5-flash",   # Balanced quality/cost (current default)
    "efficient": "gemini-2.0-flash",  # Cost-effective for standard analysis
    "lite": "gemini-1.5-flash"        # Maximum savings for simple transcripts
}

# Response caching configuration
cache_dir = BASE_DIR / ".virality_cache"
cache_dir.mkdir(exist_ok=True)

def get_model_for_transcript(segment_count: int, transcript_length: int) -> str:
    """Select appropriate model based on transcript complexity (optimized for cost savings)"""
    # Simple/short transcripts can use cheapest models (thresholds increased for optimization)
    if segment_count < 15 and transcript_length < 3000:
        return MODELS["lite"]
    # Medium complexity use efficient model (thresholds increased for optimization)
    elif segment_count < 40 and transcript_length < 12000:
        return MODELS["efficient"]
    # Complex/long transcripts need standard model (thresholds increased for optimization)
    elif segment_count < 80 and transcript_length < 30000:
        return MODELS["standard"]
    # Very complex analysis needs premium model (only for extremely long/complex transcripts)
    return MODELS["premium"]

# Cache analytics tracking
cache_stats_file = BASE_DIR / ".virality_cache_stats.json"
cache_stats = {
    "hits": 0,
    "misses": 0,
    "total_requests": 0
}

def load_cache_stats():
    """Load cache statistics from file"""
    global cache_stats
    if cache_stats_file.exists():
        try:
            with open(cache_stats_file, 'r') as f:
                cache_stats = json.load(f)
        except:
            pass

def save_cache_stats():
    """Save cache statistics to file"""
    try:
        with open(cache_stats_file, 'w') as f:
            json.dump(cache_stats, f, indent=2)
    except:
        pass

def get_cache_hit_rate() -> float:
    """Calculate current cache hit rate"""
    if cache_stats["total_requests"] == 0:
        return 0.0
    return (cache_stats["hits"] / cache_stats["total_requests"]) * 100

load_cache_stats()

def get_cache_key(transcript_text: str) -> str:
    """Generate cache key for transcript"""
    import hashlib
    return hashlib.md5(transcript_text.encode()).hexdigest()

def get_cached_analysis(cache_key: str) -> list | None:
    """Retrieve cached virality analysis if available"""
    cache_file = cache_dir / f"{cache_key}.json"
    if cache_file.exists():
        try:
            cache_stats["hits"] += 1
            cache_stats["total_requests"] += 1
            save_cache_stats()
            return json.loads(cache_file.read_text())
        except:
            return None
    cache_stats["misses"] += 1
    cache_stats["total_requests"] += 1
    save_cache_stats()
    return None

def cache_analysis(cache_key: str, clips: list):
    """Cache virality analysis results"""
    cache_file = cache_dir / f"{cache_key}.json"
    try:
        cache_file.write_text(json.dumps(clips))
    except:
        pass  # Cache failures shouldn't break the system

def log_api_usage(model_name, operation, prompt_length, success, error=None, metadata=None):
    """Log API usage for cost tracking with project identification"""
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "project": PROJECT_NAME,
        "script": "virality_scorer.py",
        "operation": operation,
        "model": model_name,
        "prompt_length": prompt_length,
        "success": success,
        "error": str(error) if error else None,
        "metadata": metadata or {}
    }
    
    # Load existing log
    if usage_log_file.exists():
        try:
            with open(usage_log_file, 'r') as f:
                usage_data = json.load(f)
        except:
            usage_data = []
    else:
        usage_data = []
    
    usage_data.append(log_entry)
    
    # Save updated log
    with open(usage_log_file, 'w') as f:
        json.dump(usage_data, f, indent=2)

def score_virality(transcript_segments: list) -> list:
    """
    Takes a list of transcript segments and uses Gemini 2.5 API to identify the best
    moments for short-form clips. If no API key is set, returns a mock clip for testing.
    """
    if not settings.GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY not set. Using mocked clip data for testing pipeline...")
        # Return a mock 15-second clip based on the first transcript segment or arbitrary time
        if transcript_segments and len(transcript_segments) > 0:
            end_t = min(transcript_segments[0]['start'] + 15.0, transcript_segments[-1]['end'])
            return [{
                "start_time": transcript_segments[0]['start'],
                "end_time": end_t,
                "title": "Mocked Viral Clip",
                "reason": "Testing pipeline without API key.",
                "score": 99
            }]
        # Fallback to absolute timestamps if no segments
        return [{
            "start_time": 0.0,
            "end_time": 15.0,
            "title": "Mocked Viral Clip (Fallback)",
            "reason": "No segments found. Mocking first 15s.",
            "score": 99
        }]
    
    # Initialize the new Google GenAI client
    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    # Format the transcript into a readable block with timestamps
    transcript_text = "\n".join(
        f"[{seg['start']:.2f} - {seg['end']:.2f}]: {seg['text']}" 
        for seg in transcript_segments
    )
    
    prompt = f"""
    You are an elite AI growth hacker specializing in TikTok, YouTube Shorts, and Instagram Reels (faceless content).
    Your goal is to extract the absolute best 8-15 short-form clip ideas from the following video transcript.
    
    CRITERIA FOR VIRALITY:
    - Humor & Sarcasm: Look for witty remarks, dry humor, or unexpected comedic timing.
    - Meme Potential & Edgy Commentary: Identify controversial, polarizing, or highly shareable takes (similar to Nick Fuentes or Hasanabi reaction clips).
    - Emotional Peaks: Look for surprise, anger, or high-energy moments.
    - Hook Strength: The first 3 seconds must grab attention immediately.
    - Length: Each clip should be between 15 and 60 seconds long.
    
    OUTPUT FORMAT:
    Respond ONLY in valid JSON format as a list of objects, structured like:
    [
        {{
            "start_time": 10.5,
            "end_time": 45.2,
            "title": "A highly clickable, clickbait-style title",
            "reason": "Why this clip works (e.g., strong sarcasm, meme potential)",
            "score": 95
        }}
    ]
    
    Do NOT wrap the response in markdown code blocks, just return raw JSON text.
    
    TRANSCRIPT:
    {transcript_text}
    """
    
    metadata = {
        "segment_count": len(transcript_segments),
        "transcript_length": len(transcript_text)
    }
    
    # Select appropriate model based on transcript complexity
    model = get_model_for_transcript(len(transcript_segments), len(transcript_text))
    metadata["selected_model"] = model
    
    # Check cache first
    cache_key = get_cache_key(transcript_text)
    cached_clips = get_cached_analysis(cache_key)
    if cached_clips:
        print(f"[CACHE] Using cached virality analysis for {len(transcript_segments)} segments")
        log_api_usage(model, 'virality_scoring', len(prompt), True, metadata={**metadata, "cached": True})
        return cached_clips
    
    try:
        log_api_usage(model, 'virality_scoring', len(prompt), False, metadata=metadata)
        
        response = client.models.generate_content(
            model=model,
            contents=prompt,
        )
        
        # Clean up the output in case Gemini returns markdown JSON blocks
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        clips = json.loads(response_text)
        
        # Cache the results
        cache_analysis(cache_key, clips)
        
        log_api_usage(model, 'virality_scoring', len(prompt), True, metadata=metadata)
        return clips
        
    except Exception as e:
        log_api_usage(model, 'virality_scoring', len(prompt), False, str(e), metadata)
        raise Exception(f"Failed to score virality: {str(e)}")
