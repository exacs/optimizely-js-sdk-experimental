import type { ContentType as JsonContentType } from "./utils/restApiSchema/manifest.js";
import type { Manifest } from "./utils/restApiSchema/manifest.js";

type JsConfig = {
  contentTypes?: {
    [k: string]: Omit<
      JsonContentType,
      "key" | "lastModified" | "lastModifiedBy" | "created"
    > & {
      baseType: NonNullable<JsonContentType["baseType"]>;
    };
  };
};

export function buildConfig(jsConfig: JsConfig): Manifest {
  const output: Manifest = {};

  if (jsConfig.contentTypes) {
    for (const key in jsConfig.contentTypes) {
      output.contentTypes = [];
      const contentType = jsConfig.contentTypes[key];

      if (contentType) {
        output.contentTypes.push({
          key,
          ...contentType,
        });
      }
    }
  }

  return output;
}
