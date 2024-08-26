import React, { createContext, useContext, useState } from "react";
import {
  EDGE_VARIANTS,
  NODE_VARIANTS,
} from "../components/atoms/Handlers.types";

type StateContextType = {
  selectedNode: NODE_VARIANTS;
  setSelectedNode: React.Dispatch<React.SetStateAction<NODE_VARIANTS>>;
  selectedEdge: EDGE_VARIANTS;
  setSelectedEdge: React.Dispatch<React.SetStateAction<EDGE_VARIANTS>>;
};

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedNode, setSelectedNode] = useState<NODE_VARIANTS>(
    NODE_VARIANTS.ACTIVITY
  );
  const [selectedEdge, setSelectedEdge] = useState<EDGE_VARIANTS>(
    EDGE_VARIANTS.CONTROL
  );

  return (
    <StateContext.Provider
      value={{ selectedEdge, selectedNode, setSelectedEdge, setSelectedNode }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
