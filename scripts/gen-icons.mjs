// Rasterize assets/icon.svg into the extension's PNG icons.
// Run: node scripts/gen-icons.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const SIZES = [16, 19, 38, 48, 64, 128];
const svg = readFileSync(new URL("../assets/icon.svg", import.meta.url));
mkdirSync(new URL("../public/icon/", import.meta.url), { recursive: true });

for (const size of SIZES) {
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
  })
    .render()
    .asPng();
  writeFileSync(new URL(`../public/icon/${size}.png`, import.meta.url), png);
  console.log(`wrote public/icon/${size}.png`);
}
