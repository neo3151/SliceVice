import os
import re
import textwrap
import argparse
import random
from PIL import Image, ImageDraw, ImageFont

# config defaults
EPISODE_DEFAULT = "EP7"
ASSETS_DIR_TEMPLATE = "web/public/assets/{EPISODE}"
CAPTION_SCRIPT_TEMPLATE = "docs/episodes/CAPTION_SCRIPT_{EPISODE}.md"
FIELD_NOTES_PATH = "docs/production/VOL1_FIELD_NOTES.md"
MARGINALIA_ASSET_DIR = "web/public/assets/marginalia_assets"

def load_field_notes():
    notes = {}
    if not os.path.exists(FIELD_NOTES_PATH):
        return notes
    
    with open(FIELD_NOTES_PATH, 'r') as f:
        lines = f.readlines()
        in_table = False
        for line in lines:
            if "| Episode | Panel |" in line:
                in_table = True
                continue
            if in_table and line.startswith("|") and not "---" in line:
                parts = [p.strip() for p in line.split("|")]
                if len(parts) >= 6:
                    ep = parts[1]
                    panel = parts[2]
                    text = parts[3]
                    doodle = parts[4]
                    pos_str = parts[5].replace('(', '').replace(')', '')
                    pos = tuple(map(int, pos_str.split(',')))
                    
                    if ep not in notes: notes[ep] = {}
                    notes[ep][panel] = {"text": text, "doodle": doodle, "pos": pos}
    return notes

def compile_episode(ep_id, field_edition=False, field_notes_db=None):
    assets_dir = ASSETS_DIR_TEMPLATE.format(EPISODE=ep_id)
    caption_script = CAPTION_SCRIPT_TEMPLATE.format(EPISODE=ep_id)
    
    captions_data = [] 
    try:
        if os.path.exists(caption_script):
            with open(caption_script, 'r') as f:
                lines = f.readlines()
                in_table = False
                for line in lines:
                    if "| Page | Panel |" in line:
                        in_table = True
                        continue
                    if in_table and line.startswith("|") and not "---" in line:
                        parts = [p.strip() for p in line.split("|")]
                        if len(parts) >= 6:
                            panel_str = parts[2]
                            placement = parts[3]
                            text = parts[5]
                            captions_data.append({"panel": panel_str, "placement": placement, "text": text})
    except Exception as e:
        print(f"Error reading caption script for {ep_id}: {e}")

    ep_num = int(re.search(r'\d+', ep_id).group())
    box_color = "#ffeb3b" if ep_num < 7 else "#ff8c00" 
    
    pages = []
    panel_files = sorted([
        f for f in os.listdir(assets_dir) 
        if (f.lower().startswith("panel_") or f.lower().startswith(f"{ep_id.lower()}_panel_")) 
        and f.endswith((".jpg", ".png"))
    ])
    
    for filename in panel_files:
        panel_num_str = filename.split("_")[-1].split(".")[0]
        img_path = os.path.join(assets_dir, filename)
        
        try:
            img = Image.open(img_path).convert("RGBA") # Convert to RGBA for overlays
        except Exception as e:
            print(f"Failed to open {img_path}: {e}")
            continue

        draw = ImageDraw.Draw(img)
        
        try:
            font = ImageFont.truetype("DejaVuSans-Bold.ttf", int(img.height * 0.025))
            hand_font = ImageFont.truetype("/usr/share/fonts/opentype/urw-base35/Z003-MediumItalic.otf", int(img.height * 0.03))
        except:
            font = ImageFont.load_default()
            hand_font = ImageFont.load_default()
            
        # 1. Base Captions
        panel_captions = [c for c in captions_data if c["panel"] == panel_num_str]
        for cap in panel_captions:
            text = cap["text"]
            placement = cap["placement"]
            wrapped_text = textwrap.fill(text, width=45)
            
            try:
                bbox = draw.multiline_textbbox((0,0), wrapped_text, font=font)
            except AttributeError:
                w, h = draw.textsize(wrapped_text, font=font)
                bbox = (0, 0, w, h)

            text_w, text_h = bbox[2] - bbox[0], bbox[3] - bbox[1]
            padding = 15
            box_w, box_h = text_w + padding * 2, text_h + padding * 2
            x, y = padding * 2, padding * 2
            
            if "Bottom" in placement: y = img.height - box_h - (padding * 2)
            if "Right" in placement: x = img.width - box_w - (padding * 2)
            if "Center" in placement: x = (img.width - box_w) // 2
                
            draw.rectangle([x, y, x + box_w, y + box_h], fill=box_color, outline="black", width=5)
            draw.multiline_text((x + padding, y + padding), wrapped_text, fill="black", font=font)

        # 2. Field Edition Notes
        if field_edition and field_notes_db and ep_id in field_notes_db:
            if panel_num_str in field_notes_db[ep_id]:
                note_data = field_notes_db[ep_id][panel_num_str]
                note_text = note_data["text"]
                doodle_type = note_data["doodle"]
                pos = note_data["pos"]
                
                # Draw the doodle asset
                doodle_path = os.path.join(MARGINALIA_ASSET_DIR, f"{doodle_type}.png")
                if os.path.exists(doodle_path):
                    doodle_img = Image.open(doodle_path).convert("RGBA")
                    # Scaling the doodle randomly a bit for 'hand-drawn' feel
                    scale = random.uniform(0.8, 1.2)
                    doodle_img = doodle_img.resize((int(doodle_img.width * scale), int(doodle_img.height * scale)))
                    img.alpha_composite(doodle_img, (pos[0] - doodle_img.width//2, pos[1] - doodle_img.height//2))
                
                # Draw Axel's Note in Vibrant "Blue Ink" with a legibility stroke
                wrapped_note = textwrap.fill(f'// "{note_text}"', width=30)
                # Position note near doodle but slightly offset
                note_pos = (pos[0] + 40, pos[1] + 40)
                draw.multiline_text(
                    note_pos, 
                    wrapped_note, 
                    fill=(30, 144, 255, 255),  # Dodger Blue (more vibrant)
                    stroke_width=3, 
                    stroke_fill=(0, 0, 0, 255), # Black outline for legibility
                    font=hand_font
                )
            
        pages.append(img.convert("RGB"))
    return pages

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Compile Slice Vice PDF")
    parser.add_argument("--ep", type=str, default="EP7", help="Episode ID (e.g. EP7)")
    parser.add_argument("--volume", type=int, help="Volume number (e.g. 2 for episodes 7-12)")
    parser.add_argument("--field-edition", action="store_true", help="Enable Axel's Field Notes and doodles")
    args = parser.parse_args()

    field_notes = load_field_notes() if args.field_edition else None
    all_pages = []
    output_name = f"SliceVice_{args.ep}_Abyssal_Edition.pdf"

    if args.volume == 1:
        print(f"Compiling Volume 1: THE SLIPSTREAM {'(FIELD EDITION)' if args.field_edition else ''}")
        cover_path = "web/public/assets/vol1_cover_mockup.png"
        if os.path.exists(cover_path):
            all_pages.append(Image.open(cover_path).convert("RGB"))
        for i in range(1, 7):
            all_pages.extend(compile_episode(f"EP{i}", field_edition=args.field_edition, field_notes_db=field_notes))
        output_name = "SliceVice_Volume_1_Field_Edition.pdf" if args.field_edition else "SliceVice_Volume_1_The_Slipstream.pdf"
    elif args.volume == 2:
        print("Compiling Volume 2: THE UNINSTALLER")
        cover_path = "web/public/assets/vol2_cover_mockup.png"
        if os.path.exists(cover_path): all_pages.append(Image.open(cover_path).convert("RGB"))
        for i in range(7, 14):
            all_pages.extend(compile_episode(f"EP{i}", field_edition=args.field_edition, field_notes_db=field_notes))
        output_name = "SliceVice_Volume_2_The_Uninstaller.pdf"
    else:
        all_pages = compile_episode(args.ep, field_edition=args.field_edition, field_notes_db=field_notes)

    if all_pages:
        all_pages[0].save(output_name, save_all=True, append_images=all_pages[1:])
        print(f"Successfully saved {output_name}")
    else:
        print("No pages found.")
