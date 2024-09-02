import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { addEdge, useEdges, useNodes } from "@xyflow/react";
import { CustomEdge, EDGE_VARIANTS, NODE_VARIANTS } from "../Handlers.types";
import { connectionLineStyles, edgeMarkerEndStyles } from "../../../src/App";
import { EdgeOptionsMenuProps } from "./EdgeOptionMenu.types";
import { getNodeVariantInfo } from "../../../lib/getNodeVariantInfo";

const ContextMenu: React.FC<EdgeOptionsMenuProps> = ({
  menuClose,
  position,
  connection,
  setEdges,
}) => {
  if (!connection) return null;

  const [menuOptions, setMenuOptions] = useState(Object.values(EDGE_VARIANTS));
  const nodes = useNodes();
  const edges = useEdges<CustomEdge>();

  // connect edges to nodes
  const handleConnection = useCallback(
    (selectedEdge: EDGE_VARIANTS) => {
      menuClose();

      const newEdge = {
        ...connection,
        id: `e${connection?.source}-${connection?.target}_${connection.sourceHandle}-${connection.targetHandle}`,
        markerEnd:
          selectedEdge === EDGE_VARIANTS.DATA_FLOW
            ? edgeMarkerEndStyles.dataFlow
            : edgeMarkerEndStyles.normalFlow,
        edgeVariant: selectedEdge,
        style:
          selectedEdge === EDGE_VARIANTS.DATA_FLOW
            ? connectionLineStyles.dataFlow
            : connectionLineStyles.normalFlow,
        animated: selectedEdge === EDGE_VARIANTS.DATA_FLOW ? true : false,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [connection, addEdge, menuClose]
  );

  // retrives source and target node variant
  const sourceNode = useMemo(() => {
    return getNodeVariantInfo(connection.source, nodes);
  }, [connection.source, nodes]);
  const targetNode = useMemo(() => {
    return getNodeVariantInfo(connection.target, nodes);
  }, [connection.target, nodes]);

  // filters edge options as per source node
  useLayoutEffect(() => {
    if (sourceNode.nodeVariant === NODE_VARIANTS.DECISION) {
      setMenuOptions(Object.values(EDGE_VARIANTS));
      const connectedEdges = edges.filter(
        (edge) => edge.source === sourceNode.nodeId
      );
      const elseControlCount = connectedEdges.filter(
        (edge) => edge.edgeVariant === EDGE_VARIANTS.ELSE_CONTROL
      ).length;

      if (elseControlCount > 0) {
        setMenuOptions((prev) =>
          prev.filter((variant) => variant !== EDGE_VARIANTS.ELSE_CONTROL)
        );
      }
    } else {
      handleConnection(EDGE_VARIANTS.CONTROL);
    }
  }, [sourceNode, targetNode, handleConnection]);

  return (
    <div
      style={{
        top: position?.top,
        left: position?.left,
        right: position?.right,
        bottom: position?.bottom,
      }}
      className="absolute z-30 flex flex-col"
    >
      {menuOptions.map((variant) => (
        <button
          key={variant}
          className={`text-xss border rounded-md p-1 bg-slate-400 text-black`}
          onClick={() => handleConnection(variant)}
        >
          {variant}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
