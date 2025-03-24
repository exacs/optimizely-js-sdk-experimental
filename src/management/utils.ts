import { resolve } from "node:path";
import { glob } from "glob";
import { tsImport } from "tsx/esm/api";
import type * as Js from "./builderTypes.js";

export type FoundContentType = {
  path: string;
  contentType: Js.ContentType;
};

/** Finds a list of content types in a given glob */
export async function findContentTypes(
  pattern: string,
  cwd: string
): Promise<FoundContentType[]> {
  const files = await glob(pattern, { cwd });

  const found: FoundContentType[] = [];
  for (const f of files) {
    const loaded = await tsImport(resolve(f), cwd);

    if (loaded.default.optimizelyContentType) {
      const contentType = loaded.default.optimizelyContentType;
      found.push({
        path: f,
        contentType,
      });
    }
  }

  return found;
}
