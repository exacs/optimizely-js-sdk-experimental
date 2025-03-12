import { confirm } from "@inquirer/prompts";
import { Args, Command, Flags } from "@oclif/core";
import {
  createRestApiClient,
  createRestApiClientFromCredentials,
} from "../../utils/restApiClient.js";
import { readCredentials } from "../../utils/config.js";
import { BaseCommand } from "../../baseCommand.js";

export default class DangerDeleteAllContentTypes extends BaseCommand<
  typeof DangerDeleteAllContentTypes
> {
  static override args = {};
  static override description = "Deletes all content types";
  static override examples = ["<%= config.bin %> <%= command.id %>"];
  static override flags = {};

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(DangerDeleteAllContentTypes);
    const client = await createRestApiClientFromCredentials(flags.host);

    const answer = await confirm({
      message: "This will delete all your content types. Are you sure?",
    });
  }
}
