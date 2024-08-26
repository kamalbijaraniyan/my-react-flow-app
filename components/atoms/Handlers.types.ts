import { Edge, Position } from "@xyflow/react";

export enum EDGE_VARIANTS {
  CONTROL = "control",
  CASE_CONTROL = "case_control",
  ELSE_CONTROL = "else_control",
  CASE_DATA = "case_data",
}

export enum HANDLER_TYPE {
  SOURCE = "source",
  TARGET = "target",
}

export interface CustomEdge extends Edge {
  edgeVariant?: EDGE_VARIANTS;
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
