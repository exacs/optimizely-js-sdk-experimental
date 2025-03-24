import { createContext, useContext } from "react";
import type { ContentType } from "optimizely-sdk-experimental";

export interface ComponentWithContentType {
  optimizelyContentType: ContentType;
}

interface Props {
  opti: {
    __typename: string;
  };
}

type Importer = (name: string) => any;
const OptiCtx = createContext<Importer>(() => {});

export function OptimizelyWrapper(props: {
  importer: Importer;
  children: React.ReactNode;
}) {
  return (
    <OptiCtx.Provider value={props.importer}>{props.children}</OptiCtx.Provider>
  );
}

export function OptimizelyComponent({ opti }: Props) {
  const contentType = opti.__typename;
  const importer = useContext(OptiCtx);

  const Component = importer(contentType);

  if (!Component) {
    return <div>No component found for content type {contentType}</div>;
  }

  return <Component opti={opti} />;
}
