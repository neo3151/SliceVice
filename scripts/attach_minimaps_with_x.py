import os
import glob
from PIL import Image, ImageDraw

assets_dir = "/home/neo/SliceVice/web/public/assets"
map_path = os.path.join(assets_dir, "slice_vice_master_map.png")

print(f"Loading master map from {map_path}")
master_map_orig = Image.open(map_path).convert("RGBA")
minimap_orig = master_map_orig.resize((300, 300))

locations = {
    "asphalt_spire": (0.50, 0.20),
    "drowned_district": (0.80, 0.60),
    "neon_ziggurat": (0.60, 0.50),
    "bone_circuit": (0.25, 0.40),
    "ignition_crater": (0.20, 0.85),
    "velvet_abattoir": (0.50, 0.60),
    "atlantis_wavepool": (0.75, 0.30),
    "marine_stadium": (0.90, 0.50),
    "castle_arcade": (0.35, 0.30),
    "glass_shroud": (0.45, 0.70),
    "isotope_reactor": (0.90, 0.80),
    "severed_spine": (0.10, 0.90)
}

target_files = glob.glob(os.path.join(assets_dir, "atlas_*.png"))
for file in target_files:
    if file == map_path or file.endswith("atlas_map.png") or "map" in file:
        continue
    
    # Identify which location this is
    loc_key = None
    for key in locations:
        if key in file:
            loc_key = key
            break
            
    if not loc_key:
        print(f"Skipping {file}, no known location match.")
        continue
        
    x_pct, y_pct = locations[loc_key]
    
    # Create fresh minimap for this iteration
    minimap = minimap_orig.copy()
    draw = ImageDraw.Draw(minimap)
    
    # Draw red X at the location
    cx = int(minimap.width * x_pct)
    cy = int(minimap.height * y_pct)
    cross_size = 10
    draw.line((cx - cross_size, cy - cross_size, cx + cross_size, cy + cross_size), fill=(255, 0, 0, 255), width=4)
    draw.line((cx + cross_size, cy - cross_size, cx - cross_size, cy + cross_size), fill=(255, 0, 0, 255), width=4)
    
    # Add border
    border_size = 4
    bordered = Image.new("RGBA", (minimap.width + border_size*2, minimap.height + border_size*2), (0, 255, 255, 255))
    bordered.paste(minimap, (border_size, border_size))
    
    # Set opacity
    alpha = bordered.split()[3]
    alpha = alpha.point(lambda p: int(p * 0.85))
    bordered.putalpha(alpha)
    
    # Paste onto photo
    img = Image.open(file).convert("RGBA")
    x = img.width - bordered.width - 40
    y = 40
    img.paste(bordered, (x, y), bordered)
    
    img = img.convert("RGB")
    img.save(file)
    print(f"Processed {file} for location: {loc_key}")
