import { resolve } from "node:path";
import { glob } from "glob";
import { tsImport } from "tsx/esm/api";
import type * as Js from "./builderTypes.js";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type FoundContentType = {
  path: string;
  contentType: Js.ContentType;
};

function isContentType(obj: unknown): obj is Js.ContentType {
  return typeof obj === "object" && obj !== null && "key" in obj;
}

/** Finds a list of content types in a given glob */
export async function findContentTypes(
  pattern: string,
  cwd: string
): Promise<FoundContentType[]> {
  const files = await glob(pattern, { cwd });

  const found: FoundContentType[] = [];
  for (const f of files) {
    const loaded = await tsImport(resolve(f), cwd);

    // Traverse every exported object
    for (const k in loaded) {
      const obj = loaded[k];
      if (isContentType(obj)) {
        found.push({
          path: f,
          contentType: obj,
        });
      }
    }
  }

  return found;
}
