"""
Builds the web-ready brand assets from the two files the hospital supplied.

    python scripts/brand-assets.py

Sources (kept in brand/source/, never served):
    logo.png      the full lockup - mark, "Brahmanandam Hospital", EKG rule and
                  "Multi Speciality Centre Sonari"
    fav_icon.png  the heart-and-hands mark on its own

Both arrive as flat ~1 MB RGB PNGs on a white background. Served as they are,
the header would cost a megabyte on every page, and the white box would show on
anything that is not pure white - the tinted sticky header, the navy footer.
So this script:

  - lifts the white out to real transparency, and un-mixes the white from the
    anti-aliased edges so no pale fringe is left on a tinted background
  - trims to the artwork and adds an even margin
  - writes each asset at the sizes the site actually renders, plus a white
    knock-out of the lockup for the navy footer
"""

from pathlib import Path

from PIL import Image

try:
    import numpy as np
except ImportError:  # pragma: no cover - the pure-Python path is just slower
    np = None

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "brand" / "source"
OUT = ROOT / "public" / "brand"

# Pixels this close to white are paper, not ink: the supplied files carry a
# faint off-white (253-254) that would otherwise become a haze over everything.
FLOOR = 10
# Over this distance from white the edge ramps from transparent to opaque.
SOFT = 46


def source(name):
    for candidate in (SRC / name, ROOT / name):
        if candidate.exists():
            return candidate
    raise SystemExit(f"missing source file: {name}")


def lift_white(im):
    """White to transparent, keeping the true ink colour on soft edges."""
    rgb = im.convert("RGB")
    if np is not None:
        a = np.asarray(rgb).astype(np.float32)
        # Distance from white is set by the darkest channel: blue and red ink
        # and the grey tagline all have at least one low channel.
        dist = 255.0 - a.min(axis=2)
        alpha = np.clip((dist - FLOOR) / SOFT, 0.0, 1.0)
        safe = np.where(alpha > 0, alpha, 1.0)[..., None]
        ink = (a - 255.0 * (1.0 - alpha[..., None])) / safe
        ink = np.clip(ink, 0, 255)
        out = np.dstack([ink, alpha * 255.0]).round().astype(np.uint8)
        out[alpha <= 0] = 0
        return Image.fromarray(out, "RGBA")

    w, h = rgb.size
    src = rgb.load()
    out = Image.new("RGBA", (w, h))
    dst = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = src[x, y]
            al = max(0.0, min(1.0, ((255 - min(r, g, b)) - FLOOR) / SOFT))
            if al <= 0:
                dst[x, y] = (0, 0, 0, 0)
                continue
            un = lambda c: max(0, min(255, round((c - 255 * (1 - al)) / al)))
            dst[x, y] = (un(r), un(g), un(b), round(al * 255))
    return out


def trim(im, pad_ratio):
    """Crop to the artwork, then add an even transparent margin."""
    bbox = im.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox()
    art = im.crop(bbox)
    pad = round(max(art.size) * pad_ratio)
    canvas = Image.new("RGBA", (art.width + 2 * pad, art.height + 2 * pad))
    canvas.paste(art, (pad, pad), art)
    return canvas


def square(im, pad_ratio, background=None):
    """Centre the artwork on a square canvas, optionally on a solid colour."""
    side = round(max(im.size) * (1 + 2 * pad_ratio))
    fill = background + (255,) if background else (0, 0, 0, 0)
    canvas = Image.new("RGBA", (side, side), fill)
    canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2), im)
    return canvas


def by_height(im, height):
    width = round(im.width * height / im.height)
    return im.resize((width, height), Image.LANCZOS)


def knock_out_white(im):
    """Every inked pixel to white, keeping the alpha - for the navy footer."""
    white = Image.new("RGBA", im.size, (255, 255, 255, 255))
    white.putalpha(im.getchannel("A"))
    return white


def save(im, name, **opts):
    path = OUT / name
    if name.endswith(".webp"):
        im.save(path, "WEBP", quality=90, method=6, **opts)
    elif name.endswith(".ico"):
        im.save(path, "ICO", **opts)
    else:
        if im.mode == "RGBA" and im.getchannel("A").getextrema() == (255, 255):
            im = im.convert("RGB")
        im.save(path, "PNG", optimize=True, **opts)
    kb = path.stat().st_size / 1024
    size = f"{im.width}x{im.height}" if not name.endswith(".ico") else "16/32/48"
    print(f"  {name:<32} {size:>10}  {kb:7.1f} KB")


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    # ------------------------------------------------------------ lockup ---
    lockup = trim(lift_white(Image.open(source("logo.png"))), pad_ratio=0.02)
    print(f"lockup artwork {lockup.width}x{lockup.height}, "
          f"aspect {lockup.width / lockup.height:.3f}")

    # Header renders it about 48px tall; 3x covers every phone screen.
    for h in (144,):
        save(by_height(lockup, h), f"logo-{h}.webp")
        save(by_height(lockup, h), f"logo-{h}.png")
    white = knock_out_white(lockup)
    save(by_height(white, 144), "logo-white-144.webp")
    save(by_height(white, 144), "logo-white-144.png")
    # Structured data and link previews want a larger raster.
    save(by_height(lockup, 360), "logo-360.png")

    # -------------------------------------------------------------- mark ---
    mark = trim(lift_white(Image.open(source("fav_icon.png"))), pad_ratio=0.0)
    print(f"mark artwork {mark.width}x{mark.height}")

    transparent = square(mark, pad_ratio=0.04)
    save(transparent.resize((192, 192), Image.LANCZOS), "mark-192.webp")
    save(transparent.resize((192, 192), Image.LANCZOS), "mark-192.png")

    # Browser tab icons. A little less margin so the mark reads at 16px.
    tab = square(mark, pad_ratio=0.02)
    for s in (16, 32, 48):
        save(tab.resize((s, s), Image.LANCZOS), f"favicon-{s}.png")
    tab.resize((48, 48), Image.LANCZOS).save(
        OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print(f"  {'favicon.ico':<32} {'16/32/48':>10}  "
          f"{(OUT / 'favicon.ico').stat().st_size / 1024:7.1f} KB")

    # iOS paints a transparent touch icon on black, so this one is opaque white.
    save(square(mark, pad_ratio=0.12, background=(255, 255, 255))
         .resize((180, 180), Image.LANCZOS), "apple-touch-icon.png")

    # Web app manifest: "any" icons, and a maskable one whose artwork stays
    # inside the 80% safe zone Android crops to.
    for s in (192, 512):
        save(transparent.resize((s, s), Image.LANCZOS), f"icon-{s}.png")
    save(square(mark, pad_ratio=0.22, background=(255, 255, 255))
         .resize((512, 512), Image.LANCZOS), "icon-512-maskable.png")


if __name__ == "__main__":
    main()
