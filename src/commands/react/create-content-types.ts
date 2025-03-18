import { Args, Command, Flags } from "@oclif/core";
import chalk from "chalk";
import { glob } from "glob";
import { resolve } from "node:path";
import { tsImport } from "tsx/esm/api";
import { Js } from "../../index.js";

export default class ReactCreateContentTypes extends Command {
  static override args = {};
  static override description = "describe the command here";
  static override examples = ["<%= config.bin %> <%= command.id %>"];
  static override flags = {
    pattern: Flags.string({
      description: "blob pattern with all components",
      default: "src/optimizely/**/*.tsx",
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(ReactCreateContentTypes);
    const pattern = flags.pattern;

    const files = await glob(pattern, { cwd: process.cwd() });
    const contentTypes: Record<string, Js.ContentTypes.All> = {};

    for (const f of files) {
      const loaded = await tsImport(resolve(f), process.cwd());

      if (loaded.default.optimizelyContentType) {
        const { key, js } = loaded.default.optimizelyContentType;
        if (key && js) {
          console.log(
            "Content type %s found in %s",
            chalk.bold(key),
            chalk.bold(f)
          );

          if (contentTypes[key]) {
            throw new Error(`Content type ${key} found multiple times`);
          }
          contentTypes[key] = js;
        }
      }
    }

    //
  }
}
