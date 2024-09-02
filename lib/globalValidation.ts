import { Node } from "@xyflow/react";
import {
  CustomEdge,
  EDGE_VARIANTS,
  NODE_VARIANTS,
} from "../components/atoms/Handlers.types";
import { getNodeVariantInfo } from "./getNodeVariantInfo";

export const globalValidation = (nodes: Node[], edges: CustomEdge[]) => {
  const errors: string[] = [];

  if (nodes.filter((n) => n.type === NODE_VARIANTS.INITIAL).length !== 1) {
    errors.push("Diagram must have exactly one INITIAL node");
  }

  nodes.forEach((node) => {
    const totalConnectedEdges = edges.filter(edge => edge.source === node.id || edge.target === node.id).length;
    if(!totalConnectedEdges){
      errors.push(
        `Node ${node.type?.toLocaleUpperCase()} has no incoming or outgoing edges.`
       )
    }
    if (node.type === NODE_VARIANTS.INITIAL) {
      const connectedEdge = edges.find((edge) => edge.source === node.id);

      if (connectedEdge) {
          const sourceNodeVariant = getNodeVariantInfo(
            connectedEdge.target,
            nodes
          ).nodeVariant;
          if (
            sourceNodeVariant !== NODE_VARIANTS.ACTIVITY &&
            sourceNodeVariant !== NODE_VARIANTS.BUSINESS_ACTIVITY
          ) {
            errors.push(
             "There needs to be at least a BUSINESS_ACTIVITY or ACTIVITY Node reachable from INITIAL Node."
            );
          }
        }
      }

    // makes sure any node with outgoing flow have incoming flow
    if (
      node.type === NODE_VARIANTS.ACTIVITY ||
      node.type === NODE_VARIANTS.BUSINESS_ACTIVITY ||
      node.type === NODE_VARIANTS.MERGE ||
      node.type === NODE_VARIANTS.DECISION ||
      node.type === NODE_VARIANTS.EVENT
    ) {
      const hasOutgoingEdges = edges.some((edge) => edge.source === node.id);

      if (hasOutgoingEdges) {
        const hasIncomingEdges = edges.some((edge) => edge.target === node.id);

        if (!hasIncomingEdges) {
          errors.push(
            `Node ${node.type.toLocaleUpperCase()} has outgoing edges but no incoming edges.`
          );
        }
      }
    }

    // makes sure certain nodes have exactly one outgoing flow
    if (
      node.type === NODE_VARIANTS.INITIAL ||
      node.type === NODE_VARIANTS.ACTIVITY ||
      node.type === NODE_VARIANTS.BUSINESS_ACTIVITY ||
      node.type === NODE_VARIANTS.MERGE
    ) {
      if (edges.filter((edge) => edge.source === node.id).length !== 1) {
        errors.push(
          `${node.type.toLocaleUpperCase()} Node must have exactly one outgoing flow`
        );
      }
    }

    // makes sure certain nodes are connected by CONTROL flow only
    if (
      node.type === NODE_VARIANTS.INITIAL ||
      node.type === NODE_VARIANTS.BUSINESS_ACTIVITY ||
      node.type === NODE_VARIANTS.MERGE ||
      node.type === NODE_VARIANTS.EVENT
    ) {
      const connectedEdges = edges.filter((edge) => edge.source === node.id);

      const edgeTypeFlag = connectedEdges.every(
        (edge) => edge.edgeVariant === EDGE_VARIANTS.CONTROL
      );
      if (!edgeTypeFlag) {
        errors.push(
          `All edges connected to ${node.type.toLocaleUpperCase()} Node must be CONTROL flow`
        );
      }
    }

    // makes sure BLOCK node connects to only INITIAL or DECISION nodes
    if (node.type === NODE_VARIANTS.BLOCK) {
      const connectedEdges = edges.filter((edge) => edge.target === node.id);

      connectedEdges.forEach((edge) => {
        const sourceNodeVariant = getNodeVariantInfo(
          edge.source,
          nodes
        ).nodeVariant;
        if (
          sourceNodeVariant !== NODE_VARIANTS.INITIAL &&
          sourceNodeVariant !== NODE_VARIANTS.DECISION
        ) {
          errors.push(
            `All edges connected to ${node.type?.toLocaleUpperCase()} Node must be from INITIAL or DECISION Node`
          );
        }
      });
    }

    // makes sure EVENT node connects to only BUSINESS_ACTIVITY, ACTIVITY, or MERGE nodes
    if (node.type === NODE_VARIANTS.EVENT) {
      const validateConnection = (edge: CustomEdge, direction: string) => {
        const relatedNodeVariant = getNodeVariantInfo(
          direction === "outgoing" ? edge.target : edge.source,
          nodes
        ).nodeVariant;

        if (
          relatedNodeVariant !== NODE_VARIANTS.BUSINESS_ACTIVITY &&
          relatedNodeVariant !== NODE_VARIANTS.ACTIVITY &&
          relatedNodeVariant !== NODE_VARIANTS.MERGE
        ) {
          errors.push(
            `EVENT Node must ${
              direction === "outgoing" ? "connect to" : "be connected from"
            } BUSINESS_ACTIVITY, ACTIVITY, or MERGE Node`
          );
        }
      };

      edges
        .filter((edge) => edge.source === node.id)
        .forEach((edge) => validateConnection(edge, "outgoing"));

      edges
        .filter((edge) => edge.target === node.id)
        .forEach((edge) => validateConnection(edge, "incoming"));
    }

    // makes sure DECISION node connects atleast 2 flows and do not have two ELSE flow
    if (node.type === NODE_VARIANTS.DECISION) {
      const connectedEdges = edges.filter(
        (edge) => edge.source === node.id || edge.target === node.id
      );
      const elseControlCount = connectedEdges.filter(
        (edge) => edge.edgeVariant === EDGE_VARIANTS.ELSE_CONTROL
      ).length;
      const conditionControlCount = connectedEdges.filter(
        (edge) => edge.edgeVariant === EDGE_VARIANTS.CASE_CONTROL
      ).length;

      if (connectedEdges.length < 2) {
        errors.push(
          `${node.type.toLocaleUpperCase()} must connect atleast 2 flows`
        );
      }

      if (elseControlCount > 1) {
        errors.push(
          `${node.type.toLocaleUpperCase()} cannot have more than one ELSE flow`
        );
      }

      if (elseControlCount && !conditionControlCount) {
        errors.push(
          `${node.type.toLocaleUpperCase()} cannot have ELSE flow without CASE flow`
        );
      }
    }
  });

  // Validate edges and connections
  edges.forEach((edge) => {
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);

    if (!sourceNode || !targetNode) {
      errors.push(
        `Invalid edge ${edge.id} with source ${edge.source} or target ${edge.target}`
      );
    }
  });

  return errors;
};
