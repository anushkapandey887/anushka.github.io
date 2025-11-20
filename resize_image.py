#!/usr/bin/env python3
from PIL import Image
import os

# Open the image
img_path = 'portfolio_images/image_page11_40.jpg'
img = Image.open(img_path)

print(f"Original image size: {img.size}")

# Get the average size of other images for reference
# Most portfolio images seem to be around 800-1200px wide
# Let's resize to max width of 1000px while maintaining aspect ratio

max_width = 1000
width_percent = (max_width / float(img.size[0]))
new_height = int((float(img.size[1]) * float(width_percent)))

# Resize with high quality
resized_img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

print(f"New image size: {resized_img.size}")

# Save the resized image (overwrite the original)
resized_img.save(img_path, 'JPEG', quality=85, optimize=True)

print(f"Image resized and saved successfully!")
print(f"File size reduced from {os.path.getsize(img_path)} bytes")
