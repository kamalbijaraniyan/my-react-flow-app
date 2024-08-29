import { Node } from "@xyflow/react";
import { NODE_VARIANTS } from "components/atoms/Handlers.types";

export const getNodeVariantInfo = (nodeId: string, nodes: Node[]) => {
  const node = nodes.find((node) => node.id === nodeId);
  return {
    nodeId: node?.id,
    nodeVariant: node?.type as NODE_VARIANTS,
  };
};
