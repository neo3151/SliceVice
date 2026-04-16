import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, letter
from PIL import Image

def generate_pdf():
    assets_dir = "/home/neo/SliceVice/web/public/assets/EP19"
    pdf_path = "/home/neo/SliceVice/web/public/SliceVice_EP19.pdf"
    
    if not os.path.exists(assets_dir):
        print(f"Error: {assets_dir} not found.")
        return

    images = [f for f in os.listdir(assets_dir) if f.endswith('.png')]
    images.sort()

    if not images:
        print("No images found in EP19 directory.")
        return

    c = canvas.Canvas(pdf_path, pagesize=landscape(letter))
    width, height = landscape(letter)

    for img_name in images:
        img_path = os.path.join(assets_dir, img_name)
        img = Image.open(img_path)
        
        # Calculate aspect ratio
        img_w, img_h = img.size
        aspect = img_h / float(img_w)
        
        # Calculate dimensions to fit page
        draw_w = width
        draw_h = width * aspect
        
        if draw_h > height:
            draw_h = height
            draw_w = height / aspect
            
        x = (width - draw_w) / 2
        y = (height - draw_h) / 2
        
        c.drawImage(img_path, x, y, width=draw_w, height=draw_h)
        c.showPage()
        
    c.save()
    print(f"Successfully compiled {pdf_path}")

if __name__ == "__main__":
    generate_pdf()
