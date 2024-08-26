import { Position } from "@xyflow/react";

const getTargetNodePosition = (sourceNode, targetNode) => {
    const sourceMidX = sourceNode.position.x + sourceNode.width / 2;
    const sourceMidY = sourceNode.position.y + sourceNode.height / 2;
  
    const targetMidX = targetNode.position.x + targetNode.width / 2;
    const targetMidY = targetNode.position.y + targetNode.height / 2;
  
    const dx = targetMidX - sourceMidX;
    const dy = targetMidY - sourceMidY;
  
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
  
    if (absDx > absDy) {
      if (dx > 0) {
        return Position.Right;
      } else {
        return Position.Left;
      }
    } else {
      if (dy > 0) {
        return Position.Bottom;
      } else {
        return Position.Top;
      }
    }
  };
export default getTargetNodePosition;
  