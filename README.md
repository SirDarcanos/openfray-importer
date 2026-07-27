# OpenFray Importer

A browser extension that reads a **D&D Beyond monster page** and outputs an
**OpenFray `Creature` JSON** you can import into [OpenFray](https://openfray.app),
so monsters don't have to be re-typed by hand.

Open a monster's **Details** page, click the extension, and copy or download the
JSON. Spell references, structured attacks/saves, recharge, legendary actions, and
the flavor description are all mapped into OpenFray's schema.

## Install

```bash
npm install
npm run build           # Chrome  → output/chrome-mv3
npm run build:firefox   # Firefox → output/firefox-mv2
```

- **Chrome:** `chrome://extensions` → enable Developer mode → **Load unpacked** →
  `output/chrome-mv3`.
- **Firefox:** `about:debugging` → This Firefox → **Load Temporary Add-on** →
  `output/firefox-mv2/manifest.json`.

## Package for the stores

```bash
npm run zip           # Chrome  → output/openfray-ddb-import-<version>-chrome.zip
npm run zip:firefox   # Firefox → output/openfray-ddb-import-<version>-firefox.zip
```

Always use these, never the Finder's **Compress** on the build folder: macOS writes
resource-fork siblings into the archive (`__MACOSX/._*`), and AMO flags every one of
them as a hidden file.

Then open a monster's Details page on D&D Beyond and click the extension.

## Develop

```bash
npm run dev          # Chrome, live reload (keep this running)
npm run dev:firefox  # Firefox, live reload
npm test             # converter unit tests (node --test)
npm run compile      # tsc --noEmit
npm run icons        # regenerate public/icon/*.png from assets/icon.svg
```

The converter is `utils/statBlockToCreature.ts`; the scraping lives in
`utils/extractstatblock.ts` (2014 layout) and `utils/get2024statblock.ts` (2024).

### Limitations

- **Monster spellcasting** is parsed into OpenFray's structured spellcasting block
  for both editions: 2024 spellcasting actions, and 2014 spellcasting **traits** —
  innate (at-will / N-per-day) and prepared-slot casters alike.
- **Mythic actions** aren't mapped (OpenFray's schema has no equivalent).
- **Edition** is inferred from the page layout (2024 → 5.5, otherwise 5.0).
- The flavor description keeps headings, lists, and paragraphs; inline emphasis
  (bold/italic) is not preserved.

## Legal

This extension is an unofficial fan tool. It is **not affiliated with, endorsed,
sponsored, or approved by Wizards of the Coast or D&D Beyond.** *Compatible with
fifth edition.*

It ships **no game content** — no monster, spell, or other stat data is bundled in
this repository. It only reads the page you are currently viewing in your own
browser and reformats it into OpenFray's schema on your machine. Game content
remains the property of its respective rights holders, and you are responsible for
using it in accordance with D&D Beyond's Terms of Use and applicable copyright law.

## License

Released under the [MIT License](./LICENSE).
