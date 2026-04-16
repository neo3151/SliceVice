import os
import re
import textwrap
from PIL import Image, ImageDraw, ImageFont

# --- CONFIGURATION ---
OUTPUT_PDF = "SLICE_VICE_OMNIBUS_VOL_1.pdf"
ASSET_DIR = "web/public/assets"
PAGE_WIDTH = 1200
PAGE_HEIGHT = 1600
EPISODES_TO_COMPILE = [f"EP{i}" for i in range(1, 20)]

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

# --- EPISODE TITLE NAMES ---
EPISODE_TITLES = {
    "EP1": "First Delivery",
    "EP2": "Turnpike Run",
    "EP3": "Storm Warning",
    "EP4": "Lovebugs",
    "EP5": "The Causeway",
    "EP6": "Pelican Bay",
    "EP7": "The Kraken",
    "EP8": "Stiltsville",
    "EP9": "Dead Drops",
    "EP10": "Checkpoint Alpha",
    "EP11": "The Uninstaller I",
    "EP12": "The Uninstaller II",
    "EP13": "The Uninstaller III",
    "EP14": "Neon Compliance",
    "EP15": "Le Mans",
    "EP16": "Soul Contract",
    "EP17": "Elio's Signal",
    "EP18": "Survival Order",
    "EP19": "Booth 14",
}

def load_cover_image(filename):
    """Load a cover image and resize it to fit the page dimensions."""
    path = os.path.join(ASSET_DIR, filename)
    if os.path.exists(path):
        img = Image.open(path).convert('RGB')
        img = img.resize((PAGE_WIDTH, PAGE_HEIGHT), Image.Resampling.LANCZOS)
        return img
    return None

def create_title_page(title, subtitle=""):
    """Creates a clean cassette divider page with dark background and subtle accent line."""
    img = Image.new('RGB', (PAGE_WIDTH, PAGE_HEIGHT), color=(15, 13, 15))
    draw = ImageDraw.Draw(img)
    
    font_large = get_font(64)
    font_small = get_font(32)
    
    wrapped_title = textwrap.fill(title, width=22)
    
    try:
        bbox = draw.multiline_textbbox((0,0), wrapped_title, font=font_large)
        w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    except AttributeError:
        w, h = draw.textsize(wrapped_title, font=font_large)

    text_y = PAGE_HEIGHT // 2 - h
    draw.multiline_text(((PAGE_WIDTH - w)/2, text_y), wrapped_title, font=font_large, fill=(210, 180, 100), align="center")
    
    # Thin amber accent line
    line_y = text_y + h + 25
    draw.line([(PAGE_WIDTH//2 - 200, line_y), (PAGE_WIDTH//2 + 200, line_y)], fill=(180, 140, 60), width=2)
    
    if subtitle:
        wrapped_sub = textwrap.fill(subtitle, width=40)
        try:
            bbox_sub = draw.multiline_textbbox((0,0), wrapped_sub, font=font_small)
            w_sub = bbox_sub[2] - bbox_sub[0]
        except AttributeError:
            w_sub, _ = draw.textsize(wrapped_sub, font=font_small)
        draw.multiline_text(((PAGE_WIDTH - w_sub)/2, line_y + 20), wrapped_sub, font=font_small, fill=(120, 115, 100), align="center")
        
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

def draw_text_centered(draw, text, y, font, fill):
    try:
        bbox = draw.textbbox((0,0), text, font=font)
        w = bbox[2] - bbox[0]
    except AttributeError:
        w, _ = draw.textsize(text, font=font)
    draw.text(((PAGE_WIDTH - w)/2, y), text, font=font, fill=fill)

def create_toc_page(entries, start_page_num):
    """Creates TOC by compositing text over the generated background image."""
    # Load generated background
    bg_path = os.path.join(ASSET_DIR, "omnibus_toc_background.png")
    if os.path.exists(bg_path):
        img = Image.open(bg_path).convert('RGB')
        img = img.resize((PAGE_WIDTH, PAGE_HEIGHT), Image.Resampling.LANCZOS)
    else:
        img = Image.new('RGB', (PAGE_WIDTH, PAGE_HEIGHT), color=(15, 13, 15))
    
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(56)
    font_vol_header = get_font(28)
    font_item = get_font(30)
    font_page_num = get_font(30)
    
    # Title
    draw_text_centered(draw, "TABLE OF CONTENTS", 70, font_title, (210, 180, 100))
    # Thin accent line
    draw.line([(250, 140), (PAGE_WIDTH - 250, 140)], fill=(180, 140, 60), width=2)
    
    toc_links = []
    
    volumes = [
        ("VOLUME 01 \u2014 FIRST RUN", ["EP1","EP2","EP3","EP4","EP5","EP6"]),
        ("VOLUME 02 \u2014 THE UNINSTALLER", ["EP7","EP8","EP9","EP10","EP11","EP12","EP13"]),
        ("VOLUME 03 \u2014 TOTAL COMPLIANCE", ["EP14","EP15","EP16","EP17","EP18","EP19"]),
    ]
    
    y = 175
    for vol_title, vol_eps in volumes:
        y += 12
        draw.text((130, y), vol_title, font=font_vol_header, fill=(210, 180, 100))
        draw.line([(130, y + 35), (PAGE_WIDTH - 130, y + 35)], fill=(60, 50, 40), width=1)
        y += 48
        
        for ep_id in vol_eps:
            match = None
            for title, rel_page in entries:
                if ep_id in title:
                    match = (title, rel_page)
                    break
            if not match:
                continue
                
            title, rel_page = match
            ep_name = EPISODE_TITLES.get(ep_id, "")
            left_text = f"  {ep_id.replace('EP', 'EP ')}" 
            if ep_name:
                left_text += f"  \u2014  {ep_name}"
            right_text = str(rel_page + start_page_num)
            
            try:
                bbox_left = draw.textbbox((0,0), left_text, font=font_item)
                w_left = bbox_left[2] - bbox_left[0]
                bbox_right = draw.textbbox((0,0), right_text, font=font_page_num)
                w_right = bbox_right[2] - bbox_right[0]
            except AttributeError:
                w_left, _ = draw.textsize(left_text, font=font_item)
                w_right, _ = draw.textsize(right_text, font=font_page_num)
            
            draw.text((160, y), left_text, font=font_item, fill=(180, 175, 165))
            draw.text((PAGE_WIDTH - 160 - w_right, y), right_text, font=font_page_num, fill=(210, 180, 100))
            
            # Dotted leader
            dot_start = 165 + w_left + 15
            dot_end = (PAGE_WIDTH - 165 - w_right) - 15
            dot_y = y + 19
            for dot_x in range(int(dot_start), int(dot_end), 14):
                draw.ellipse([dot_x, dot_y, dot_x+2, dot_y+2], fill=(60, 55, 45))
            
            # Clickable link bounding boxes
            rect_title = [140 * 0.72, (y - 2) * 0.72, (170 + w_left) * 0.72, (y + 38) * 0.72]
            toc_links.append((rect_title, rel_page + 3))
            rect_page = [(PAGE_WIDTH - 170 - w_right) * 0.72, (y - 2) * 0.72, (PAGE_WIDTH - 140) * 0.72, (y + 38) * 0.72]
            toc_links.append((rect_page, rel_page + 3))
            
            y += 44
    
    # Appendix entry
    y += 18
    draw.line([(130, y), (PAGE_WIDTH - 130, y)], fill=(60, 50, 40), width=1)
    y += 12
    draw.text((160, y), "APPENDIX  \u2014  Archival Material & Lore", font=font_item, fill=(120, 115, 100))
    
    # Footer
    footer_font = get_font(20)
    draw_text_centered(draw, "SLICE VICE  \u00b7  SEASON ONE OMNIBUS  \u00b7  THE TOTAL COMPLIANCE LOGS", PAGE_HEIGHT - 70, footer_font, (70, 65, 55))
    
    return img, toc_links

def create_appendix_page():
    """Loads the generated appendix divider image."""
    path = os.path.join(ASSET_DIR, "omnibus_appendix_divider.png")
    if os.path.exists(path):
        img = Image.open(path).convert('RGB')
        return img.resize((PAGE_WIDTH, PAGE_HEIGHT), Image.Resampling.LANCZOS)
    # Fallback
    img = Image.new('RGB', (PAGE_WIDTH, PAGE_HEIGHT), color=(15, 13, 15))
    draw = ImageDraw.Draw(img)
    font = get_font(80)
    draw_text_centered(draw, "APPENDIX", PAGE_HEIGHT//2 - 40, font, (210, 180, 100))
    return img

def main():
    print("[VANGUARD COMPILER] Loading captions db...")
    captions_db = load_captions_db()
    
    print("[VANGUARD COMPILER] Initializing Book One Omnibus sequence...")
    
    toc_entries = []
    episode_pages = []
    current_page_idx = 0

    for ep_id in EPISODES_TO_COMPILE:
        ep_dir = os.path.join(ASSET_DIR, ep_id)
        if not os.path.exists(ep_dir):
            continue
            
        print(f"[VANGUARD COMPILER] Processing {ep_id}...")
        
        toc_entries.append((f"CASSETTE: {ep_id}", current_page_idx))
        episode_pages.append(create_title_page(f"CASSETTE: {ep_id}", "PLAYING..."))
        current_page_idx += 1
        
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
                episode_pages.append(page_img)
                current_page_idx += 1
            
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
                        episode_pages.append(insert_img)
                        current_page_idx += 1

    print("[VANGUARD COMPILER] Staging PDF Pages...")
    omnibus_pages = []

    # --- FRONT COVER ---
    front_cover = load_cover_image("omnibus_front_cover.png")
    if front_cover:
        omnibus_pages.append(front_cover)
        print("  --> Front cover loaded.")
    else:
        omnibus_pages.append(create_title_page("SLICE VICE", "SEASON ONE OMNIBUS"))
    
    # --- INNER TITLE PAGE (generated art) ---
    inner_title = load_cover_image("omnibus_inner_title.png")
    if inner_title:
        omnibus_pages.append(inner_title)
        print("  --> Inner title loaded.")
    else:
        omnibus_pages.append(create_title_page("THE TOTAL COMPLIANCE LOGS", "Volumes 01-03  \u00b7  Episodes 1-19"))
    
    # TOC page is page 3 (0-indexed: 2), episodes start on page 4
    toc_img, toc_links = create_toc_page(toc_entries, start_page_num=4)
    omnibus_pages.append(toc_img)
    
    omnibus_pages.extend(episode_pages)
    
    # --- POPULATE APPENDIX ---
    print("[VANGUARD COMPILER] Populating Appendix with Archival Assets...")
    appendix_start_idx = len(omnibus_pages)
    omnibus_pages.append(create_appendix_page())
    
    used_inserts = set()
    for ep_dict in INSERTS_MAP.values():
        for fname in ep_dict.values():
            used_inserts.add(fname)
            
    appendix_files = []
    for f in os.listdir(ASSET_DIR):
        path = os.path.join(ASSET_DIR, f)
        if not os.path.isfile(path) or f in used_inserts: continue
        
        if f.startswith(('atlas_', 'character_', 'artifact_')) or f.endswith('_artifact.png') or f.endswith('_mockup.png'):
            if f.endswith(('.png', '.jpg')):
                appendix_files.append(f)
                
    appendix_files.sort()
    for f in appendix_files:
        path = os.path.join(ASSET_DIR, f)
        try:
            art = Image.open(path).convert('RGB')
            max_w, max_h = PAGE_WIDTH - 200, PAGE_HEIGHT - 200
            art.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
            canvas = Image.new('RGB', (PAGE_WIDTH, PAGE_HEIGHT), color=(10, 10, 10))
            canvas.paste(art, ((PAGE_WIDTH - art.width)//2, (PAGE_HEIGHT - art.height)//2))
            
            draw = ImageDraw.Draw(canvas)
            title_text = f.replace('.png', '').replace('.jpg', '').replace('_', ' ').upper()
            title_font = get_font(30)
            try:
                bbox = draw.textbbox((0,0), title_text, font=title_font)
                tw = bbox[2] - bbox[0]
            except AttributeError:
                tw, _ = draw.textsize(title_text, font=title_font)
            draw.text(((PAGE_WIDTH - tw)//2, 50), title_text, font=title_font, fill=(150, 150, 150))
            
            omnibus_pages.append(canvas)
        except Exception as e:
            print(f"  --> [ERROR] Skipping {f}: {e}")

    # --- BACK COVER ---
    back_cover = load_cover_image("omnibus_back_cover.png")
    if back_cover:
        omnibus_pages.append(back_cover)
        print("  --> Back cover loaded.")

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
    
    # ---------------- PYMUPDF: CLICKABLE TOC + BOOKMARKS ----------------
    print("\n[VANGUARD COMPILER] Injecting clickable TOC links and bookmarks...")
    try:
        import fitz
        doc = fitz.open(OUTPUT_PDF)
        
        # 1. Insert clickable GOTO links on the TOC page
        toc_page = doc[2]  # 0-indexed, TOC is 3rd page
        for rect_coords, target_page_idx in toc_links:
            r = fitz.Rect(*rect_coords)
            toc_page.insert_link({
                "kind": fitz.LINK_GOTO,
                "from": r,
                "page": target_page_idx
            })
        
        # 2. Suppress hover preview: set highlight mode to /N (None)
        #    and border width to 0 on every link annotation via xref.
        #    This tells the PDF viewer to show NO visual feedback on hover.
        for annot in toc_page.annots():
            xref = annot.xref
            # /H /N = Highlight mode None (no visual effect on hover/click)
            doc.xref_set_key(xref, "H", "/N")
            # /Border [0 0 0] = no border at all
            doc.xref_set_key(xref, "Border", "[0 0 0]")
            # Remove any color entries that could cause rendering
            doc.xref_set_key(xref, "C", "[]")
        
        # 3. Build PDF Document Outline (Bookmarks sidebar)
        pdf_toc = [[1, "Table of Contents", 3]]
        for title, rel_page in toc_entries:
            pdf_toc.append([1, title, rel_page + 4])
            
        pdf_toc.append([1, "Appendix: Archival Material", appendix_start_idx + 1])
        
        doc.set_toc(pdf_toc)
        
        doc.saveIncr()
        doc.close()
        print("[SUCCESS] Clickable TOC & Bookmarks successfully woven into the Omnibus.")
    except ImportError:
        print("[WARNING] PyMuPDF (fitz) not installed, links skipped.")
    except Exception as e:
        print(f"[ERROR] Failed to inject links: {e}")

if __name__ == "__main__":
    main()
