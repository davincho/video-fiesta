import lzString from "lz-string";

export function encode(input: object) {
  return lzString.compressToEncodedURIComponent(JSON.stringify(input));
}

export function decode(input: string) {
  if (!input) {
    return {};
  }

  return JSON.parse(lzString.decompressFromEncodedURIComponent(input));
}
