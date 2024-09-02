import { Connection } from "@xyflow/react";
import { Dispatch } from "react";
import { CustomEdge } from "../Handlers.types";

export type MenuPosition = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

export type EdgeOptionsMenuProps = {
  menuClose: () => void;
  position?: MenuPosition;
  connection: Connection | null;
  setEdges: Dispatch<React.SetStateAction<CustomEdge[]>>;
};
