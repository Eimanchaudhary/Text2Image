#!/usr/bin/env python3
"""
Alternative entry point that ensures proper imports
"""

import sys
import os

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('generated_images', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    
    print("Starting Local Image Generator API...")
    print("Available endpoints:")
    print("  POST /api/v1/generate - Generate image from prompt")
    print("  GET  /api/v1/models - Get available models")
    print("  GET  /api/v1/health - Health check")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True
    )