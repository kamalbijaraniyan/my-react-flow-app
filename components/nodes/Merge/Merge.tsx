import React, { useCallback, useState } from "react";
import { NodeProps, NodeResizer, OnResize } from "@xyflow/react";
import { NodeData } from "./Merge.types";
import Handlers from "../../atoms/Handlers";
import { handlerConfig } from "../../../src/App";

const Merge: React.FC<NodeProps<NodeData>> = ({ id, data, selected }) => {
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
        className="flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Merge Node"
        style={{
          width: size.width,
          height: size.height,
        }}
      >
        <div
          className="w-full h-full bg-black flex items-center justify-center"
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
        >
          <div
            className="w-[96%] h-[96%] bg-white flex items-center justify-center"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          >
            <span className="text-xs text-black">{data?.label}</span>
          </div>
        </div>
      </div>

      <Handlers
        nodeId={id}
        isHovered={isHovered}
        handlerConfigOptions={handlerConfig}
        // isValidConnection={isValidConnection}
      />
    </>
  );
};

export default Merge;
