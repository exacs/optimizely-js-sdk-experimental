import type * as Json from "./utils/restApiSchema/manifest.js";

namespace Js {
  export namespace ContentTypes {
    export type All = Omit<Json.ContentType, "key" | "properties"> & {
      baseType: NonNullable<Json.ContentType["baseType"]>;
      properties?: Record<string, Js.ContentTypeProperties.All>;
    };
  }

  export namespace ContentTypeProperties {
    export type Content = Json.ContentTypeProperties.Base & {
      type: "content";
      allowedTypes?: (Js.ContentTypes.All | string)[];
      restrictedTypes?: (Js.ContentTypes.All | string)[];
    };

    export type All = Json.ContentTypeProperties.String | Content;
  }
}

type JsConfig = {
  contentTypes?: Record<string, Js.ContentTypes.All>;
};

function convertContentType(
  value: Js.ContentTypeProperties.All,
  allContentTypes: Record<string, Js.ContentTypes.All>
): Json.ContentTypeProperties.All {
  if (value.type !== "content") {
    return value;
  }

  const allowedTypes = value.allowedTypes?.map((t, index) => {
    if (typeof t === "string") {
      return t;
    }

    // Should be a reference to some "allContentTypes"
    const foundKey = Object.keys(allContentTypes).find(
      (k) => allContentTypes[k] === t
    );

    if (!foundKey) {
      throw new Error(
        `Wrong value ${index}: the referenced type is not included in the manifest`
      );
    }

    return foundKey;
  });

  return {
    type: "content",
    allowedTypes,
    // restrictedTypes,
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
        outputProperties[k] = convertContentType(
          properties[k],
          jsConfig.contentTypes
        );
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
