import React, { useCallback, useState } from "react";
import { NodeProps, NodeResizer, OnResize, Position } from "@xyflow/react";
import { HANDLER_TYPE } from "../../atoms/Handlers.types";
import Handlers from "../../atoms/Handlers";

const handlerConfig = [
  { id: "topTarget", type: HANDLER_TYPE.TARGET, position: Position.Top },
  { id: "rightTarget", type: HANDLER_TYPE.TARGET, position: Position.Right },
  { id: "bottomTarget", type: HANDLER_TYPE.TARGET, position: Position.Bottom },
  { id: "leftTarget", type: HANDLER_TYPE.TARGET, position: Position.Left },
];

const Block: React.FC<NodeProps> = ({ selected, id }) => {
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
        title="Block Node"
        className={`relative w-full h-full flex items-center justify-center rounded-full border-2 border-black px-1 bg-red-600`}
        style={{
          width: size.width,
          height: size.height,
        }}
      >
        <span className="w-full h-1/6 bg-white"></span>
      </div>
      <Handlers
        nodeId={id}
        isHovered={isHovered}
        handlerConfigOptions={handlerConfig}
      />
    </>
  );
};

export default Block;
