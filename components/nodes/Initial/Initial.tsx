import React, { useCallback, useState } from "react";
import {
  NodeProps,
  NodeResizer,
  OnResize,
  Position,
} from "@xyflow/react";
import Handlers from "../../atoms/Handlers";
import { HANDLER_TYPE } from "../../atoms/Handlers.types";
import { NodeData } from "./Initial.types";

const handlerConfig = [
  { id: "topSource", type: HANDLER_TYPE.SOURCE, position: Position.Top },
  { id: "rightSource", type: HANDLER_TYPE.SOURCE, position: Position.Right },
  { id: "bottomSource", type: HANDLER_TYPE.SOURCE, position: Position.Bottom },
  { id: "leftSource", type: HANDLER_TYPE.SOURCE, position: Position.Left },
];

const Initial: React.FC<NodeProps<NodeData>> = ({ selected, id, data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [size, setSize] = useState({ width: 40, height: 40 });

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
        title="Initial Node"
        className={`relative rounded-full text-white text-xs bg-black flex items-center justify-center overflow-hidden`}
        style={{
          width: size.width,
          height: size.height,
        }}
      >{data?.label}</div>
      <Handlers
        nodeId={id}
        isHovered={isHovered}
        handlerConfigOptions={handlerConfig}
      />
    </>
  );
};

export default Initial;
