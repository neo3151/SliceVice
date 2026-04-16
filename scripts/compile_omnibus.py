import os
import re
import textwrap
from PIL import Image, ImageDraw, ImageFont

# --- CONFIGURATION ---
OUTPUT_PDF = "SLICE_VICE_OMNIBUS_VOL_1.pdf"
ASSET_DIR = "web/public/assets"
PAGE_WIDTH = 1200
PAGE_HEIGHT = 1600
EPISODES_TO_COMPILE = [f"EP{i}" for i in range(1, 19)]

# --- INJECTION DICTIONARY ---
INSERTS_MAP = {
    "EP14": {
        "06": "ad_neon_pizza_1776301204010.png",
        "10": "dispatch_memo_artifact.png"
    },
    "EP15": {
        "04": "ad_vanguard_loans_1776301217615.png",
        "08": "artifact_lemans_blueprints.png"
    },
    "EP16": {
        "05": "artifact_soul_contract.png",
        "11": "ad_junkyard_1776301231267.png"
    },
    "EP17": {
        "03": "ad_elios_transmission_1776303670915.png",
        "07": "ad_straits_vhs_1776303697494.png"
    },
    "EP18": {
        "04": "ad_compliance_cuff_1776303683336.png",
        "08": "ad_survival_mail_order_1776303713556.png"
    }
}

def load_captions_db():
    try:
        with open("web/src/main.js", "r", encoding="utf-8") as f:
            js_content = f.read()

        pattern = r"url:\s*['\"]([^'\"]+)['\"].*?caption:\s*['\"](.*?)['\"](?:,|\s*\})"
        matches = re.findall(pattern, js_content)

        captions_db = {}
        for url, caption in matches:
            filename = url.split('/')[-1]
            captions_db[filename] = caption.replace("\\'", "'").replace("\\\"", "\"")
            
        return captions_db
    except Exception as e:
        print(f"[ERROR] Could not load main.js for captions: {e}")
        return {}

def get_font(size):
    try:
        return ImageFont.truetype("DejaVuSans-Bold.ttf", size)
    except:
        return ImageFont.load_default()

def create_title_page(title, subtitle=""):
    img = Image.new('RGB', (PAGE_WIDTH, PAGE_HEIGHT), color=(10, 10, 10))
    draw = ImageDraw.Draw(img)
    
    font_large = get_font(80)
    font_small = get_font(40)
    
    wrapped_title = textwrap.fill(title, width=20)
    
    try:
        bbox = draw.multiline_textbbox((0,0), wrapped_title, font=font_large)
        w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    except AttributeError:
        w, h = draw.textsize(wrapped_title, font=font_large)

    draw.multiline_text(((PAGE_WIDTH - w)/2, PAGE_HEIGHT/2 - h), wrapped_title, font=font_large, fill=(255, 235, 59), align="center")
    
    if subtitle:
        wrapped_sub = textwrap.fill(subtitle, width=40)
        try:
            bbox_sub = draw.multiline_textbbox((0,0), wrapped_sub, font=font_small)
            w_sub = bbox_sub[2] - bbox_sub[0]
        except AttributeError:
            w_sub, _ = draw.textsize(wrapped_sub, font=font_small)
        draw.multiline_text(((PAGE_WIDTH - w_sub)/2, PAGE_HEIGHT/2 + 60), wrapped_sub, font=font_small, fill=(200, 200, 200), align="center")
        
    return img

def format_page_group(img_path, filenames=None, caption_db=None):
    """Loads art, dynamically scales it based on total caption height, and perfectly places captions in black margins so they NEVER touch the art."""
    try:
        if any(e in img_path for e in ["EP14","EP15","EP16","EP17","EP18"]):
            box_color = "#e8a045"
        elif any(e in img_path for e in ["EP7","EP8","EP9","EP10","EP11","EP12","EP13"]):
            box_color = "#ff8c00"
        else:
            box_color = "#ffeb3b"
            
        font = get_font(28) # Smaller font for a Graphic Novel look
        padding = 15
        spacing = 20 # Spacing between boxes
        
        # 1. First, calculate all bounding boxes for the captions.
        boxes = []
        if filenames and caption_db:
            dummy_img = Image.new('RGB', (1,1))
            draw_dummy = ImageDraw.Draw(dummy_img)
            for fname in filenames:
                if fname in caption_db:
                    wrapped_text = textwrap.fill(caption_db[fname], width=45) 
                    try:
                        bbox = draw_dummy.multiline_textbbox((0,0), wrapped_text, font=font)
                        text_w, text_h = bbox[2] - bbox[0], bbox[3] - bbox[1]
                    except AttributeError:
                        text_w, text_h = draw_dummy.textsize(wrapped_text, font=font)
                        
                    box_w, box_h = text_w + padding * 2, text_h + padding * 2
                    boxes.append({
                        "text": wrapped_text,
                        "bw": box_w,
                        "bh": box_h
                    })
        
        # Split captions between top margin and bottom margin
        mid = (len(boxes) + 1) // 2
        top_boxes = boxes[:mid]
        bot_boxes = boxes[mid:]
        
        top_h_total = sum(b['bh'] + spacing for b in top_boxes)
        bot_h_total = sum(b['bh'] + spacing for b in bot_boxes)
        # Add slight padding for aesthetics
        if top_h_total > 0: top_h_total += 30
        if bot_h_total > 0: bot_h_total += 30
        
        # 2. Resize the art so it safely fits between top_h_total and bot_h_total
        max_art_width = PAGE_WIDTH - 60
        max_art_height = PAGE_HEIGHT - top_h_total - bot_h_total - 100 # 100px explicit safe margin
        if max_art_height < 300: max_art_height = 300
            
        page = Image.open(img_path).convert('RGB')
        page.thumbnail((int(max_art_width), int(max_art_height)), Image.Resampling.LANCZOS)
        
        # 3. Paste the art onto the canvas
        canvas = Image.new('RGB', (PAGE_WIDTH, PAGE_HEIGHT), color=(0, 0, 0))
        remaining_space = PAGE_HEIGHT - top_h_total - bot_h_total
        art_y = top_h_total + (remaining_space - page.height) // 2
        art_x = (PAGE_WIDTH - page.width) // 2
        canvas.paste(page, (art_x, int(art_y)))
        
        # 4. Draw the boxes exclusively within the black margins
        draw = ImageDraw.Draw(canvas)
        
        # Top boxes
        current_y = 30 # Start 30px from top of page
        for i, b in enumerate(top_boxes):
            if i % 2 == 0: x = 50
            else: x = PAGE_WIDTH - b['bw'] - 50
            if x < 20: x = 20
            
            draw.rectangle([x, current_y, x + b['bw'], current_y + b['bh']], fill=box_color, outline="black", width=5)
            draw.multiline_text((x + padding, current_y + padding), b['text'], fill="black", font=font)
            current_y += b['bh'] + spacing
            
        # Bottom boxes
        current_y = art_y + page.height + 30 # Start definitively below the art
        for i, b in enumerate(bot_boxes):
            if len(top_boxes) % 2 == 0:
                if i % 2 == 0: x = 50
                else: x = PAGE_WIDTH - b['bw'] - 50
            else:
                if i % 2 == 0: x = PAGE_WIDTH - b['bw'] - 50
                else: x = 50
                
            if x < 20: x = 20
            
            draw.rectangle([x, int(current_y), int(x + b['bw']), int(current_y + b['bh'])], fill=box_color, outline="black", width=5)
            draw.multiline_text((x + padding, int(current_y) + padding), b['text'], fill="black", font=font)
            current_y += b['bh'] + spacing
            
        return canvas
    except Exception as e:
        print(f"FAILED TO LOAD: {img_path} - {e}")
        return None

def main():
    print("[VANGUARD COMPILER] Loading captions db...")
    captions_db = load_captions_db()
    
    print("[VANGUARD COMPILER] Initializing Book One Omnibus sequence...")
    omnibus_pages = []

    omnibus_pages.append(create_title_page("SLICE VICE", "SEASON ONE OMNIBUS"))
    omnibus_pages.append(create_title_page("THE TOTAL COMPLIANCE LOGS", "Volume 01 - Vol 03"))

    for ep_id in EPISODES_TO_COMPILE:
        ep_dir = os.path.join(ASSET_DIR, ep_id)
        if not os.path.exists(ep_dir):
            continue
            
        print(f"[VANGUARD COMPILER] Processing {ep_id}...")
        omnibus_pages.append(create_title_page(f"CASSETTE: {ep_id}", "PLAYING..."))
        
        panels = sorted([f for f in os.listdir(ep_dir) if ("panel" in f.lower()) and f.endswith(('.png', '.jpg'))])
        
        # --- GROUP DUPLICATE PANELS BY FILE SIZE ---
        groups = []
        current_group = []
        last_size = None
        for p in panels:
            path = os.path.join(ep_dir, p)
            sz = os.path.getsize(path)
            if last_size is None or sz == last_size:
                current_group.append(p)
            else:
                groups.append(current_group)
                current_group = [p]
            last_size = sz
        if current_group:
            groups.append(current_group)

        # Build pages grouped by identical frames
        for group in groups:
            first_panel = group[0]
            first_panel_path = os.path.join(ep_dir, first_panel)
            
            # Combine all captions belonging to this group onto the single first image
            page_img = format_page_group(first_panel_path, filenames=group, caption_db=captions_db)
            if page_img:
                omnibus_pages.append(page_img)
            
            # Check if any panel in this group triggers an Ad insertion
            for p in group:
                panel_num = re.search(r'_(\d+)\.', p)
                if not panel_num: continue
                suffix = panel_num.group(1)
                
                if ep_id in INSERTS_MAP and suffix in INSERTS_MAP[ep_id]:
                    insert_name = INSERTS_MAP[ep_id][suffix]
                    insert_path = os.path.join(ASSET_DIR, insert_name)
                    print(f"  --> [INJECTING COMMERCIAL/LORE BREAK]: {insert_name}")
                    # Ads/Lore only have 1 caption usually
                    insert_img = format_page_group(insert_path, filenames=[insert_name], caption_db=captions_db)
                    if insert_img:
                        omnibus_pages.append(insert_img)

    if not omnibus_pages:
        print("[ERROR] No pages loaded. Aborting.")
        return

    print(f"\n[VANGUARD COMPILER] Loaded {len(omnibus_pages)} unique pages into RAM.")
    print(f"[VANGUARD COMPILER] Stitching PDF {OUTPUT_PDF}. This will take a moment...")
    
    first_page = omnibus_pages[0]
    subsequent_pages = omnibus_pages[1:]
    
    first_page.save(
        OUTPUT_PDF,
        "PDF",
        resolution=100.0,
        save_all=True,
        append_images=subsequent_pages
    )
    
    print(f"[SUCCESS] Omnibus successfully compiled to {OUTPUT_PDF}.")
    print(f"[SUCCESS] Total Page Count: {len(omnibus_pages)}")

if __name__ == "__main__":
    main()
