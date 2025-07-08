import blocksRaw from "./unicode_blocks.csv?raw";
import charactersRaw from "./unicode_characters.csv?raw";

export const blocks = blocksRaw
  .split("\n")
  .filter((line) => !!line)
  .map((line) => {
    const [label, start, end] = line.split(",");
    return {
      label,
      start: parseInt(start),
      end: parseInt(end),
    };
  });

export function getBlockForCode(code: number) {
  return blocks.filter((block) => code >= block.start && code <= block.end).at(0);
}

export const characters = charactersRaw
  .split("\n")
  .map((line) => {
    const [code, label] = line.split(",");
    return {
      code: parseInt(code),
      label,
    };
  })
  .reduce((map, current) => {
    map.set(current.code, current.label);
    return map;
  }, new Map<number, string>());

export const TOTAL_CODES = blocks.reduce((count, block) => {
  return count + (block.end - block.start);
}, 0);
