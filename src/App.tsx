import React, { DragEvent, useCallback, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Initial from "../components/nodes/Initial/Initial";
import BusinessActivity from "../components/nodes/BusinessActivity/BusinessActivity";
import FlowFinal from "../components/nodes/FlowFinal/FlowFinal";
import Return from "../components/nodes/Return/Return";
import Activity from "../components/nodes/Activity/Activity";
import Event from "../components/nodes/Event/Event";
import Merge from "../components/nodes/Merge/Merge";
import Decision from "../components/nodes/Decision/Decision";
import Block from "../components/nodes/Block/Block";
import {
  CustomEdge,
  EDGE_VARIANTS,
  HANDLER_TYPE,
  NODE_VARIANTS,
} from "../components/atoms/Handlers.types";
import { StateProvider } from "../context/StateContext";

export const handlerConfig = [
  { id: "topSource", type: HANDLER_TYPE.SOURCE, position: Position.Top },
  { id: "topTarget", type: HANDLER_TYPE.TARGET, position: Position.Top },
  { id: "rightSource", type: HANDLER_TYPE.SOURCE, position: Position.Right },
  { id: "rightTarget", type: HANDLER_TYPE.TARGET, position: Position.Right },
  { id: "bottomSource", type: HANDLER_TYPE.SOURCE, position: Position.Bottom },
  { id: "bottomTarget", type: HANDLER_TYPE.TARGET, position: Position.Bottom },
  { id: "leftSource", type: HANDLER_TYPE.SOURCE, position: Position.Left },
  { id: "leftTarget", type: HANDLER_TYPE.TARGET, position: Position.Left },
];

const edgeMarkerEndStyles = {
  controlFlow: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "black",
  },
  dataFlow: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "green",
  },
};

const connectionLineStyles = {
  controlFlow: {
    stroke: "black",
  },
  dataFlow: {
    stroke: "green",
  },
};

const initialNodes = [
  {
    id: "1",
    type: NODE_VARIANTS.INITIAL,
    data: { label: "initial node", classNames: "" },
    position: { x: 250, y: 25 },
  },

  {
    id: "2",
    type: NODE_VARIANTS.BUSINESS_ACTIVITY,
    data: { label: "BusinessActivity Node" },
    position: { x: 100, y: 125 },
  },
  {
    id: "3",
    type: NODE_VARIANTS.ACTIVITY,
    data: { label: "activity node" },
    position: { x: 250, y: 250 },
  },
  {
    id: "4",
    type: NODE_VARIANTS.RETURN,
    data: { label: "Return Node" },
    position: { x: 300, y: 300 },
  },
  {
    id: "5",
    type: NODE_VARIANTS.FLOW_FINAL,
    data: { label: "FlowFInal Node" },
    position: { x: 300, y: 350 },
  },
  {
    id: "6",
    type: NODE_VARIANTS.EVENT,
    data: { label: "Event Node" },
    position: { x: 350, y: 300 },
  },
  {
    id: "7",
    type: NODE_VARIANTS.MERGE,
    data: { label: "Merge Node" },
    position: { x: 350, y: 400 },
  },
  {
    id: "8",
    type: NODE_VARIANTS.DECISION,
    data: { label: "D" },
    position: { x: 450, y: 400 },
  },
  {
    id: "9",
    type: NODE_VARIANTS.BLOCK,
    data: { label: "D" },
    position: { x: 450, y: 200 },
  },
];
const initialEdges: CustomEdge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    sourceHandle: "bottomSource",
    targetHandle: "topTarget",
    edgeVariant: EDGE_VARIANTS.ELSE_CONTROL,
    markerEnd: edgeMarkerEndStyles.controlFlow,
    style: connectionLineStyles.controlFlow,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    sourceHandle: "bottomSource",
    targetHandle: "topTarget",
    edgeVariant: EDGE_VARIANTS.CASE_CONTROL,
    markerEnd: edgeMarkerEndStyles.dataFlow,
    style: connectionLineStyles.dataFlow,
  },
];

const nodeTypes = {
  [NODE_VARIANTS.INITIAL]: Initial,
  [NODE_VARIANTS.BUSINESS_ACTIVITY]: BusinessActivity,
  [NODE_VARIANTS.RETURN]: Return,
  [NODE_VARIANTS.FLOW_FINAL]: FlowFinal,
  [NODE_VARIANTS.ACTIVITY]: Activity,
  [NODE_VARIANTS.EVENT]: Event,
  [NODE_VARIANTS.MERGE]: Merge,
  [NODE_VARIANTS.DECISION]: Decision,
  [NODE_VARIANTS.BLOCK]: Block,
};

let id = 9;
const getId = () => `${++id}`;
function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedEdge, setSelectedEdge] = useState<EDGE_VARIANTS>(
    EDGE_VARIANTS.CONTROL
  );

  // const { selectedEdge, setSelectedEdge } = useStateContext();

  // const onNodesChange = useCallback(
  //   (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
  //   [setNodes]
  // );
  // const onEdgesChange = useCallback(
  //   (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  //   [setEdges]
  // );
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source === connection.target) return;

      const newEdge = {
        ...connection,
        markerEnd:
          selectedEdge === EDGE_VARIANTS.CASE_DATA
            ? edgeMarkerEndStyles.dataFlow
            : edgeMarkerEndStyles.controlFlow,
        edgeVariant: selectedEdge,
        style:
          selectedEdge === EDGE_VARIANTS.CASE_DATA
            ? connectionLineStyles.dataFlow
            : connectionLineStyles.controlFlow,
        animated: selectedEdge === EDGE_VARIANTS.CASE_DATA ? true : false,
      };
      return setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, selectedEdge]
  );

  const { screenToFlowPosition } = useReactFlow();

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const { clientX, clientY } = event;

      const position = screenToFlowPosition({
        x: clientX,
        y: clientY,
      });

      const data = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      const newNode = {
        position,
        id: getId(),
        type: NODE_VARIANTS[
          data.variant.toUpperCase() as keyof typeof NODE_VARIANTS
        ],
        data: { label: "new Node" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition]
  );

  return (
    <div className="w-screen h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        fitView
      >
        <MiniMap nodeStrokeWidth={1} />
        <Controls />
        <Background color="#ccc" variant={BackgroundVariant.Lines} />
        <Panel position="top-left">
          <div className="flex gap-1 flex-col">
            {Object.values(NODE_VARIANTS).map((variant) => (
              <button
                key={variant}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "application/reactflow",
                    JSON.stringify({ variant })
                  )
                }
                className={`text-xss border rounded-md p-1 bg-slate-400 text-black`}
              >
                {variant}
              </button>
            ))}
          </div>
        </Panel>
        <Panel position="top-right">
          <div className="flex gap-1">
            {Object.values(EDGE_VARIANTS).map((variant) => (
              <button
                key={variant}
                className={`text-xss border rounded-md p-1 ${
                  selectedEdge === variant
                    ? "bg-slate-800 text-white"
                    : "bg-slate-400 text-black"
                }`}
                onClick={() => setSelectedEdge(variant)}
              >
                {variant}
              </button>
            ))}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

const Flow = () => (
  <ReactFlowProvider>
    <StateProvider>
      <App />
    </StateProvider>
  </ReactFlowProvider>
);
export default Flow;
