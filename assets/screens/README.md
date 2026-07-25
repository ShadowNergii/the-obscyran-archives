# In-game screenshots

Drop homepage gallery screenshots in this folder.

**Format & size (for fast loading):**
- JPG or WebP, roughly **1600px wide** (landscape gameplay shots work best in the grid)
- Keep each file a few hundred KB where possible (well under Cloudflare Pages' 25 MB/file limit)

**Naming:** number them in display order, with a short slug, e.g.
- `01-power-plant.jpg`
- `02-ocana-hub.jpg`
- `03-team-rocket-saga.jpg`

**Then tell Claude** the filenames and an optional caption for each, and they'll be
wired into a themed, click-to-enlarge gallery section on the homepage
(served straight from `theobscyranarchives.net/assets/screens/…`).
