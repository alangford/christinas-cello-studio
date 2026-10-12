import manifest from "./images.json";

export type ImageKey = keyof typeof manifest;

export function image(key: ImageKey) {
  return manifest[key];
}
