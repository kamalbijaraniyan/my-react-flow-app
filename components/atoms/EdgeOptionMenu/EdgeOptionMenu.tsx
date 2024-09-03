import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { addEdge, useEdges, useNodes } from "@xyflow/react";
import { CustomEdge, EDGE_VARIANTS, NODE_VARIANTS } from "../Handlers.types";
import { connectionLineStyles, edgeMarkerEndStyles } from "../../../src/App";
import { EdgeOptionsMenuProps } from "./EdgeOptionMenu.types";
import { getNodeVariantInfo } from "../../../lib/getNodeVariantInfo";
import { ERRORS, useErrorContext } from "../../../context/ErrorContext";
import {
  countEdges,
} from "../../../lib/validationFunctions";

const nodesWithHasIncomingFlow = [
  NODE_VARIANTS.BLOCK,
  NODE_VARIANTS.RETURN,
  NODE_VARIANTS.FLOW_FINAL,
  NODE_VARIANTS.BUSINESS_ACTIVITY,
  NODE_VARIANTS.ACTIVITY,
  NODE_VARIANTS.DECISION,
  NODE_VARIANTS.MERGE,
  NODE_VARIANTS.EVENT,
];

const nodesWithHasOneOutgoingFlow = [
  NODE_VARIANTS.INITIAL,
  NODE_VARIANTS.BUSINESS_ACTIVITY,
  NODE_VARIANTS.ACTIVITY,
  NODE_VARIANTS.MERGE,
];

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
  const { updateErrorStatus } = useErrorContext();

  // retrives source and target node variant
  const sourceNode = useMemo(() => {
    return getNodeVariantInfo(connection.source, nodes);
  }, [connection.source, nodes]);
  const targetNode = useMemo(() => {
    return getNodeVariantInfo(connection.target, nodes);
  }, [connection.target, nodes]);

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
      handleValidation(addEdge(newEdge, edges));
    },
    [connection, addEdge, menuClose]
  );

  const handleValidation = useCallback(
    (edges: CustomEdge[]) => {
      const { nodeVariant: sourceNodeVariant, nodeId: sourceNodeId } =
        sourceNode;
      const { nodeVariant: targetNodeVariant, nodeId: targetNodeId } =
        targetNode;

      // Handles node have exactly one outgoing flow.
      if (nodesWithHasOneOutgoingFlow.includes(sourceNodeVariant)) {
        const outgoingFlows = countEdges(
          edges,
          (edge) => edge.source === sourceNodeId
        );
        updateErrorStatus(
          sourceNodeVariant,
          ERRORS.HAS_ONE_OUTGOING_FLOW,
          outgoingFlows != 1
        );
      }

      // handles Node must have at least one incoming flow.
      if (nodesWithHasIncomingFlow.includes(targetNodeVariant)) {
        const incomingFlows = countEdges(
          edges,
          (edge) => edge.target === targetNodeId
        );

        updateErrorStatus(
          targetNodeVariant,
          ERRORS.HAS_INCOMING_FLOW,
          incomingFlows < 1
        );
      }

      if (sourceNodeVariant === NODE_VARIANTS.EVENT) {
        const outgoingFlows = countEdges(
          edges,
          (edge) => edge.source === sourceNodeId
        );

        updateErrorStatus(
          sourceNodeVariant,
          ERRORS.HAS_OUTGOING_FLOW,
          outgoingFlows < 1
        );
      }

      // validates DICISION node
      if (sourceNodeVariant === NODE_VARIANTS.DECISION) {
        const outgoingFlows = countEdges(
          edges,
          (edge) => edge.source === sourceNodeId
        );
        const elseFlowCount = countEdges(
          edges,
          (edge) =>
            edge.source === sourceNodeId &&
            edge.edgeVariant === EDGE_VARIANTS.ELSE_CONTROL
        );

        // Validates that the DECISION node must have more than one outgoing flow.
        updateErrorStatus(
          NODE_VARIANTS.DECISION,
          ERRORS.VALID_FLOW_COUNT,
          outgoingFlows <= 1
        );

        // Validates that the DECISION node can have only one ELSE flow.
        updateErrorStatus(
          NODE_VARIANTS.DECISION,
          ERRORS.SINGLE_ELSE_FLOW,
          elseFlowCount > 1
        );
      }
    },
    [sourceNode, targetNode]
  );

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
  }, [sourceNode, targetNode]);

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
