# Development

This document explains the thoughts (ideas, decisions, findings, etc.) around the development of this project.

## API Client for the CMS SaaS REST API

The first attempt was to generate the API Client using a code generator. The most promising TypeScript/JavaScript generator was [openapi-typescript](https://www.npmjs.com/package/openapi-typescript).

Drawback: it does not handle "discriminators" very well, which are heavily used by the REST API for content types and content type properties.

[The auto-generated file](./src/open-api/schema.ts) in line 635 (among others) contains an error where content type properties are defined as:

```ts
export interface components {
  schemas:
    StringProperty: Omit<components["schemas"]["ContentTypeProperty"], "type"> & {
    type: "StringProperty"
  }
}
```

which meant (erroneously) that, you define content types like this:

```json
{
  "key": "MyContentType",
  "properties": {
    "property1": {
      // this should be "string", not "StringProperty"
      "type": "StringProperty"
    }
  }
}
```

There is a package called [`openapi-fetch`](https://www.npmjs.com/package/openapi-fetch) developed by the same people as `openapi-typescript` which generates a HTTP Client based on a typescript schema.

The `openapi-fetch` package is independent from the type generators, so we can create [TypeScript types semi-manually](./src/utils/restApiSchema.ts) (i.e. with _help_ of generators and other tools) while using the package to [create the REST API Client itself](./src/utils/restApiClient.ts).

Some ideas:

- The REST API Client will be used internally and will be exposed as part of the SDK API.
- The TS types created from the REST API schema, will be considered "source of truth" to derive other helper types which might or might not be exposed

## Configuration file

Users would write a configuration file "optimizely.config.js" (or similar) that will look like the [example.mjs](./test/example.mjs) file.

- The `buildConfig` function exposed in the SDK accepts a "configuration written in JavaScript" and outputs a JSON configuration.
- The command `optimizely config push` will import and run the configuration file, and send the JSON configuration and send it to the server
- The `buildConfig` function gives users a more ergonomic way to write configuration

Inspiration for this format:

- [Payload CMS config](https://payloadcms.com/docs/configuration/overview)
- [NextJS config](https://nextjs.org/docs/pages/api-reference/config/next-config-js)
- [ESlint config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [Vite config](https://vite.dev/config/)

## Tools to create CLI

The CLI is created with [oclif](https://oclif.io), which handles all arguments parsing, flags, defaults, help, description, binaries, etc.

In addition to `oclif`, these tools are used:

- [conf](https://www.npmjs.com/package/conf) to store configuration (client ID and secret) in file system
- [inquirer](https://www.npmjs.com/package/@inquirer/prompts) to write prompts
- [ora](https://www.npmjs.com/package/ora) to display spinners 😊

## Questions around the REST API

### Conflicting content types

Users can define a config file to create a content type that already exists in the CMS (has the same key).

- In some cases (e.g. if the base type has changed), the operation results in an error: the content type is not created nor updated.
- In other cases (e.g. base type is the same but display name has changed), the operation is not an error: the content type is updated.

Should the SDK check potential problems _before_ sending the manifest to the CMS?

### Incorrections in REST API Schema

According to the schema, content type properties are defined like this

```json
{
  "BinaryProperty": {
    "allOf": [
      {
        // Expansion of ref "#/components/schemas/ContentTypeProperty"
        "type": "object",
        "properties": {
          "format": {
            "type": "string",
          },
        },
        "additionalProperties": false,
      },
      {
        "type": "object",
        "properties": {
          "imageDescriptor": {
            "$ref": "#/components/schemas/ImageDescriptor"
          }
        },
        "additionalProperties": false
      }
    ]
  }
},
```

The `"additionalProperties": false` set twice in combination with `allOf` means: "no other properties than `format` are allowed" **AND** "no other properties than `imageDescriptor` are allowed", i.e., one rule negates the other. This means, _no object (neither an empty object) can satisfy the schema_.
