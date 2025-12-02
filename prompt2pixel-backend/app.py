from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import logging
from models.image_generator import LocalImageGenerator


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app) 


try:
    image_generator = LocalImageGenerator(model_type="sd15", device="auto")
    logger.info("Image generator initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize image generator: {e}")
    image_generator = None

@app.route('/api/v1/generate', methods=['POST'])
def generate_image():
    """Generate image from text prompt"""
    if not image_generator:
        return jsonify({
            "success": False,
            "error": "Image generator not available"
        }), 500
    
    try:
        data = request.get_json()
        
        if not data or 'prompt' not in data:
            return jsonify({
                "success": False,
                "error": "Prompt is required"
            }), 400
        
        prompt = data['prompt']
        
       
        if len(prompt) > 1000:
            return jsonify({
                "success": False,
                "error": "Prompt too long (max 1000 characters)"
            }), 400
        
       
        parameters = {
            'steps': data.get('steps', 20),
            'guidance': data.get('guidance', 7.5),
            'width': data.get('width', 512),
            'height': data.get('height', 512),
            'seed': data.get('seed', -1)
        }
        
      
        result = image_generator.generate_image(prompt, **parameters)
        
        if result['success']:
            logger.info(f"Image generated successfully: {result['filename']}")
            return jsonify(result)
        else:
            return jsonify({
                "success": False,
                "error": result.get('error', 'Unknown error')
            }), 500
            
    except Exception as e:
        logger.error(f"Generation endpoint error: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500

@app.route('/api/v1/models', methods=['GET'])
def get_models():
    """Get available models"""
    if not image_generator:
        return jsonify({"models": []})
    
    return jsonify({
        "models": image_generator.get_available_models(),
        "current_model": image_generator.model_type
    })

@app.route('/api/v1/models/<model_type>', methods=['POST'])
def switch_model(model_type):
    """Switch to different model"""
    if not image_generator:
        return jsonify({
            "success": False,
            "error": "Image generator not available"
        }), 500
    
    try:
        image_generator.switch_model(model_type)
        return jsonify({
            "success": True,
            "message": f"Switched to {model_type}",
            "current_model": model_type
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/generated_images/<filename>')
def serve_generated_image(filename):
    """Serve generated images"""
    return send_from_directory('generated_images', filename)

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    status = "healthy" if image_generator else "unhealthy"
    return jsonify({
        "status": status,
        "device": image_generator.device if image_generator else "unknown",
        "model": image_generator.model_type if image_generator else "unknown"
    })

@app.route('/')
def home():
    return jsonify({
        "message": "Local Image Generator API",
        "version": "1.0.0",
        "endpoints": {
            "generate": "POST /api/v1/generate",
            "models": "GET /api/v1/models",
            "health": "GET /api/v1/health"
        }
    })

if __name__ == '__main__':
 
    os.makedirs('generated_images', exist_ok=True)
    
   
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True
    )