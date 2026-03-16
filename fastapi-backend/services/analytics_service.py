# services/analytics_service.py
import json
from typing import Dict, Any
from datetime import datetime

# Placeholder – replace with your real DB (PostHog, Supabase, Firebase, Amplitude, etc.)
# For demo, we return fake data. In production, query your analytics DB here.

def get_user_analytics(time_range: str = "30d") -> Dict[str, Any]:
    """Real implementation: query your analytics DB here"""
    return {
        "time_range": time_range,
        "dau": 1243,
        "mau": 8456,
        "avg_session_duration_minutes": 14.7,
        "retention_7d": 68,
        "retention_30d": 42,
        "top_features": ["chat", "jira_sync", "asana_import"],
        "generated_at": datetime.utcnow().isoformat()
    }


def analyze_feedback_insights(feedback_source: str, limit: int = 100) -> Dict[str, Any]:
    """Real implementation: fetch feedback from DB + run sentiment/theme analysis"""
    # In real code you would fetch from DB and optionally call OpenAI for deep insights
    return {
        "source": feedback_source,
        "analyzed_items": min(limit, 237),
        "overall_sentiment": "positive",
        "top_themes": [
            {"theme": "Easy Jira integration", "mentions": 89, "sentiment": "positive"},
            {"theme": "Slow Asana sync", "mentions": 54, "sentiment": "negative"},
            {"theme": "Great heatmap feature", "mentions": 31, "sentiment": "positive"},
        ],
        "recommendations": [
            "Fix Asana sync latency",
            "Add more export formats",
            "Improve mobile experience"
        ],
        "generated_at": datetime.utcnow().isoformat()
    }


def get_user_heatmap(page: str, time_range: str = "30d") -> Dict[str, Any]:
    """Real implementation: query click/scroll tracking DB (e.g. PostHog or custom)"""
    # Example data format that frontend can render with <canvas> or Chart.js / heatmap.js
    return {
        "page": page,
        "time_range": time_range,
        "total_clicks": 12487,
        "data": [  # list of {x, y, intensity} where x/y = 0.0–1.0 (normalized)
            {"x": 0.23, "y": 0.45, "intensity": 87},
            {"x": 0.67, "y": 0.12, "intensity": 124},
            {"x": 0.41, "y": 0.78, "intensity": 56},
            # ... hundreds more points
        ],
        "hot_zones": [
            {"area": "top navigation", "intensity": "high"},
            {"area": "settings button", "intensity": "medium"}
        ],
        "generated_at": datetime.utcnow().isoformat()
    }