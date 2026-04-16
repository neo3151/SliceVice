from PIL import Image, ImageDraw, ImageFilter
import os
import random
import math

# Create asset dir
ASSET_DIR = "web/public/assets/marginalia_assets"
os.makedirs(ASSET_DIR, exist_ok=True)

def get_jitter_points(center, radius, jitter=5, num_points=36):
    points = []
    for i in range(num_points + 1):
        angle = math.radians(i * (360 / num_points))
        r = radius + random.uniform(-jitter, jitter)
        x = center[0] + r * math.cos(angle)
        y = center[1] + r * math.sin(angle)
        points.append((x, y))
    return points

def create_coffee_ring():
    size = (300, 300)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = (150, 150)
    radius = 120
    
    # Layered coffee ring for depth
    for r_off in [-2, 0, 2]:
        pts = get_jitter_points(center, radius + r_off, jitter=8)
        draw.line(pts, fill=(139, 69, 19, 100), width=random.randint(4, 12))
    
    # Spatters
    for _ in range(20):
        sx, sy = random.randint(50, 250), random.randint(50, 250)
        sr = random.randint(2, 8)
        draw.ellipse([sx-sr, sy-sr, sx+sr, sy+sr], fill=(139, 69, 19, 50))
        
    img.save(f"{ASSET_DIR}/coffee_ring.png")

def create_mud_smudge():
    size = (300, 200)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for _ in range(2000):
        x = random.gauss(150, 60)
        y = random.gauss(100, 40)
        alpha = random.randint(10, 80)
        draw.point((x, y), fill=(80, 50, 20, alpha))
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    img.save(f"{ASSET_DIR}/mud_smudge.png")

def create_red_circle():
    size = (200, 200)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = (100, 100)
    # A shaky, double-stroked circle (grease pencil style)
    for rad_offset in [-3, 3]:
        pts = get_jitter_points(center, 80 + rad_offset, jitter=6)
        draw.line(pts, fill=(220, 20, 60, 200), width=random.randint(6, 10))
    img.save(f"{ASSET_DIR}/red_circle.png")

def create_blue_arrow():
    size = (150, 150)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Jittery arrow
    p1, p2 = (20, 20), (130, 130)
    draw.line([p1, p2], fill=(30, 144, 255, 220), width=8)
    # Arrowhead
    draw.line([p2, (100, 130)], fill=(30, 144, 255, 220), width=8)
    draw.line([p2, (130, 100)], fill=(30, 144, 255, 220), width=8)
    img.save(f"{ASSET_DIR}/blue_arrow.png")

def create_red_x():
    size = (150, 150)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Violent cross out
    draw.line([(20, 20), (130, 130)], fill=(255, 0, 0, 200), width=12)
    draw.line([(130, 20), (20, 130)], fill=(255, 0, 0, 200), width=12)
    img.save(f"{ASSET_DIR}/red_x.png")

def create_green_star():
    size = (100, 100)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = (50, 50)
    # 5 jittery lines crossing at center
    for i in range(5):
        angle = math.radians(i * 36)
        r = 40 + random.uniform(-10, 10)
        x1, y1 = center[0] + r * math.cos(angle), center[1] + r * math.sin(angle)
        x2, y2 = center[0] - r * math.cos(angle), center[1] - r * math.sin(angle)
        draw.line([(x1, y1), (x2, y2)], fill=(50, 205, 50, 200), width=6)
    img.save(f"{ASSET_DIR}/green_star.png")

def create_tactical_mark():
    size = (150, 150)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Shaky box with X
    rect = [(30, 30), (120, 30), (120, 120), (30, 120), (30, 30)]
    rect = [(x + random.uniform(-4, 4), y + random.uniform(-4, 4)) for x, y in rect]
    draw.line(rect, fill=(255, 69, 0, 230), width=6)
    draw.line([(30, 30), (120, 120)], fill=(255, 69, 0, 230), width=4)
    img.save(f"{ASSET_DIR}/tactical_mark.png")

def create_blood_spot():
    size = (200, 200)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for _ in range(1500):
        x = random.gauss(100, 35)
        y = random.gauss(100, 35)
        alpha = random.randint(10, 200)
        draw.point((x, y), fill=(139, 0, 0, alpha))
    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    img.save(f"{ASSET_DIR}/blood_spot.png")

def create_yellow_eyes():
    size = (100, 100)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Two glowing slits
    draw.ellipse([20, 40, 40, 50], fill=(255, 255, 0, 255))
    draw.ellipse([60, 40, 80, 50], fill=(255, 255, 0, 255))
    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    img.save(f"{ASSET_DIR}/yellow_eyes.png")

def create_spark_doodle():
    size = (100, 100)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = (50, 50)
    for _ in range(8):
        angle = math.radians(random.randint(0, 360))
        r = random.randint(20, 45)
        x2, y2 = center[0] + r * math.cos(angle), center[1] + r * math.sin(angle)
        draw.line([center, (x2, y2)], fill=(255, 215, 0, 240), width=3)
    img.save(f"{ASSET_DIR}/spark_doodle.png")

if __name__ == "__main__":
    create_coffee_ring()
    create_mud_smudge()
    create_red_circle()
    create_blue_arrow()
    create_red_x()
    create_green_star()
    create_tactical_mark()
    create_blood_spot()
    create_yellow_eyes()
    create_spark_doodle()
    print("Hand-drawn marginalia assets refined.")
