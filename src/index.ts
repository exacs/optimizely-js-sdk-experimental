import type * as Json from "./utils/restApiSchema/manifest.js";

namespace Js {
  export namespace ContentTypes {
    export type All = Omit<Json.ContentType, "key" | "properties"> & {
      baseType: NonNullable<Json.ContentType["baseType"]>;
      properties?: Record<string, Js.ContentTypeProperties.All>;
    };
  }

  export namespace ContentTypeProperties {
    export type All = Array | NonArray;
    export type Array = {
      type: "array";
      items: NonArray;
    };

    // Note: ContentTypeProperties other than `Content` (e.g. String, ...)
    // are defined in the Json manifest
    export type NonArray = Json.ContentTypeProperties.String | Content;

    export type Content = Json.ContentTypeProperties.Base & {
      type: "content";
      allowedTypes?: (Js.ContentTypes.All | string)[];
      restrictedTypes?: (Js.ContentTypes.All | string)[];
    };
  }
}

type JsConfig = {
  contentTypes?: Record<string, Js.ContentTypes.All>;
};

/** Find `value` in a key:value `object` and return its key. Returns `undefined` if not found  */
function findKey<T>(value: T, object: Record<string, T>) {
  return Object.keys(object).find((k) => object[k] === value);
}

/**
 * Given an `object` and a `value`, returns:
 * - `value` if it's a string
 * - the key in the object where its value is equal to `value`
 */
const toStringMapper =
  <T>(object: Record<string, T>) =>
  (value: T | string, index: number) => {
    if (typeof value === "string") {
      return value;
    }

    const key = findKey(value, object);

    if (!key) {
      // TODO: serialize
      throw new Error(
        `Wrong value ${index}. The element is not present in object`
      );
    }

    return key;
  };

/** Converts a "JS" content type property to a "JSON" content type property */
function convertContentType(
  value: Js.ContentTypeProperties.NonArray,
  allContentTypes: Record<string, Js.ContentTypes.All>
): Json.ContentTypeProperties.NonArray {
  if (value.type !== "content") {
    return value;
  }

  const { allowedTypes, restrictedTypes } = value;

  return {
    type: "content",
    allowedTypes: allowedTypes?.map(toStringMapper(allContentTypes)),
    restrictedTypes: restrictedTypes?.map(toStringMapper(allContentTypes)),
  };
}

export function buildConfig(jsConfig: JsConfig): Json.Manifest {
  const output: Json.Manifest = {};
  output.contentTypes = [];

  if (jsConfig.contentTypes) {
    for (const key in jsConfig.contentTypes) {
      const { baseType, properties } = jsConfig.contentTypes[key];
      const outputProperties: Record<string, Json.ContentTypeProperties.All> =
        {};

      for (const k in properties) {
        if (properties[k].type === "array") {
          outputProperties[k] = {
            type: "array",
            items: convertContentType(
              properties[k].items,
              jsConfig.contentTypes
            ),
          };
        } else {
          outputProperties[k] = convertContentType(
            properties[k],
            jsConfig.contentTypes
          );
        }
      }

      output.contentTypes.push({
        key,
        baseType,
        properties: outputProperties,
      });
    }
  }

  return output;
}

// Defines a content type
export function buildContentType(js: Js.ContentTypes.All): Js.ContentTypes.All {
  return js;
}
