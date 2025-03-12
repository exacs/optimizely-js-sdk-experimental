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
  properties?: Record<string, ContentTypeProperty["All"]>;
}

export type ContentTypeProperty = {
  All: ContentTypeProperty["Boolean"] | ContentTypeProperty["Binary"];
  Base: {
    format?: string;
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
  Content: {};
  ContentReference: {};
  DateTime: {};
  Float: {};
  Integer: {};
  String: {
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
