import os
import glob
from PIL import Image

assets_dir = "/home/neo/SliceVice/web/public/assets"
map_path = os.path.join(assets_dir, "slice_vice_master_map.png")

print(f"Loading master map from {map_path}")
master_map = Image.open(map_path).convert("RGBA")

# Resize master map to act as minimap
minimap = master_map.resize((300, 300))

# Create a cyan border around it
border_size = 4
bordered_minimap = Image.new("RGBA", (minimap.width + border_size*2, minimap.height + border_size*2), (0, 255, 255, 255))
bordered_minimap.paste(minimap, (border_size, border_size))

# Opacity
alpha = bordered_minimap.split()[3]
alpha = alpha.point(lambda p: int(p * 0.85))
bordered_minimap.putalpha(alpha)

# Find the 12 generated images
target_files = glob.glob(os.path.join(assets_dir, "atlas_*.png"))
for file in target_files:
    if file == map_path or file.endswith("atlas_map.png") or "map" in file:
        continue
    
    img = Image.open(file).convert("RGBA")
    
    # paste minimap into top right so it doesn't block the date stamp
    x = img.width - bordered_minimap.width - 40
    y = 40
    
    # Paste using alpha channel
    img.paste(bordered_minimap, (x, y), bordered_minimap)
    
    # Convert back to RGB to save as PNG properly
    img = img.convert("RGB")
    img.save(file)
    print(f"Processed {file}")
