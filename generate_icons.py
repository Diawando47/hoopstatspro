# This script uses PIL to generate icons
# Run: pip install Pillow && python generate_icons.py
from PIL import Image, ImageDraw
import math

def draw_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    
    # Background
    d.rounded_rectangle([0, 0, size-1, size-1], radius=int(size*0.2), fill=(10, 10, 12, 255))
    
    # Basketball circle
    cx, cy, r = size//2, size//2, int(size*0.38)
    d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(255, 107, 43, 255), width=max(2, size//60))
    
    # Lines
    lw = max(1, size//80)
    d.line([cx, cy-r, cx, cy+r], fill=(255, 107, 43, 255), width=lw)
    d.line([cx-r, cy, cx+r, cy], fill=(255, 107, 43, 255), width=lw)
    
    return img

for size in [192, 512]:
    img = draw_icon(size)
    img.save(f'public/icons/icon-{size}.png')
    img.save(f'public/icons/icon-{size}-maskable.png')
    print(f'Generated {size}x{size}')

print('Icons generated!')
