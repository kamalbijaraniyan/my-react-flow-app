import React, { useState } from "react";
import { NodeProps, NodeResizer, OnResize, Position } from "@xyflow/react";
import Handlers from "../../atoms/Handlers";
import { HANDLER_TYPE } from "../../atoms/Handlers.types";
import { NodeData } from "./FlowFinal.types";

export const handlerConfig = [
  { id: "topTarget", type: HANDLER_TYPE.TARGET, position: Position.Top },
  { id: "rightTarget", type: HANDLER_TYPE.TARGET, position: Position.Right },
  { id: "bottomTarget", type: HANDLER_TYPE.TARGET, position: Position.Bottom },
  { id: "leftTarget", type: HANDLER_TYPE.TARGET, position: Position.Left },
];

const FlowFinal: React.FC<NodeProps<NodeData>> = ({ selected, id, data }) => {
  const [size, setSize] = useState({ width: 40, height: 40 });
  const [isHovered, setIsHovered] = useState(false);

  const onResize:OnResize = (e, { width, height }) => {
    const newSize = Math.max(width, height);
    setSize({ width: newSize, height: newSize });
  };
  return (
    <>
      {selected ? (
        <NodeResizer
          minWidth={30}
          minHeight={30}
          keepAspectRatio={true}
          onResize={onResize}
        />
      ) : null}

      <div
        className="relative w-full h-full  rounded-full border-2 border-black"
        style={{ width: size.width, height: size.height }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="End Node"
      >
        <span className="absolute top-1/2 left-0 w-full h-px bg-black -translate-y-1/2 rotate-45"></span>
        <span className="absolute top-0 left-1/2 w-px h-full bg-black -translate-x-1/2 rotate-45"></span>
        <span className="absolute top-0 left-0 flex justify-center items-center text-center overflow-hidden w-full h-full rounded-full">
          {data?.label}
        </span>
      </div>
      <Handlers
        nodeId={id}
        isHovered={isHovered}
        handlerConfigOptions={handlerConfig}
      />
    </>
  );
};

export default FlowFinal;
