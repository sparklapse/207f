import { createCanvas } from "canvas";
import { sql } from "bun";

import { FAMILIES } from "./load-fonts";
import { RANGES } from "./unicode";

const WIDTH = 300;
const HEIGHT = 100;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext("2d");

ctx.font = `74px ${FAMILIES.join(", ")}`;
ctx.fillStyle = "white";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

function getCanvasValue() {
  const pixels = ctx
    .getImageData(0, 0, WIDTH, HEIGHT).data.filter((_, idx) => (idx % 4) === 3);

  let textValue = 0;
  for (let p = 0; p < WIDTH * HEIGHT; p += 1) {
    textValue += pixels[p]! / 255;
  }
  return textValue;
};

function calcDifference(a: string, b: string) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.globalCompositeOperation = "source-over";
  ctx.fillText(a, WIDTH / 2, HEIGHT / 2, WIDTH);
  const textValue = getCanvasValue();
  if (textValue <= 0) return -1;

  ctx.globalCompositeOperation = "xor";
  ctx.fillText(b, WIDTH / 2, HEIGHT / 2, WIDTH);
  const xorValue = getCanvasValue();

  return xorValue / textValue;
}

function findBest(char: string) {
  let best = {
    char: "",
    code: -1,
    diff: Infinity,
  };
  for (let i = 0x21; i < 0x7f; i++) {
    const diff = calcDifference(char, String.fromCodePoint(i));
    if (diff < 0) {
      best.char = "";
      best.diff = diff;
      break;
    }

    if (diff < best.diff) {
      best.char = String.fromCharCode(i);
      best.code = i;
      best.diff = diff;
    }
  }
  return best;
}

for (const range of RANGES.slice(2)) {
  for (let i = range.start; i <= range.end; i++) {
    const best = findBest(String.fromCharCode(i));
    if (best.diff < 1) {
      await sql`
        INSERT INTO contrib.translation (
          user_id,
          created,
          code,
          translation,
          difference
        ) VALUES (
          ${import.meta.env.AS_USER},
          ${new Date()},
          ${i},
          ${best.char},
          ${best.diff}
        )`;
    }
  }
}
