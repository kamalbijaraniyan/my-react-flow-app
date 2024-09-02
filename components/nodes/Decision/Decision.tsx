import React, { useCallback, useState } from "react";
import { NodeProps, NodeResizer, OnResize } from "@xyflow/react";
import { NodeData } from "./Decision.types";
import Handlers from "../../atoms/Handlers";
import { handlerConfig } from "../../../src/App";

const Decision: React.FC<NodeProps<NodeData>> = ({ id, data, selected }) => {
  const [size, setSize] = useState({ width: 40, height: 40 });
  const [isHovered, setIsHovered] = useState(false);

  const onResize:OnResize = useCallback((e, { width, height }) => {
    setSize({ width, height });
  },[])

  return (
    <>
      {selected ? (
        <NodeResizer minWidth={100} minHeight={30} onResize={onResize} />
      ) : null}

      <div
        className="flex items-center justify-center h-full w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Decision Node"
        style={{
          width: size.width,
          height: size.height,
        }}
      >
        <div
          className="w-full h-full bg-blue-950 flex items-center justify-center"
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
        >
          <div
            className="w-[96%] h-[96%] bg-[#d2d9ef] flex items-center justify-center"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          >
            <span className="text-xs text--blue-950">{data?.label}</span>
          </div>
        </div>
      </div>

      <Handlers
        nodeId={id}
        isHovered={isHovered}
        handlerConfigOptions={handlerConfig}
      />
    </>
  );
};

export default Decision;
