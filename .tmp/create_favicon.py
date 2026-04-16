from pathlib import Path
import math
import struct

root = Path('/Users/mac/Desktop/hildam')


def clamp(v):
    return max(0, min(255, int(v)))


def lerp(a, b, t):
    return a + (b - a) * t


def mix(c1, c2, t):
    return tuple(clamp(lerp(c1[i], c2[i], t)) for i in range(4))


def smoothstep(edge0, edge1, x):
    if edge0 == edge1:
        return 1.0 if x >= edge1 else 0.0
    t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)


def rounded_rect_mask(x, y, x0, y0, x1, y1, r):
    dx = max(x0 - x, 0, x - x1)
    dy = max(y0 - y, 0, y - y1)
    if dx == 0 and dy == 0:
        return 1.0
    if dx > 0 and dy > 0:
        return 1.0 if (dx * dx + dy * dy) <= r * r else 0.0
    if dx > 0:
        return 1.0 if dx <= r else 0.0
    if dy > 0:
        return 1.0 if dy <= r else 0.0
    return 0.0


def line_mask(x, y, x0, y0, x1, y1, width):
    px = x - x0
    py = y - y0
    vx = x1 - x0
    vy = y1 - y0
    denom = vx * vx + vy * vy
    if denom == 0:
        dist2 = px * px + py * py
    else:
        t = max(0.0, min(1.0, (px * vx + py * vy) / denom))
        lx = x0 + vx * t
        ly = y0 + vy * t
        dist2 = (x - lx) ** 2 + (y - ly) ** 2
    return 1.0 if dist2 <= (width * width) else 0.0


def circle_mask(x, y, cx, cy, r):
    return 1.0 if ((x - cx) ** 2 + (y - cy) ** 2) <= r * r else 0.0


def render(size):
    pixels = []
    for y in range(size):
        for x in range(size):
            t = y / (size - 1)
            bg = mix((18, 18, 24, 255), (234, 88, 28, 255), t)

            # Outer rounded board
            mx = size * 0.06
            my = size * 0.06
            rr = size * 0.19
            board = rounded_rect_mask(x, y, mx, my, size - mx, size - my, rr)
            if board:
                shadow = rounded_rect_mask(x - size * 0.02, y - size * 0.02, mx, my, size - mx, size - my, rr)
                if shadow:
                    bg = mix(bg, (0, 0, 0, 255), 0.12)

                border = rounded_rect_mask(x, y, mx + 1.5, my + 1.5, size - mx - 1.5, size - my - 1.5, rr - 1.5)
                if border:
                    bg = mix(bg, (255, 255, 255, 255), 0.04)

            # Monogram H
            accent = (255, 191, 71, 255)
            ivory = (255, 248, 240, 255)
            shadow_a = 0.32
            h_left = rounded_rect_mask(x, y, size * 0.27, size * 0.22, size * 0.38, size * 0.77, size * 0.045)
            h_right = rounded_rect_mask(x, y, size * 0.62, size * 0.22, size * 0.73, size * 0.77, size * 0.045)
            h_bar = rounded_rect_mask(x, y, size * 0.35, size * 0.47, size * 0.65, size * 0.56, size * 0.035)
            h_shadow = rounded_rect_mask(x - size * 0.02, y - size * 0.02, size * 0.27, size * 0.22, size * 0.73, size * 0.77, size * 0.045)

            # Needle + thread motif
            needle = line_mask(x, y, size * 0.76, size * 0.22, size * 0.89, size * 0.10, size * 0.012)
            eye = circle_mask(x, y, size * 0.75, size * 0.21, size * 0.03)
            thread1 = line_mask(x, y, size * 0.84, size * 0.16, size * 0.93, size * 0.20, size * 0.007)
            thread2 = line_mask(x, y, size * 0.93, size * 0.20, size * 0.89, size * 0.27, size * 0.007)
            thread3 = line_mask(x, y, size * 0.89, size * 0.27, size * 0.79, size * 0.31, size * 0.007)

            if h_shadow and (h_left or h_right or h_bar):
                bg = mix(bg, (0, 0, 0, 255), shadow_a)

            if h_left or h_right or h_bar:
                bg = mix(bg, accent, 1.0)
                # inner cut for a crisp, premium look
                inner_left = rounded_rect_mask(x, y, size * 0.31, size * 0.27, size * 0.34, size * 0.72, size * 0.018)
                inner_right = rounded_rect_mask(x, y, size * 0.66, size * 0.27, size * 0.69, size * 0.72, size * 0.018)
                inner_bar = rounded_rect_mask(x, y, size * 0.38, size * 0.49, size * 0.62, size * 0.54, size * 0.014)
                if inner_left or inner_right or inner_bar:
                    bg = mix(bg, ivory, 1.0)

            if needle or eye:
                bg = mix(bg, ivory, 1.0)
            if thread1 or thread2 or thread3:
                bg = mix(bg, (255, 214, 128, 255), 1.0)

            # Bottom stitch marks
            for sx in [0.25, 0.37, 0.49, 0.61, 0.73]:
                if abs(x - size * sx) <= size * 0.018 and abs(y - size * 0.88) <= size * 0.006:
                    bg = mix(bg, ivory, 0.65)

            pixels.append(bg)
    return pixels


def encode_bmp_rgba(pixels, size):
    # 32-bit BGRA bottom-up DIB with a zero alpha mask.
    header = struct.pack('<IIIHHIIIIII', 40, size, size * 2, 1, 32, 0, 0, 0, 0, 0, 0)
    pixel_bytes = bytearray()
    for y in range(size - 1, -1, -1):
        for x in range(size):
            r, g, b, a = pixels[y * size + x]
            pixel_bytes += bytes((b, g, r, a))

    mask_row_bytes = ((size + 31) // 32) * 4
    mask = bytes(mask_row_bytes * size)
    return header + pixel_bytes + mask


def write_ico(path, sizes):
    images = []
    for s in sizes:
        images.append((s, encode_bmp_rgba(render(s), s)))

    count = len(images)
    header = struct.pack('<HHH', 0, 1, count)
    directory = bytearray()
    offset = 6 + 16 * count
    for s, data in images:
        w = s if s < 256 else 0
        h = s if s < 256 else 0
        directory += struct.pack('<BBBBHHII', w, h, 0, 0, 1, 32, len(data), offset)
        offset += len(data)

    with open(path, 'wb') as f:
        f.write(header)
        f.write(directory)
        for _, data in images:
            f.write(data)


for target in [root / 'app' / 'favicon.ico', root / 'public' / 'favicon.ico', root / 'favicon.ico']:
    write_ico(target, [16, 32, 64])

print('favicon generated')
