import type { ContentType, Config } from "./builderTypes.js";

export function buildContentType<T extends ContentType>(def: T): T {
  return def;
}

export function buildConfig(manifest: Config): Config {
  return manifest;
}
