import React, { useState } from "react";
import { NodeProps, NodeResizer } from "@xyflow/react";
import Handlers from "../../atoms/Handlers";
import { handlerConfig } from "../../../src/App";

const Return: React.FC<NodeProps> = ({ selected, id }) => {
  const [size, setSize] = useState({ width: 40, height: 40 });
  const [isHovered, setIsHovered] = useState(false);

  const onResize = (e, { width, height }) => {
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative rounded-full text-white text-xs bg-black flex items-center justify-center overflow-hidden border-white border-2 ring-1 ring-black`}
        style={{
          width: size.width,
          height: size.height,
        }}
      ></div>
      <Handlers
        nodeId={id}
        isHovered={isHovered}
        handlerConfigOptions={handlerConfig}
      />
    </>
  );
};

export default Return;
