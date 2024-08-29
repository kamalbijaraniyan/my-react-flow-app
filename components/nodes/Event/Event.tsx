import React, { useState } from "react";
import { Connection, Edge, NodeProps, NodeResizer, OnResize, useNodes } from "@xyflow/react";
import Handlers from "../../atoms/Handlers";
import { handlerConfig } from "../../../src/App";
import { getNodeVariantInfo } from "../../../lib/getNodeVariantInfo";
import { NODE_VARIANTS } from "../../../components/atoms/Handlers.types";

const Event: React.FC<NodeProps> = ({ selected, id }) => {
  const [size, setSize] = useState({ width: 40, height: 40 });
  const [isHovered, setIsHovered] = useState(false);
  const nodes = useNodes()

  const onResize:OnResize = (e, { width, height }) => {
    const newSize = Math.max(width, height);
    setSize({ width: newSize, height: newSize });
  };

  const isValidConnection = (connection: Connection|Edge) => {
    const {target} = connection;
    const {nodeVariant} = getNodeVariantInfo(target, nodes)
    if (
      nodeVariant !== NODE_VARIANTS.BUSINESS_ACTIVITY &&
      nodeVariant !== NODE_VARIANTS.ACTIVITY &&
      nodeVariant !== NODE_VARIANTS.MERGE
    ) {
      
      return false
    }

    return true
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
        className={`relative rounded-full text-black flex items-center justify-center overflow-hidden  bg-[#d2d9ef] border-blue-950 border-2`}
        style={{
          width: size.width,
          height: size.height,
          fontSize: size.width / 1.5,
        }}
      >
        E
      </div>
      <Handlers
        nodeId={id}
        isHovered={isHovered}
        handlerConfigOptions={handlerConfig}
        isValidConnection={isValidConnection}
      />
    </>
  );
};

export default Event;
