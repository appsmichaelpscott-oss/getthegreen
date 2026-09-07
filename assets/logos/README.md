# Brand Logos

Drop each brand's logo file here, named **exactly** as shown below —
the site automatically shows it once the file exists, with zero code
changes needed. If a file isn't here yet, that brand just keeps showing
its colored-initials badge like it does now — nothing breaks either way.

## Exact filenames needed (22 total)

```
trulieve.png                    (Trulieve)
muv.png                         (MUV (Verano))
curaleaf.png                    (Curaleaf)
ayr-cannabis-dispensary.png     (Ayr Cannabis Dispensary)
surterra-wellness.png           (Surterra Wellness)
green-dragon.png                (Green Dragon)
planet-13-florida.png           (Planet 13 Florida)
fluent.png                      (Fluent)
sunnyside.png                   (Sunnyside)
growhealthy.png                 (GrowHealthy)
sanctuary-cannabis.png          (Sanctuary Cannabis)
gti-florida.png                 (GTI Florida / Rise)
cookies-florida.png             (Cookies Florida)
mint-cannabis.png               (Mint Cannabis)
the-flowery.png                 (The Flowery)
jungle-boys.png                 (Jungle Boys)
sunburn.png                     (Sunburn)
goldflower-cannabis.png         (Goldflower Cannabis)
insa.png                        (Insa)
one-plant-cannabis.png          (One Plant Cannabis)
eden-florida.png                (Eden Florida)
fino-cannabis.png               (FINO Cannabis)
```

## Where to get each logo

Not something I can pull for you — every one of these is that company's
own trademarked material, so it needs to come from you directly. Easiest
sources per brand: their official site's press/media page (if they have
one), or a clean screenshot/save of their logo from their own homepage.
Avoid low-res or watermarked versions from random third-party listing
sites where possible.

## Format notes

- **PNG works best** — supports transparency, which matters here since
  the logo sits in a small rounded square next to colored UI elements.
  A logo with a white/solid background block will look boxy; transparent
  background blends in properly.
- Reasonably square logos work best in this slot (42×42px display size,
  scaled to fit) — a very wide horizontal logo will look small/awkward
  in this circular-ish space. If a brand's only available logo is a wide
  wordmark, that's fine too, it'll just render smaller within the square.
- No strict size requirement — the site scales whatever you provide down
  to fit, so even a large source file works fine.

## How the fallback works, technically

Each row tries to load `assets/logos/{brand-id}.png`. If that file
doesn't exist (404), the image silently hides itself and the existing
colored-initials badge (the "CU" style badge, same as today) shows in
its place instead — no broken-image icon, no visual glitch, just a
graceful drop back to what's already there. Add logos whenever you get
around to each one; there's no batch requirement to do all 22 at once.
