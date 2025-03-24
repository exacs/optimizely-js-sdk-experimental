/**
 * @file Types for the object passed to the "builders".
 *
 * Should match the Manifest whenever possible
 */

import * as Json from "./manifestTypes.js";

/** Argument for `buildConfig` */
export type Config = {
  contentTypes?: ContentType[] | string;
};

/** Argument for `buildContentType` */
export type ContentType = ContentTypes.All;

/** Argument for `buildContentTypeView` */
export type ContentTypeView = {};

// List of all Content Types and their schema
export namespace ContentTypes {
  export type All = Omit<Json.ContentType, "properties"> & {
    baseType: NonNullable<Json.ContentType["baseType"]>;
    properties?: Record<string, ContentTypeProperties.All>;
  };

  export type Infer<T extends All> = T extends {
    properties: Record<string, ContentTypeProperties.All>;
  }
    ? {
        [Key in keyof T["properties"]]: ContentTypeProperties.Infer<
          T["properties"][Key]
        >;
      }
    : 2;
}

export namespace ContentTypeProperties {
  export type All = Array<NonArray> | NonArray;
  export type Array<T extends NonArray> = {
    type: "array";
    items: T;
  };

  export type NonArray = String | Content;

  export type String = Json.ContentTypeProperties.String;
  export type Content = Json.ContentTypeProperties.Content;

  export type Infer<T extends All> = T extends String
    ? string
    : T extends Content
    ? { __typename: string }
    : T extends Array<infer E>
    ? Infer<E>[]
    : "invalid";
}
