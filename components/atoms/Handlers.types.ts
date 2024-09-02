import { Edge, MarkerType, Position } from "@xyflow/react";

export enum EDGE_VARIANTS {
  CONTROL = "control",
  CASE_CONTROL = "case_control",
  ELSE_CONTROL = "else_control",
  DATA_FLOW = "data_flow",
}

export enum HANDLER_TYPE {
  SOURCE = "source",
  TARGET = "target",
}

export interface CustomEdge extends Edge {
  edgeVariant: EDGE_VARIANTS;
  markerEnd: {
    type: MarkerType;
    width: number;
    height: number;
    color: string;
  };
  style: {
    stroke: string;
  };
  animated: boolean;
  sourceHandle: string | null;
  targetHandle: string | null;
}

export type HandlersConfig = {
  id: string;
  type: HANDLER_TYPE;
  position: Position;
};

export enum NODE_VARIANTS {
  ACTIVITY = "activity",
  BLOCK = "block",
  BUSINESS_ACTIVITY = "business_activity",
  DECISION = "decision",
  EVENT = "event",
  FLOW_FINAL = "flow_final",
  INITIAL = "initial",
  MERGE = "merge",
  RETURN = "return",
}


