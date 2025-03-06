// @ts-check
import { buildConfig } from "optimizely-sdk-experimental";

export default buildConfig({
  contentTypes: {
    SomeExperience: {
      baseType: "experience",
      displayName: "Some Experience",
    },
  },
});
