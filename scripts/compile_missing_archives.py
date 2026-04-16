import os
import glob
from PIL import Image

def compile_pdf(assets_dir, output_pdf, pattern="*.png"):
    target_files = sorted(glob.glob(os.path.join(assets_dir, pattern)))
    pages = []
    for file in target_files:
        try:
            img = Image.open(file).convert("RGB")
            pages.append(img)
        except Exception as e:
            print(f"Failed to open {file}: {e}")
    if pages:
        pages[0].save(output_pdf, save_all=True, append_images=pages[1:])
        print(f"Successfully saved {output_pdf}")
    else:
        print(f"No pages found for {output_pdf}")

# Compile Episode 07
compile_pdf("/home/neo/SliceVice/web/public/assets/EP7", "/home/neo/SliceVice/web/public/SliceVice_EP7.pdf", "*.jpg")

# Compile Episode 08
compile_pdf("/home/neo/SliceVice/web/public/assets/EP8", "/home/neo/SliceVice/web/public/SliceVice_EP8.pdf", "*.png")

# Compile Field Manual (Explicit Order)
manual_base = "/home/neo/SliceVice/web/public/assets/manual"
manual_assets = [
    "vol1_manual_cover_mockup_1775961192233.png",
    "ep1_snapshot_abyssal_gearing_1775961456292.png",
    "ep2_snapshot_slipstream_logic_1775961468430.png",
    "ep3_snapshot_neon_siphon_1775961482891.png",
    "ep4_snapshot_repossession_1775961500235.png",
    "ep5_snapshot_binary_burnout_1775961515399.png",
    "relic_v_sentry_safe_1775961295785.png",
    "relic_nixie_timer_1775961314187.png",
    "relic_scavenger_note_1775961330566.png",
    "relic_vanguard_badge_1775961343490.png",
    "rebel_stamp.png"
]

manual_pages = []
for p in manual_assets:
    path = os.path.join(manual_base, p)
    if os.path.exists(path):
        img = Image.open(path).convert("RGB")
        manual_pages.append(img)

if manual_pages:
    manual_pages[0].save("/home/neo/SliceVice/web/public/SliceVice_Vol1_Field_Manual.pdf", save_all=True, append_images=manual_pages[1:])
    print("Successfully saved Field Manual PDF")
