/** Base class for all Errors that can happen in the CLI app */
export class OptimizelyCliError extends Error {
  //
}

export class CredentialsError extends OptimizelyCliError {
  code:
    | "wrong_format" // The credentials file has wrong format
    | "more_than_one_url" // The credentials file has more than one URL (needs disambiguation)
    | "no_credentials_found";

  constructor(code: CredentialsError["code"], message?: string) {
    super(message);
    this.name = "CredentialsError";
    this.code = code;
  }
}
