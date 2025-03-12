/** Re-Definition of the "Manifest", the JSON accepted in the endpoint POST /packages */
export type Manifest = {
  contentTypes?: ContentType[];
};

/** Content Type */
export interface ContentType {
  key: string;
  displayName?: string;
  baseType:
    | "page"
    | "component"
    | "media"
    | "image"
    | "video"
    | "folder"
    | "experience"
    | "section"
    | "element";
  properties?: Record<string, AllContentTypeProperties>;
}
export type AllContentTypeProperties =
  | ContentTypeProperty["String"]
  | ContentTypeProperty["Content"];

export type ContentTypeProperty = {
  Base: {
    // This should be different for each Content Type. In the spec is just "string" for all
    // format?: string;
    displayName?: string;
    description?: string;
    required?: boolean;
    localized?: boolean;
    group?: string;
    sortOrder?: number;
    // TODO
    indexingType?: {};
    editor?: string;
    editorSettings?: Record<string, Record<string, never>> | null;
  };
  Binary: ContentTypeProperty["Base"] & {
    type: "binary";
  };
  Boolean: ContentTypeProperty["Base"] & {
    type: "boolean";
  };
  Component: {};
  Content: ContentTypeProperty["Base"] & {
    type: "content";
    allowedTypes?: string[];
    restrictedTypes?: string[];
  };
  ContentReference: {};
  DateTime: {};
  Float: {};
  Integer: {};
  String: ContentTypeProperty["Base"] & {
    type: "string";

    // Not available in the schema:
    format?: "shortString" | "html";
    minLength?: number;
    maxLength?: number;
    enum?: {
      // TODO: Check the enums here
      values: { value: string; displayName: string }[];
    };
  };
  Url: {};
  JsonString: {};
  List: {};
};
