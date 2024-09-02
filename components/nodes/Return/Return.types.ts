import { Node } from "@xyflow/react";
import { ReactNode } from "react";

export type NodeData = Node<{ label?: string | ReactNode }, "blockData">;
