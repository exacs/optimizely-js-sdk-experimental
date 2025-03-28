/** Re-Definition of the "Manifest", the JSON accepted in the endpoint POST /packages */
export type Manifest = {
  contentTypes?: ContentType[];
};

/** Content Type */
export type ContentType = ContentTypes.All;

export namespace ContentTypes {
  export type All = Component | Experience | Others;

  type Base = {
    key: string;
    displayName?: string;
    properties?: Record<string, ContentTypeProperties.All>;
  };

  export type Component = Base & {
    baseType: "component";
    compositionBehaviors?: ("sectionEnabled" | "elementEnabled")[];
  };

  export type Experience = Base & {
    baseType: "experience";
  };

  export type Others = Base & {
    baseType:
      | "page"
      | "media"
      | "image"
      | "video"
      | "folder"
      // | "section" -- not allowed
      | "element";
  };
}

/** All possible Content Type Properties */
export type ContentTypeProperty = ContentTypeProperties.All;

/** Each property */
export namespace ContentTypeProperties {
  /** All possible Content Type Properties */
  export type All = Array | NonArray;

  export type Array = {
    type: "array";
    items: NonArray;
  };

  export type NonArray = String | Content;

  /** Common properties for all content type properties */
  type Base = {
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

  export type Binary = Base & {
    type: "binary";
  };
  export type Boolean = Base & {
    type: "boolean";
  };
  export type Component = {};
  export type Content = Base & {
    type: "content";
    allowedTypes?: string[];
    restrictedTypes?: string[];
  };
  export type ContentReference = {};
  export type DateTime = {};
  export type Float = {};
  export type Integer = {};

  /** String property */
  export type String = Base & {
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
  export type Url = {};
  export type JsonString = {};
  export type List = {};
}
