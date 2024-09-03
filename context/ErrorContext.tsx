import React, { createContext, useContext, useMemo, useState } from "react";
import { NODE_VARIANTS } from "../components/atoms/Handlers.types";

export enum ERRORS {
  UNIQUE_INITIAL_NODE = "unique_initial_node", //handled
  HAS_ONE_OUTGOING_FLOW = "has_one_outgoing_flow", //handled
  HAS_INCOMING_FLOW = "has_incoming_flow", //handled
  VALID_FLOW_COUNT = "valid_flow_count", //handled
  SINGLE_ELSE_FLOW = "single_else_flow", //handled
  HAS_OUTGOING_FLOW = "has_outgoing_flow", //handled
}
type ErrorType = {
  status: boolean;
  value: string;
};

type NodeErrorsType = {
  [key in NODE_VARIANTS]?: {
    [key in ERRORS]?: ErrorType;
  };
};
type ErrorContextType = {
  getErrors: (
    nodeVariant?: NODE_VARIANTS
  ) => NodeErrorsType | NodeErrorsType[NODE_VARIANTS];
  validErrors: string[];
  updateErrorStatus: (
    nodeVariant: NODE_VARIANTS,
    errorName: ERRORS,
    status: boolean
  ) => void;
  addDefaultErrorsForNode: (nodeVariant: NODE_VARIANTS) => void;
};

export const defaultNodeErrors: NodeErrorsType = {
  initial: {
    has_one_outgoing_flow: {
      //handled
      status: true,
      value: "The INITIAL Node must have exactly one outgoing flow.",
    },
  },
  block: {
    has_incoming_flow: {
      //handled
      status: true,
      value: "BLOCK Node must have at least one incoming flow.",
    },
  },
  return: {
    has_incoming_flow: {
      //handled
      status: true,
      value: "RETURN Node must have at least one incoming flow.",
    },
  },
  flow_final: {
    has_incoming_flow: {
      //handled
      status: true,
      value: "END Node must have at least one incoming flow.",
    },
  },
  business_activity: {
    has_incoming_flow: {
      //handled
      status: true,
      value: "BUSINESS_ACTIVITY Node must have at least one incoming flow.",
    },
    has_one_outgoing_flow: {
      //handled
      status: true,
      value: "BUSINESS_ACTIVITY Node must have exactly one outgoing flow.",
    },
  },
  activity: {
    has_incoming_flow: {
      //handled
      status: true,
      value: "ACTIVITY Node must have at least one incoming flow.",
    },
    has_one_outgoing_flow: {
      //handled
      status: true,
      value: "ACTIVITY Node must have exactly one outgoing flow.",
    },
  },

  decision: {
    has_incoming_flow: {
      //handled
      status: true,
      value: "DECISION Node must have at least one incoming flow.",
    },
    valid_flow_count: {
      //handled
      status: true,
      value: "DECISION Node must have more than one outgoing flow.",
    },
    single_else_flow: {
      //handled
      status: true,
      value: "DECISION Node can have only one 'Else' flow.",
    },
  },
  merge: {
    has_incoming_flow: {
      //handled
      status: true,
      value: "MERGE Node must have at least one incoming flow.",
    },
    has_one_outgoing_flow: {
      //handled
      status: true,
      value: "MERGE Node must have exactly one outgoing flow.",
    },
  },
  event: {
    has_incoming_flow: {
      //handled
      status: true,
      value: "EVENT Node must have at least one incoming flow.",
    },
    has_outgoing_flow: {
      //handled
      status: true,
      value: "EVENT Node must have at least one outgoing flow.",
    },
  },
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nodeErrors, setNodeErrors] = useState<NodeErrorsType>({
    initial: {
      unique_initial_node: {
        status: true,
        value: "There must be exactly one INITIAL Node per AD.",
      },
    },
  });

  // updates the error status of the passed nodeVariant and errorName
  const updateErrorStatus = (
    nodeVariant: NODE_VARIANTS,
    errorName: ERRORS,
    status: boolean
  ) => {
    setNodeErrors((prevErrors) => ({
      ...prevErrors,
      [nodeVariant]: {
        ...prevErrors[nodeVariant],
        [errorName]: {
          ...prevErrors[nodeVariant]?.[errorName],
          status,
        },
      },
    }));
  };

  // returns errors object for the passed nodeVariant or all errors if nodeVariant is not passed
  const getErrors = (nodeVariant?: NODE_VARIANTS) => {
    if (nodeVariant) {
      return nodeErrors[nodeVariant];
    }
    return nodeErrors;
  };

  // returns all the errors with status:true in a plain array of strings
  const validErrors = useMemo(() => {
    const errors: string[] = [];
    Object.values(nodeErrors).forEach((errorsObj) => {
      Object.values(errorsObj).forEach((error) => {
        if (error.status) {
          errors.push(error.value);
        }
      });
    });
    // console.log(errors);

    return errors;
  }, [nodeErrors]);

  // replaces errors for the given node variant with default errors
  const addDefaultErrorsForNode = (nodeVariant: NODE_VARIANTS) => {
    if (defaultNodeErrors[nodeVariant]) {
      setNodeErrors((prevErrors) => ({
        ...prevErrors,
        [nodeVariant]: defaultNodeErrors[nodeVariant],
      }));
    }
  };

  return (
    <ErrorContext.Provider
      value={{
        getErrors,
        validErrors,
        updateErrorStatus,
        addDefaultErrorsForNode,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
