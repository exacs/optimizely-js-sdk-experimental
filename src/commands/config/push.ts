import { Args, Command, Flags } from "@oclif/core";
import { resolve } from "node:path";
import { readCredentials } from "../../utils/config.js";
import { createRestApiClient } from "../../utils/restApiClient.js";
import ora from "ora";
import { BaseCommand } from "../../baseCommand.js";

export default class ConfigPush extends BaseCommand<typeof ConfigPush> {
  static override args = {
    file: Args.string({ description: "configuration file", required: true }),
  };
  static override flags = {
    host: Flags.string({ description: "CMS instance URL" }),
  };
  static override description = "describe the command here";
  static override examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(ConfigPush);
    const cred = readCredentials(flags.host);

    const configPath = resolve(process.cwd(), args.file);
    const { default: jsonConfig } = await import(configPath);

    const restClient = await createRestApiClient(cred);

    const spinner = ora("Uploading configuration file").start();

    const response = await restClient
      .POST("/packages", {
        body: jsonConfig,
      })
      .then((r) => r.data);

    spinner.succeed("Configuration file uploaded");

    if (!response) {
      console.error("The server did not respond with any content");
      return;
    }

    console.log();
    if (response.outcomes && response.outcomes.length > 0) {
      console.log("Outcomes:");
      for (const r of response?.outcomes ?? []) {
        console.log(`- ${r.message}`);
      }
    }

    if (response.warnings && response.warnings.length > 0) {
      console.log("Warnings:");
      for (const r of response.warnings) {
        console.log(`- ${r.message}`);
      }
    }

    if (response.errors && response.errors.length > 0) {
      console.log("Errors:");
      for (const r of response.errors) {
        console.log(`- ${r.message}`);
      }
    }
  }
}
