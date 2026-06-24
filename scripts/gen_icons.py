"""
Generate PNG app icons from an improved giraffe design for Android.
Uses Pillow to render a cute, detailed giraffe with gradient background,
decorative stars, and professional shading.
"""
import os
import math
from PIL import Image, ImageDraw, ImageFilter

# ===== Design System Colors =====
YELLOW = (244, 169, 64)        # #F4A940 — primary
YELLOW_LIGHT = (253, 230, 138) # #FDE68A
YELLOW_DARK = (217, 119, 6)    # #D97706
BROWN = (139, 94, 60)          # #8B5E3C — secondary
BROWN_LIGHT = (160, 114, 74)   # #A0724A
BROWN_DARK = (93, 58, 26)      # #5D3A1A
BG_CENTER = (255, 251, 240)    # #FFFBF0 — warm cream center
BG_EDGE = (255, 236, 179)      # #FFECB3 — warm yellow edge
WHITE = (255, 255, 255)
BLACK = (74, 55, 40)           # #4A3728 — text dark
BLUSH = (255, 138, 128)        # #FF8A80 — cheek blush
STAR_GOLD = (255, 200, 80)     # decorative star color


def create_gradient_bg(size):
    """Create a radial gradient background from cream center to warm yellow edge."""
    img = Image.new('RGBA', (size, size), BG_EDGE + (255,))
    overlay = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    cx, cy = size / 2, size / 2
    max_r = int(size * 0.72)
    steps = 60

    for i in range(steps, 0, -1):
        r = int(max_r * i / steps)
        alpha = int(100 * (1 - i / steps) ** 1.5)
        draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            fill=BG_CENTER + (alpha,)
        )

    # Soft blur for smooth gradient
    overlay = overlay.filter(ImageFilter.GaussianBlur(max(1, size // 40)))
    return Image.alpha_composite(img, overlay)


def draw_star(draw, cx, cy, size, color, alpha=255):
    """Draw a 4-point sparkle star at (cx, cy)."""
    s = size
    points = [
        (cx, cy - s),       # top
        (cx + s * 0.25, cy - s * 0.25),  # upper right
        (cx + s, cy),       # right
        (cx + s * 0.25, cy + s * 0.25),  # lower right
        (cx, cy + s),       # bottom
        (cx - s * 0.25, cy + s * 0.25),  # lower left
        (cx - s, cy),       # left
        (cx - s * 0.25, cy - s * 0.25),  # upper left
    ]
    c = color + (alpha,) if len(color) == 3 else color
    draw.polygon(points, fill=c)


def draw_heart(draw, cx, cy, size, color, alpha=255):
    """Draw a small heart shape at (cx, cy)."""
    s = size
    c = color + (alpha,) if len(color) == 3 else color
    # Two circles + triangle
    r = int(s * 0.55)
    draw.ellipse([cx - s, cy - s * 0.6, cx - s + 2 * r, cy - s * 0.6 + 2 * r], fill=c)
    draw.ellipse([cx - r, cy - s * 0.6, cx - r + 2 * r, cy - s * 0.6 + 2 * r], fill=c)
    draw.polygon(
        [(cx - s, cy + r * 0.2), (cx + s, cy + r * 0.2), (cx, cy + s * 1.4)],
        fill=c
    )


def draw_giraffe(draw, cx, cy, scale):
    """Draw a cute, detailed giraffe head centered at (cx, cy)."""
    s = scale

    # ===== Neck (partial, at bottom) =====
    draw.rounded_rectangle(
        [cx - 4 * s, cy + 4 * s, cx + 4 * s, cy + 12 * s],
        radius=int(2 * s),
        fill=YELLOW
    )
    # Neck spots
    draw.ellipse([cx - 3 * s, cy + 6 * s, cx - 1 * s, cy + 8 * s], fill=BROWN)
    draw.ellipse([cx + 1 * s, cy + 8 * s, cx + 3 * s, cy + 10 * s], fill=BROWN)

    # ===== Ears (behind head) =====
    draw.ellipse([cx - 10 * s, cy - 3 * s, cx - 3 * s, cy + 3 * s], fill=YELLOW)
    draw.ellipse([cx + 3 * s, cy - 3 * s, cx + 10 * s, cy + 3 * s], fill=YELLOW)
    # Inner ears
    draw.ellipse([cx - 8.5 * s, cy - 2 * s, cx - 4.5 * s, cy + 2 * s], fill=BROWN_LIGHT)
    draw.ellipse([cx + 4.5 * s, cy - 2 * s, cx + 8.5 * s, cy + 2 * s], fill=BROWN_LIGHT)

    # ===== Head =====
    # Main head shape — slightly egg-shaped
    draw.ellipse([cx - 7 * s, cy - 7 * s, cx + 7 * s, cy + 7 * s], fill=YELLOW)

    # Head highlight (top-left, for 3D effect)
    highlight = (255, 250, 200)
    draw.ellipse([cx - 5 * s, cy - 6 * s, cx - 1 * s, cy - 2 * s], fill=highlight)

    # ===== Ossicones (horns) =====
    # Left ossicone
    draw.rounded_rectangle(
        [cx - 4.5 * s, cy - 11 * s, cx - 2.5 * s, cy - 6 * s],
        radius=int(1 * s),
        fill=YELLOW
    )
    draw.ellipse([cx - 5 * s, cy - 12.5 * s, cx - 2 * s, cy - 9 * s], fill=BROWN)
    draw.ellipse([cx - 4 * s, cy - 12 * s, cx - 3 * s, cy - 10.5 * s], fill=YELLOW_LIGHT)

    # Right ossicone
    draw.rounded_rectangle(
        [cx + 2.5 * s, cy - 11 * s, cx + 4.5 * s, cy - 6 * s],
        radius=int(1 * s),
        fill=YELLOW
    )
    draw.ellipse([cx + 2 * s, cy - 12.5 * s, cx + 5 * s, cy - 9 * s], fill=BROWN)
    draw.ellipse([cx + 3 * s, cy - 12 * s, cx + 4 * s, cy - 10.5 * s], fill=YELLOW_LIGHT)

    # ===== Spots on head =====
    draw.ellipse([cx - 5 * s, cy + 1 * s, cx - 2 * s, cy + 3.5 * s], fill=BROWN)
    draw.ellipse([cx + 1.5 * s, cy + 0.5 * s, cx + 4 * s, cy + 2.5 * s], fill=BROWN)
    draw.ellipse([cx - 1.5 * s, cy + 3.5 * s, cx + 0.5 * s, cy + 5 * s], fill=BROWN)

    # ===== Eyes (large, cute) =====
    # White sclera
    draw.ellipse([cx - 5 * s, cy - 3.5 * s, cx - 1.5 * s, cy + 0.5 * s], fill=WHITE)
    draw.ellipse([cx + 1.5 * s, cy - 3.5 * s, cx + 5 * s, cy + 0.5 * s], fill=WHITE)

    # Pupils (large, dark)
    draw.ellipse([cx - 4 * s, cy - 2.5 * s, cx - 2 * s, cy - 0.2 * s], fill=BLACK)
    draw.ellipse([cx + 2 * s, cy - 2.5 * s, cx + 4 * s, cy - 0.2 * s], fill=BLACK)

    # Eye highlights (sparkle)
    draw.ellipse([cx - 3.3 * s, cy - 2.2 * s, cx - 2.7 * s, cy - 1.5 * s], fill=WHITE)
    draw.ellipse([cx + 2.7 * s, cy - 2.2 * s, cx + 3.3 * s, cy - 1.5 * s], fill=WHITE)

    # ===== Blush (rosy cheeks) =====
    draw.ellipse([cx - 7.5 * s, cy + 0.5 * s, cx - 4.5 * s, cy + 2.5 * s], fill=BLUSH + (128,))
    draw.ellipse([cx + 4.5 * s, cy + 0.5 * s, cx + 7.5 * s, cy + 2.5 * s], fill=BLUSH + (128,))

    # ===== Nose / Nostrils =====
    draw.ellipse([cx - 1.5 * s, cy + 4 * s, cx + 1.5 * s, cy + 6 * s], fill=YELLOW_DARK)
    draw.ellipse([cx - 0.8 * s, cy + 4.5 * s, cx - 0.2 * s, cy + 5.3 * s], fill=BROWN_DARK)
    draw.ellipse([cx + 0.2 * s, cy + 4.5 * s, cx + 0.8 * s, cy + 5.3 * s], fill=BROWN_DARK)

    # ===== Smile =====
    draw.arc(
        [cx - 2.5 * s, cy + 2 * s, cx + 2.5 * s, cy + 5 * s],
        10, 170,
        fill=BLACK,
        width=max(1, int(s * 0.8))
    )


def draw_decorations(draw, size, scale):
    """Draw small decorative stars and hearts around the giraffe."""
    s = scale

    # Stars — top-left area
    draw_star(draw, size * 0.18, size * 0.15, s * 1.2, STAR_GOLD, 200)
    draw_star(draw, size * 0.82, size * 0.18, s * 0.8, STAR_GOLD, 180)
    draw_star(draw, size * 0.12, size * 0.55, s * 0.6, STAR_GOLD, 150)
    draw_star(draw, size * 0.88, size * 0.5, s * 0.5, STAR_GOLD, 140)

    # Tiny hearts — bottom area
    draw_heart(draw, size * 0.2, size * 0.85, s * 0.6, BLUSH, 160)
    draw_heart(draw, size * 0.8, size * 0.82, s * 0.5, BLUSH, 140)


def make_icon(size, path, rounded=True):
    """Create an icon with gradient background, giraffe, and decorations."""
    # Create gradient background
    img = create_gradient_bg(size)
    draw = ImageDraw.Draw(img)

    # Apply rounded corners
    if rounded:
        mask = Image.new('L', (size, size), 0)
        mask_draw = ImageDraw.Draw(mask)
        radius = int(size * 0.22)
        mask_draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
        img.putalpha(mask)

    # Scale factor for the giraffe
    scale = size / 32.0 * 1.15

    # Draw decorations (behind giraffe)
    draw_decorations(draw, size, scale)

    # Draw giraffe (centered, slightly above center for better composition)
    draw_giraffe(draw, size // 2, int(size * 0.46), scale)

    # Add subtle inner border for definition
    if rounded:
        border_draw = ImageDraw.Draw(img)
        radius = int(size * 0.22)
        border_draw.rounded_rectangle(
            [1, 1, size - 2, size - 2],
            radius=radius,
            outline=(244, 169, 64, 60),
            width=max(1, size // 128)
        )

    img.save(path, 'PNG')
    print(f"Generated {path} ({size}x{size})")


# ===== Output directory =====
out_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
os.makedirs(out_dir, exist_ok=True)

# ===== Generate PWA + Android icons =====
sizes = [72, 96, 128, 144, 152, 192, 384, 512]
for s in sizes:
    make_icon(s, os.path.join(out_dir, f"icon-{s}x{s}.png"), rounded=True)

# ===== Favicon (square, no rounding) =====
make_icon(32, os.path.join(out_dir, "favicon-32x32.png"), rounded=False)

# ===== Android adaptive icon foreground (transparent background) =====
for s in [192, 432]:
    img = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    scale = s / 32.0 * 0.95
    # Draw decorations with lower opacity for adaptive icon
    draw_decorations(draw, s, scale)
    draw_giraffe(draw, s // 2, int(s * 0.46), scale)
    img.save(os.path.join(out_dir, f"adaptive-foreground-{s}x{s}.png"), 'PNG')
    print(f"Generated adaptive-foreground-{s}x{s}.png")

print("\nAll icons generated successfully!")
