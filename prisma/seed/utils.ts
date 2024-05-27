import { copycat } from "@snaplet/copycat";

/*
 * Deterministic cuid "like" id
 */
export const cuid = (
  input: string,
  options: { length?: number } = { length: 25 },
) => {
  const length = options.length || 25; // Length of the desired cuid

  return copycat.someOf(input, [length, length], alphaNumAlphabet).join("");
};

const alphaNumAlphabet = Array.from({ length: 36 }, (x, i) =>
  i < 10 ? String(i) : String.fromCharCode(i + 87),
);

/*
 * Deterministic tzbd permalink slug
 */
export const permaLink = (name: string) => {
  return "Z" + cuid(name, { length: 5 }).toUpperCase();
};
