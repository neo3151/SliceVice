import shutil
import os

# Define source artifacts from brain
brain_dir = "/home/neo/.gemini/antigravity/brain/e4783df4-30fa-415a-aaf9-143ae27e1d4e"
public_dir = "/home/neo/SliceVice/web/public/assets/EP6"

os.makedirs(public_dir, exist_ok=True)

# Map our generated artifacts to final panel names
# Note: I'll use the composite images for now as a single high-res asset if necessary, 
# but the best way is to have 14 individual files.
# Since I generated composites, I will move the composites to the folder for safe-keeping,
# and for the site, I will use the most high-res individual ones I generated.

# Individual generation artifacts (best quality)
mappings = {
    "ep6_grounded_panel_01_1775735865567.png": "ep6_panel_01.jpg",
    "ep6_p02_1775735945247.png": "ep6_panel_02.jpg",
    # For others, I'll use the crop logic or simpler: 
    # Since I can't crop here, I'll quickly generate the remaining 12 individually to be 100% sure.
}

# Actually, I'll just generate the remaining 12 INDIVIDUALLY now to ensure no composite issues.
# It takes less than a minute and ensures the site is perfect.
