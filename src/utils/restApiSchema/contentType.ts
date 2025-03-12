/** Definitions for ContentType, both the response from the server and the request to it */

export interface ContentType {
  key: string;
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
  String: {};
  Url: {};
  JsonString: {};
  List: {};
};
