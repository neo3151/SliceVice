from dotenv import load_dotenv
import os
import requests
import json
import base64
import re
import argparse
from datetime import datetime
import uuid


def _find_base64_image(value):
    """
    Recursively search for likely base64 image fields in API response payloads.
    Handles variations like:
      - bytesBase64Encoded
      - image
      - imageBytes
      - b64
    """
    if isinstance(value, dict):
        for k in ("bytesBase64Encoded", "image", "imageBytes", "b64"):
            v = value.get(k)
            if isinstance(v, str) and v.strip():
                return v.strip()
        for v in value.values():
            found = _find_base64_image(v)
            if found:
                return found
    elif isinstance(value, list):
        for item in value:
            found = _find_base64_image(item)
            if found:
                return found
    return None


load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

# Using Imagen 4 via Google Generative AI REST API
model_id = "imagen-4.0-generate-001"
url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:predict"

headers = {
    "Content-Type": "application/json",
}

DEFAULT_PROMPT = "A futuristic city at sunset with neon lights"

parser = argparse.ArgumentParser(description="Generate an image using Imagen 4.")
parser.add_argument(
    "--prompt",
    default=os.getenv("IMAGE_PROMPT", DEFAULT_PROMPT),
    help="Prompt text to generate the image.",
)
parser.add_argument(
    "--vary",
    action="store_true",
    help="Append a random variation token to encourage distinct outputs.",
)
args = parser.parse_args()

effective_prompt = args.prompt.strip() if args.prompt else DEFAULT_PROMPT
if args.vary:
    effective_prompt = f"{effective_prompt} [variation:{uuid.uuid4().hex[:8]}]"

payload = {
    "instances": [
        {
            "prompt": effective_prompt
        }
    ]
}

params = {"key": api_key}

# Preferred output location (user selected):
# docs/assets/generated-images
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "docs", "assets", "generated-images")

# Semantic-first naming (user selected):
# slicevice_reya_portrait_YYYYMMDD-HHMMSS_a1b2c3.png
PROJECT_NAME = "slicevice"
SUBJECT_NAME = "futuristic-city"
STYLE_NAME = "neon-sunset"


def _slugify(value):
    value = (value or "").strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-{2,}", "-", value).strip("-")
    return value or "untitled"


timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
short_id = uuid.uuid4().hex[:6]

filename = (
    f"{_slugify(PROJECT_NAME)}_"
    f"{_slugify(SUBJECT_NAME)}_"
    f"{_slugify(STYLE_NAME)}_"
    f"{timestamp}_{short_id}.png"
)

os.makedirs(OUTPUT_DIR, exist_ok=True)
output_path = os.path.join(OUTPUT_DIR, filename)

if not api_key:
    raise RuntimeError("GOOGLE_API_KEY is not set. Check your .env file.")

print("Generating image with Imagen 4...")
print("Prompt:", effective_prompt)
response = requests.post(url, headers=headers, json=payload, params=params, timeout=120)
print("Status code:", response.status_code)

try:
    response_json = response.json()
except ValueError:
    raise RuntimeError(f"Non-JSON response from API: {response.text[:500]}")

print("Response:", json.dumps(response_json, indent=2))

if response.status_code != 200:
    raise RuntimeError(
        f"Image generation failed with status {response.status_code}: "
        f"{json.dumps(response_json, indent=2)}"
    )

image_b64 = _find_base64_image(response_json)
if not image_b64:
    raise RuntimeError(
        "No image bytes found in API response. Expected base64 image content under known keys."
    )

try:
    image_data = base64.b64decode(image_b64, validate=False)
except Exception as e:
    raise RuntimeError(f"Failed to decode base64 image data: {e}")

if not image_data:
    raise RuntimeError("Decoded image data is empty.")

with open(output_path, "wb") as f:
    f.write(image_data)

print(f"✓ Image saved as {output_path} ({len(image_data)} bytes)")
