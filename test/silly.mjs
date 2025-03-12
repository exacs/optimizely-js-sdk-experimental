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
        sections: {
          type: "content",
          allowedTypes: ["Section", "Section3"],
        },
      },
    },
    Section: {
      baseType: "component",
      properties: {
        heading: {
          type: "string",
        },
      },
    },
    Section2: {
      baseType: "component",
      properties: {
        heading: {
          type: "string",
        },
      },
    },
    Section3: {
      baseType: "component",
      properties: {
        heading: {
          type: "string",
        },
      },
    },
  },
});
