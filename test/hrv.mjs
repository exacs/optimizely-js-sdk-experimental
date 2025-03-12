// @ts-check
import { buildConfig } from "optimizely-sdk-experimental";

export default buildConfig({
  contentTypes: {
    InFocus: {
      baseType: "page",
      displayName: "In Focus",
      properties: {
        heading: {
          type: "string",
        },
        summary: {
          type: "string",
        },
      },
    },
  },
});
