import { deregisterAllFonts, registerFont } from "canvas";
import { glob } from "glob";

deregisterAllFonts();

const noto = await glob("node_modules/@fontsource/noto-*/files/*-400-normal.woff");

console.log("Loading fonts");
for (const font of noto) {
  const family = font.split("/").slice(2, 3)[0]!;
  registerFont(font, { family });
}

console.log("Fonts loaded");

export const FAMILIES = noto.map((font) => JSON.stringify(font.split("/").slice(2, 3)[0]!));
