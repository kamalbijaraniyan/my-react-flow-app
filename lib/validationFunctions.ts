import { CustomEdge } from "../components/atoms/Handlers.types";

export const countEdges = (
  edges: CustomEdge[],
  condition: (edge: CustomEdge) => boolean
): number => edges.filter(condition).length;


  