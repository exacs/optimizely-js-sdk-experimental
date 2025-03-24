import type * as Js from "./builderTypes.js";
export { buildContentType, buildConfig } from "./builder.js";
export type InferFromContentType<T extends Js.ContentTypes.All> =
  Js.ContentTypes.Infer<T>;
