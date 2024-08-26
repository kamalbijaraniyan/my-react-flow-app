import { Handle, useEdges } from "@xyflow/react";
import { cva } from "class-variance-authority";
import React, { useCallback, useMemo } from "react";
import { cn } from "../../utils/cn";
import { CustomEdge, EDGE_VARIANTS, HandlersConfig } from "./Handlers.types";

const handlerStyles = cva("opacity-0 hover:opacity-100", {
  variants: {
    edgeVariant: {
      [EDGE_VARIANTS.CONTROL]: "opacity-100",
      [EDGE_VARIANTS.CASE_CONTROL]:
        "rounded-full bg-green-500 h-3 w-3 border-black border flex items-center justify-center before:content-['V'] before:text-black before:text-xxs",
      [EDGE_VARIANTS.ELSE_CONTROL]:
        "rounded-full bg-red-500 h-3 w-3 border-black border flex items-center justify-center before:content-['[]'] before:text-black before:text-xxs",
      [EDGE_VARIANTS.CASE_DATA]: "opacity-100",
    },
    isConnected: {
      true: "opacity-100",
      false: "",
    },
    isHovered: {
      true: "opacity-100",
      false: "",
    },
    type: {
      target: "z-10",
      source: "z-20",
    },
  },
  defaultVariants: {
    isConnected: false,
    isHovered: false,
  },
});

const Handlers = ({
  nodeId,
  isHovered,
  handlerConfigOptions,
}: {
  nodeId: string;
  isHovered: boolean;
  handlerConfigOptions: HandlersConfig[];
}) => {
  const edges = useEdges<CustomEdge>();

  const getType = useMemo(() => {
    return (sourceHandlerId: string) => {
      const edge = edges.find(
        (edge) =>
          edge.sourceHandle === sourceHandlerId && edge.source === nodeId
      );

      return edge ? edge?.edgeVariant : undefined;
    };
  }, [edges, nodeId]);

  const isConnected = useCallback(
    (handleId: string) => {
      return edges.some(
        (edge) =>
          (edge.source === nodeId && edge.sourceHandle === handleId) ||
          (edge.target === nodeId && edge.targetHandle === handleId)
      );
    },
    [edges, nodeId]
  );

  return (
    <>
      {handlerConfigOptions.map((handle, index) => {
        const { id, type, position } = handle;
        return (
          <Handle
            key={id}
            type={type}
            position={position}
            id={id}
            className={cn(
              handlerStyles({
                isConnected: isConnected(id),
                isHovered: isHovered,
                type: type,
                edgeVariant: getType(id),
              })
            )}
          />
        );
      })}
    </>
  );
};

export default Handlers;
