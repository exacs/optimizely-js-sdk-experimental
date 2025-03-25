import { Graffle } from "graffle";
import type {
  ContentType,
  ContentTypeProperties,
} from "./management/builderTypes.js";

type Importer = (name: string) => Promise<{
  default: {
    optimizelyContentType: ContentType;
  };
}>;

async function expandField(
  propertyKey: string,
  property: ContentTypeProperties.All,
  importer: Importer
) {
  const extraFragments: string[] = [];
  let field = propertyKey;

  if (property.type === "array") {
    return expandField(propertyKey, property.items, importer);
  }

  // 2. For each `content` property, get fragments from allowedTypes
  if (property.type === "content") {
    field += " {";
    field += "__typename ";
    for (const subtype of property.allowedTypes ?? []) {
      const subfragment = await getFragment(subtype, importer);

      extraFragments.push(subfragment);
      field += "..." + subtype;
    }
    field += "}";
  }

  return {
    field: field,
    extraFragments,
  };
}
/** Returns a fragment for a content type */
async function getFragment(viewName: string, importer: Importer) {
  const fields: string[] = [];
  const fragments: string[] = [];

  const contentType = await importer(viewName).then(
    (m) => m.default.optimizelyContentType
  );

  const properties = contentType.properties;

  for (const propertyKey in properties) {
    const property = properties[propertyKey];
    const { field, extraFragments } = await expandField(
      propertyKey,
      property,
      importer
    );

    fields.push(field);
    fragments.push(...extraFragments);
  }

  if (contentType.baseType === "experience") {
    if (contentType.defaultView?.sections) {
      let field =
        "composition { nodes { ... on CompositionComponentNode { component {";
      field += "__typename ";

      for (const section of contentType.defaultView.sections) {
        field += "..." + section;
        const subfragment = await getFragment(section, importer);
        fragments.push(subfragment);
      }
      field += "}}}}";
      fields.push(field);
    }
  }

  fragments.push(`fragment ${viewName} on ${viewName} {${fields.join(" ")}}`);

  return fragments.join("\n");
}

export async function getByPath(
  graphApiUrl: string,
  path: string,
  importer: Importer
) {
  const graffle = Graffle.create().transport({
    url: graphApiUrl,
    headers: {},
  });

  const q1 = `
  query MyQuery($url: String) {
    _Content(where: { _metadata: { url: { default: { eq: $url } } } }) {
      item {
        _metadata {
          types
          key
        }
      }
    }
  }`;

  const data = await graffle.gql(q1).send({ url: path });
  const content = data?._Content.item;
  const contentTypeName = content._metadata.types[0];
  const id = content._metadata.key;
  const fragment = await getFragment(contentTypeName, importer);

  const q2 = `
  ${fragment}
  query MyQuery($id: String) {
    _Content(ids: [$id]) {
      item {
        __typename
        ...${contentTypeName}
      }
    }
  }`;

  const data2 = await graffle.gql(q2).send({ id });
  return data2?._Content.item;
}
