import React, { useCallback, useState } from "react";
import { NodeProps, NodeResizer, OnResize, Position, useEdges } from "@xyflow/react";
import Handlers from "../../atoms/Handlers";
import { HANDLER_TYPE } from "../../atoms/Handlers.types";


export const handlerConfig = [
  { id: "topTarget", type: HANDLER_TYPE.TARGET, position: Position.Top },
  { id: "rightTarget", type: HANDLER_TYPE.TARGET, position: Position.Right },
  { id: "bottomTarget", type: HANDLER_TYPE.TARGET, position: Position.Bottom },
  { id: "leftTarget", type: HANDLER_TYPE.TARGET, position: Position.Left },
];

const Return: React.FC<NodeProps> = ({ selected, id }) => {
  const [size, setSize] = useState({ width: 40, height: 40 });
  const [isHovered, setIsHovered] = useState(false);
  const edges = useEdges();

  const onResize:OnResize = useCallback((e, { width, height }) => {
    const newSize = Math.max(width, height);
    setSize({ width: newSize, height: newSize });
  },[])

  const isValidConnection = useCallback(() => {
    const outgoingCount = edges.filter((edge) => edge.source === id).length;
    return outgoingCount < 1;
  },[edges, id])

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
        isValidConnection={isValidConnection}
      />
    </>
  );
};

export default Return;
