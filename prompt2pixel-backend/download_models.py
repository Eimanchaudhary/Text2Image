import os
from diffusers import StableDiffusionPipeline, StableDiffusionXLPipeline
import torch

def download_models():
    """Download Stable Diffusion models locally"""
    
    models_dir = "./models"
    os.makedirs(models_dir, exist_ok=True)
    
    print("Downloading Stable Diffusion models...")
    
   
    print("Downloading Stable Diffusion 1.5...")
    try:
        sd15_pipeline = StableDiffusionPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            use_safetensors=True,
            cache_dir=models_dir
        )
        print("✓ Stable Diffusion 1.5 downloaded successfully")
    except Exception as e:
        print(f"✗ Failed to download SD 1.5: {e}")
    
  
    print("Downloading Stable Diffusion XL...")
    try:
        sdxl_pipeline = StableDiffusionXLPipeline.from_pretrained(
            "stabilityai/stable-diffusion-xl-base-1.0",
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            use_safetensors=True,
            cache_dir=models_dir
        )
        print("✓ Stable Diffusion XL downloaded successfully")
    except Exception as e:
        print(f"✗ Failed to download SD XL: {e}")
    
    print("Model download completed!")

if __name__ == "__main__":
    download_models()