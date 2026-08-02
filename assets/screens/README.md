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
wired into the click-to-enlarge gallery on the homepage (served straight from
`theobscyranarchives.net/assets/screens/…`). Wiring one in is a single entry in
`PCO.screens` in `assets/site.js`; an empty list hides the gallery entirely.

## Generating scenery shots from the game

The current gallery images were rendered from the live map data rather than
captured by hand. In the **pokecyrusonline** repo:

```bash
npm run render:map -- --list                    # every renderable map id
npm run render:map -- legacy.pco.map0050 --jpeg --width=1600 --name=01-ocana-town
```

Output lands in `tools/output/map-previews/`; copy it here. This gives the world
with no HUD or player — good for scenery. For shots that show the game being
*played*, a real screenshot with the interface in frame is the better source.
