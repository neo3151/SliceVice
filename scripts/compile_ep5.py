import os
import glob
from PIL import Image

assets_dir = "/home/neo/SliceVice/web/public/assets/EP5"
output_pdf = "/home/neo/SliceVice/web/public/SliceVice_EP5.pdf"

# Find the 14 generated images
target_files = sorted(glob.glob(os.path.join(assets_dir, "ep5_panel*.jpg")))
pages = []

for file in target_files:
    try:
        img = Image.open(file).convert("RGB")
        pages.append(img)
    except Exception as e:
        print(f"Failed to open {file}: {e}")

if pages:
    first_page = pages[0]
    first_page.save(output_pdf, save_all=True, append_images=pages[1:])
    print(f"Successfully saved {output_pdf}")
else:
    print("No images found to process.")
