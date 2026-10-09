# -*- coding: utf-8 -*-
import os
from PIL import Image
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'portfolio', 'cioccolato')
MAP = {
 'fronte cioccolato.jpg': 'cioccolato-fronte-90.webp',
 'esploso cioccolato.jpg': 'cioccolato-retro-esploso.webp',
 'cioccolato logo.jpg': 'cioccolato-logo.webp',
 'Chocolate Bars Mockup.jpg': 'cioccolato-mockup-barrette.webp',
 'default.jpg': 'cioccolato-moodboard-botanica.webp',
 'Screenshot 2026-10-08 at 12-57-43 Instagram.png': 'cioccolato-moodboard-pattern.webp',
}
for old, new in MAP.items():
    o, n = os.path.join(D, old), os.path.join(D, new)
    im = Image.open(o).convert('RGB')
    if im.width > 1600:
        im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
    im.save(n, 'WEBP', quality=82, method=6)
    print('%-45s -> %-38s %dx%d %dKB' % (old[:45], new, im.width, im.height, os.path.getsize(n) // 1024))
    os.remove(o)
    print('  rimosso originale')
