import { Args, Command, Flags } from "@oclif/core";
import { resolve } from "node:path";
import { readCredentials } from "../../utils/config.js";
import {
  createRestApiClient,
  createRestApiClientFromCredentials,
} from "../../utils/restApiClient.js";
import ora from "ora";
import { BaseCommand } from "../../baseCommand.js";
import { writeFile } from "node:fs/promises";

export default class ConfigPush extends BaseCommand<typeof ConfigPush> {
  static override args = {
    file: Args.string({ description: "configuration file", required: true }),
  };
  static override flags = {
    host: Flags.string({ description: "CMS instance URL" }),
    output: Flags.string({ description: "if passed, write the manifest JSON" }),
    dryRun: Flags.boolean({
      description: "do not send anything to the server",
    }),
  };
  static override description = "describe the command here";
  static override examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(ConfigPush);
    const configPath = resolve(process.cwd(), args.file);
    const { default: jsonConfig } = await import(configPath);
    const restClient = await createRestApiClientFromCredentials(flags.host);

    if (flags.output) {
      await writeFile(flags.output, JSON.stringify(jsonConfig, null, 2));
      console.log(`Configuration file written in '${flags.output}'`);
    }

    if (flags.dryRun) {
      return;
    }

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
