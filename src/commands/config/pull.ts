import { Flags } from "@oclif/core";
import { resolve } from "node:path";
import { createRestApiClientFromCredentials } from "../../utils/restApiClient.js";
import ora from "ora";
import { BaseCommand } from "../../baseCommand.js";
import { writeFile } from "node:fs/promises";

export default class ConfigPull extends BaseCommand<typeof ConfigPull> {
  static override flags = {
    output: Flags.string({ description: "Output JSON file", required: true }),
  };
  static override description =
    "Download the config manifesto from CMS in JSON format";
  static override examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(ConfigPull);

    const outputPath = resolve(process.cwd(), flags.output);
    const restClient = await createRestApiClientFromCredentials(flags.host);

    const spinner = ora("Downloading configuration file").start();
    const response = await restClient.GET("/packages").then((r) => r.data);

    if (!response) {
      console.error("The server did not respond with any content");
      return;
    }

    spinner.succeed();

    await writeFile(outputPath, JSON.stringify(response, null, 2));
  }
}
