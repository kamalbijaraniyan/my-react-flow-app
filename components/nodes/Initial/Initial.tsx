import React, { useCallback, useState } from "react";
import {
  NodeProps,
  NodeResizer,
  OnResize,
  Position,
  useEdges,
} from "@xyflow/react";
import Handlers from "../../atoms/Handlers";
import { HANDLER_TYPE } from "../../atoms/Handlers.types";
import { toast } from "sonner";

const handlerConfig = [
  { id: "topSource", type: HANDLER_TYPE.SOURCE, position: Position.Top },
  { id: "rightSource", type: HANDLER_TYPE.SOURCE, position: Position.Right },
  { id: "bottomSource", type: HANDLER_TYPE.SOURCE, position: Position.Bottom },
  { id: "leftSource", type: HANDLER_TYPE.SOURCE, position: Position.Left },
];

const Initial: React.FC<NodeProps> = ({ selected, id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [size, setSize] = useState({ width: 40, height: 40 });
  const edges = useEdges();

  const onResize: OnResize = useCallback((e, { width, height }) => {
    const newSize = Math.max(width, height);
    setSize({ width: newSize, height: newSize });
  }, []);

  // const isValidConnection = useCallback(() => {
  //   const outgoingCount = edges.filter((edge) => edge.source === id).length;

  //   if (outgoingCount > 0) toast.warning("Only one outgoing flow allowed");

  //   return outgoingCount < 1;
  // }, [edges, id]);

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
      ></div>
      <Handlers
        nodeId={id}
        isHovered={isHovered}
        handlerConfigOptions={handlerConfig}
        // isValidConnection={isValidConnection}
      />
    </>
  );
};

export default Initial;
