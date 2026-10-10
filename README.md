# Team Aurora — NASA Space Journey

An interactive space-exploration experience for discovering the Solar System and learning about NASA's lunar missions. The project is built with plain HTML, CSS, and JavaScript.

## Explore the project

- **Introduction** (`index.html`): A five-part story with an image carousel and a link into the Solar System.
- **Solar System** (`Space/space.html`): Pan and zoom through an animated Solar System, select planets to learn basic facts, and open the Moon or Mars pages.
- **Moon museum** (`Moon/moon.html`): Explore a lunar surface map, mission timeline, hardware locations, and mission stories with related images and source links.
- **Mars** (`Mars/mars.html`): A placeholder page; the exhibition is still under construction.

The pages include responsive controls for smaller screens. The Space and Moon transitions also respect the device's reduced-motion preference.
Stories are text-only; spoken narration is disabled.

## Languages

Use the **বাংলা / English** control in the upper-right corner to switch languages. The selection is saved in the browser and carried between pages. The introduction story, Solar System interface and planet details, Moon museum controls and mission stories, and Mars placeholder page are available in English and Bangla. Bengali fonts are loaded from Google Fonts when online; compatible system fonts are used as a fallback.

## Open the project

No package installation, build step, or local server is required.

1. Keep the project folders together in their existing structure.
2. Open `index.html` directly in a web browser (for example, double-click it in File Explorer).
3. Use the on-page controls to continue into the Solar System, Moon, and Mars pages.

The site uses relative file paths for its pages and local assets. Google Fonts and external NASA links require an internet connection; if a browser restricts local files, try another browser or use a local server as an optional fallback.

## Files to review before sharing

The following files are not needed to run the website. They are marked as candidates to exclude from a website-only upload; they have **not** been deleted. Keep them if you want to retain original downloads or rebuild the lunar map.

| Candidate | Why it may be excluded |
| --- | --- |
| `Moon/moon stories.zip` | Archive of the mission images already extracted under `Moon/moon stories/moon stories/`. |
| `Moon/go-pmtiles_1.31.2_Windows_x86_64.zip` and `Moon/go-pmtiles_1.31.2_Windows_x86_64/pmtiles.exe` | Downloaded Windows map-conversion tool; the website does not execute it. |
| `Moon/moon_tile_build/moon.mbtiles` | Intermediate map database used when building the surface image. |
| `Moon/moon_tile_build/moon.pmtiles` | Duplicate of `Moon/data/moon.pmtiles`; the website does not load either PMTiles file. |
| `Moon/moon_tile_build/moon_surface.jpg` | Duplicate of the runtime image at `Moon/data/moon_surface.jpg`. |
| `images/240s.mp4`, `Moon/moon stories/moon stories/Apollo_11_moonwalk_montage_720p~orig.mov`, and `Moon/moon stories/moon stories/Ranger 7.docx` | Not referenced by the current pages. |
| `Moon/moon stories/moon stories/~$nger 7.docx` | Temporary Microsoft Office lock file. |
| `images/neptune.png`, `images/pluto.png`, and `images/uranus.png` | Not used by the current Solar System page. |
| `Moon/moon_images/LCROSS.png`, `Moon/moon_images/Lunal Oriber.png`, `Moon/moon_images/Mercury.png`, `Moon/moon_images/Ranger 7.png`, `Moon/moon_images/Surveyor 3.png`, and `Moon/moon_images/Surveyor 7.png` | Not referenced by the current pages. |

The scripts in `Moon/moon_tile_build/` are development tools rather than website runtime files. Review them separately before excluding that folder.

## Project structure

```text
Team_Aurora/
├── index.html                  # Intro story
├── language.js                 # Site-wide language switch and translations
├── images/                     # Shared Solar System imagery
├── Mars/                       # Mars placeholder page
├── Moon/
│   ├── moon.html               # Lunar museum
│   ├── moon.css
│   ├── moon.js
│   ├── moon_data.js            # Lunar mission and story data
│   ├── moon_data_bn.js         # Bangla mission stories and science summaries
│   ├── data/                   # Lunar map assets and geographic data
│   ├── moon_images/            # Mission imagery
│   └── moon_tile_build/        # Lunar map tile preparation scripts and data
├── Museum_of_the_Abandoned/    # Intro story styles, behavior, Bangla text, and images
└── Space/                      # Solar System page, styles, and behavior
```

The Moon page loads its typefaces from Google Fonts, so those fonts require an internet connection. The rest of the project is a static site and does not require a backend.
