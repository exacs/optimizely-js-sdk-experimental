import type { components } from "./open-api/schema.js";

type JsonConfig = components["schemas"]["Manifest"];
type JsonContentType = components["schemas"]["ContentType"];

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

export function buildConfig(jsConfig: JsConfig): JsonConfig {
  const output: JsonConfig = {};

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
