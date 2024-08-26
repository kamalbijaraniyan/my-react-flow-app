import React, { useState } from "react";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { NodeData } from "./Activity.types";
import Handlers from "../../atoms/Handlers";
import { handlerConfig } from "../../../src/App";

const Activity: React.FC<NodeProps<NodeData>> = ({ id, data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {selected ? <NodeResizer minWidth={100} minHeight={30} /> : null}

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${data?.classNames} relative text-xs h-full w-full flex items-center justify-center rounded-md bg-[#d2d9ef] border-blue-950 border-2 box-border p-2`}
      >
        {data.label}
      </div>

      <Handlers
        nodeId={id}
        isHovered={isHovered}
        handlerConfigOptions={handlerConfig}
      />
    </>
  );
};

export default Activity;
