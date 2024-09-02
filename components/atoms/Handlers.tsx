import { Connection, Handle, useEdges, Edge, Position } from "@xyflow/react";
import { cva } from "class-variance-authority";
import React, { useCallback, useMemo } from "react";
import { cn } from "../../utils/cn";
import { CustomEdge, EDGE_VARIANTS, HANDLER_TYPE, HandlersConfig } from "./Handlers.types";

const handlerStyles = cva("opacity-0 hover:opacity-100", {
  variants: {
    edgeVariant: {
      [EDGE_VARIANTS.CONTROL]: "opacity-100",
      [EDGE_VARIANTS.CASE_CONTROL]:
        "rounded-full bg-green-500 h-3 w-3 border-black border flex items-center justify-center before:content-['V'] before:text-black before:text-xxs",
      [EDGE_VARIANTS.ELSE_CONTROL]:
        "rounded-full bg-red-500 h-3 w-3 border-black border flex items-center justify-center before:content-['[]'] before:text-black before:text-xxs",
      [EDGE_VARIANTS.DATA_FLOW]: "opacity-100",
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
  isValidConnection,
  isConnectable = true,
}: {
  nodeId: string;
  isHovered: boolean;
  handlerConfigOptions: HandlersConfig[];
  isValidConnection?: (connection: Connection | Edge) => boolean;
  isConnectable?: boolean;
}) => {
  const edges = useEdges<CustomEdge>();

  //retrives edge variant
  const getEdgeVariant = useMemo(() => {
    return (handlerId: string) => {
      const edge = edges.find(
        (edge) => edge.sourceHandle === handlerId && edge.source === nodeId
      );

      return edge ? edge?.edgeVariant : undefined;
    };
  }, [edges, nodeId]);

  //checks if the handle is connected
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

  const shouldDisableOpposite = (type:HANDLER_TYPE, position:Position) => {
    //checks if target handle is connected for the same position
    if (type === "source") {
      
      return edges.some(
        (edge) =>
          edge.target === nodeId && edge.targetHandle?.includes(position)
      );
    }
    //checks if source handle is connected for the same position
    if (type === "target") {
      return edges.some(
        (edge) =>
          edge.source === nodeId && edge.sourceHandle?.includes(position)
      );
    }
    return false;
  };

  return (
    <>
      {handlerConfigOptions.map((handle) => {
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
                edgeVariant: getEdgeVariant(id),
              })
            )}
            isValidConnection={isValidConnection}
            isConnectable={
              isConnectable && !shouldDisableOpposite(type, position)
            }
          />
        );
      })}
    </>
  );
};

export default Handlers;
