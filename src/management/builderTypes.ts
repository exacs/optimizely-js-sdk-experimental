/**
 * @file Types for the object passed to the "builders".
 *
 * Should match the Manifest whenever possible
 */

import * as Json from "./manifestTypes.js";
import { Prettify } from "./utils.js";

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
  export type All =
    | Json.ContentTypes.Component
    | Experience
    | Json.ContentTypes.Others;

  export type Experience = Json.ContentTypes.Experience & {
    defaultView?: {
      sections?: string[];
      elements?: string[];
    };
  };

  export type Infer<T extends All> = Prettify<
    InferBaseProps & InferProps<T> & InferExperienceProps<T>
  >;
  export type InferProps<T extends All> = T extends {
    properties: Record<string, ContentTypeProperties.All>;
  }
    ? {
        [Key in keyof T["properties"]]: ContentTypeProperties.Infer<
          T["properties"][Key]
        >;
      }
    : {};

  export type InferBaseProps = {
    _metadata: {
      url: {
        default: string;
      };
    };
  };

  export type InferExperienceProps<T extends All> = T extends Experience
    ? {
        composition: {
          nodes: {
            component?: {
              __typename: string;
            };
          }[];
        };
      }
    : {};
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
