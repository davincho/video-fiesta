import lzString from "lz-string";

export function encode(input: object) {
  return lzString.compressToEncodedURIComponent(JSON.stringify(input));
}

export function decode(input: string) {
  if (!input) {
    return {};
  }

  try {
    const decoded = lzString.decompressFromEncodedURIComponent(input);

    if (decoded) {
      return JSON.parse(lzString.decompressFromEncodedURIComponent(input));
    }
  } catch (e) {}

  return {};
}
