import createClient from "openapi-fetch/dist/index.js";
import { paths } from "./restApiSchema.js";

export async function getToken(
  cmsRoot: string,
  clientId: string,
  clientSecret: string
) {
  const baseUrl = new URL("/_cms/preview2", cmsRoot).toString();
  const client = createClient<paths>({ baseUrl });

  return client
    .POST("/oauth/token", {
      body: {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      },
    })
    .then(({ response, data, error }) => {
      if (!response.ok) {
        throw new Error("Response is not OK");
      }

      if (!data) {
        throw new Error("endpoint respond with no data");
      }
      return data.access_token;
    });
}

export async function createRestApiClient(
  cmsRoot: string,
  clientId: string,
  clientSecret: string
) {
  const baseUrl = new URL("/_cms/preview2", cmsRoot).toString();
  const accessToken = await getToken(cmsRoot, clientId, clientSecret);

  return createClient<paths>({
    baseUrl,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
}
