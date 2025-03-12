// @ts-check
import { buildConfig } from "optimizely-sdk-experimental";

export default buildConfig({
  contentTypes: {
    InFocus: {
      baseType: "page",
      displayName: "In Focus",
      properties: {
        heading4: {
          type: "string",
          format: "shortString",
          // Validation is not made in server, only client side??
          maxLength: 2100,
        },

        // This is "consumed" by the CMS but then I cannot open to edit the property
        heading3: {
          type: "string",
          format: "html",
          maxLength: 200,
        },
      },
    },
  },
});
