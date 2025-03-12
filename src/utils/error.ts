import { CLIError } from "@oclif/core/errors";
import Conf from "conf";
import Login from "../commands/login.js";

/** Base class for all Errors that can happen in the CLI app */
export class OptimizelyCliError extends Error {
  //
}

export const credentialErrors = {
  WrongFormat: class WrongFormat extends CLIError {
    constructor(conf: Conf) {
      super("The credentials file is malformed", {
        exit: 1,
        suggestions: [`Delete the file '${conf.path}' and try again`],
      });
    }
  },

  NoCredentialsFound: class NoCredentialsFound extends CLIError {
    constructor() {
      super("No credentials found in the file", {
        exit: 1,
        suggestions: [`Run 'optimizely-experimental login'`],
      });
    }
  },
};

// export class CredentialsError extends CLIError {
//   code:
//     | "wrong_format" // The credentials file has wrong format
//     | "more_than_one_url" // The credentials file has more than one URL (needs disambiguation)
//     | "no_credentials_found";

//   constructor(code: CredentialsError["code"], message?: string) {
//     super(message);
//     this.name = "CredentialsError";
//     this.code = code;
//   }
// }
