# Optimizely CMS JavaScript SDK

**EXPERIMENTAL**. This repository is experimental and should not be used in production

## Goal

Create a "SaaS Management JavaScript SDK", where JavaScript developers can:

- Create a "manifest" file with JavaScript/TypeScript where content types are specified
- Create CLI commands to be able to "push" the manifest to a SaaS instance

If you want to test the CLI commands, follow the instructions below. If you are interested in the lessons learnt, design decisions, etc., read [DEVELOPMENT.md](./DEVELOPMENT.md)

---

## Installation

> [!Note]
> The CLI is not published as npm package, so we are going to use it from the local repository

Pre-requirements

- Latest LTS version of Node.js

Steps:

1. Clone this repository
2. From the repository root, run:

   ```
   npm install
   npm run build
   npm link
   ```

Now, you can run `optimizely-experimental` from everywhere.

Test it by executing the command `optimizely-experimental`. You should see something like this:

```
$ optimizely-experimental
VERSION
  optimizely-sdk-experimental/1.0.0 darwin-arm64 node-v22.14.0

USAGE
  $ optimizely [COMMAND]

TOPICS
  config  describe the command here

COMMANDS
  login  login to SaaS CMS
```

## Create a custom content type programatically

### 1. Login to your SaaS instance

1. Run `optimizely-experimental login` from anywhere and follow the instructions

### 2. Create a configuration file with the help of the SDK

1. Create an empty directory that will contain the configuration file.
2. From the directory, start a new npm project by running:

   ```
   npm init -y
   ```

3. From the directory, run:

   ```
   npm link optimizely-sdk-experimental
   ```

4. Create a file called `optimizely.config.mjs` and put the following content:

   ```js
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
   ```

5. Run the command `optimizely-experimental config push ./optimizely.config.mjs`

6. Verify in your SaaS instance that you have a new content type called "SomeExperience"
