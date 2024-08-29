import { Connection } from "@xyflow/react";
import { Dispatch} from "react";
import { CustomEdge } from "../Handlers.types";

export type MenuPosition = {
  top: number | undefined;
  left: number | undefined;
  right: number | undefined;
  bottom: number | undefined;
};

export type EdgeOptionsMenuProps = {
  menuClose: () => void;
  position: MenuPosition|undefined;
  connection: Connection|null;
  setEdges: Dispatch<React.SetStateAction<CustomEdge[]>>;
};
