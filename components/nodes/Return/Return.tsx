import React, { useCallback, useState } from "react";
import { NodeProps, NodeResizer, OnResize, Position } from "@xyflow/react";
import Handlers from "../../atoms/Handlers";
import { HANDLER_TYPE } from "../../atoms/Handlers.types";
import { NodeData } from "./Return.types";

export const handlerConfig = [
  { id: "topTarget", type: HANDLER_TYPE.TARGET, position: Position.Top },
  { id: "rightTarget", type: HANDLER_TYPE.TARGET, position: Position.Right },
  { id: "bottomTarget", type: HANDLER_TYPE.TARGET, position: Position.Bottom },
  { id: "leftTarget", type: HANDLER_TYPE.TARGET, position: Position.Left },
];

const Return: React.FC<NodeProps<NodeData>> = ({ selected, id, data }) => {
  const [size, setSize] = useState({ width: 40, height: 40 });
  const [isHovered, setIsHovered] = useState(false);

  const onResize: OnResize = useCallback((e, { width, height }) => {
    const newSize = Math.max(width, height);
    setSize({ width: newSize, height: newSize });
  }, []);

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Return Node"
        className={`relative rounded-full text-white text-xs bg-black flex items-center justify-center overflow-hidden border-white border-2 ring-1 ring-black`}
        style={{
          width: size.width,
          height: size.height,
        }}
      >
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

export default Return;
