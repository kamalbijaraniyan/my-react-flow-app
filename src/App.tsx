import React, {
  DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  OnConnectEnd,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
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
import ContextMenu from "../components/atoms/EdgeOptionMenu/EdgeOptionMenu";
import { MenuPosition } from "components/atoms/EdgeOptionMenu/EdgeOptionMenu.types";
import TestComponent from "../components/TestComponent";
import { getNodeVariantInfo } from "../lib/getNodeVariantInfo";
import { toast, Toaster } from "sonner";
import { globalValidation } from "../lib/globalValidation";

let toastActive = false;
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

export const edgeMarkerEndStyles = {
  normalFlow: {
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

export const connectionLineStyles = {
  normalFlow: {
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
    markerEnd: edgeMarkerEndStyles.normalFlow,
    style: connectionLineStyles.normalFlow,
    animated: false,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    sourceHandle: "bottomSource",
    targetHandle: "topTarget",
    edgeVariant: EDGE_VARIANTS.CASE_CONTROL,
    markerEnd: edgeMarkerEndStyles.normalFlow,
    style: connectionLineStyles.normalFlow,
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
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "2",
      type: "default",
      data: { label: "test Node" },
      position: { x: 100, y: 125 },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);

  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null
  );
  const [menuPosition, setMenuPosition] = useState<MenuPosition>();
  const [visible, setVisible] = useState(false);
  const flowRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [globalValidationState, setGlobalValidationState] = useState<string[]>(
    []
  );

  const onConnectStart = useCallback(() => setPendingConnection(null), []);

  const onConnect = useCallback(
    (connection: Connection) => {
      const { source, target } = connection;
      if (source === target) return;
      const sourceNodeInfo = getNodeVariantInfo(source, nodes);
      const targetNodeInfo = getNodeVariantInfo(target, nodes);

      switch (targetNodeInfo.nodeVariant) {
        case NODE_VARIANTS.BLOCK:
          if (
            sourceNodeInfo.nodeVariant !== NODE_VARIANTS.INITIAL &&
            sourceNodeInfo.nodeVariant !== NODE_VARIANTS.DECISION
          ) {
            toast.warning(
              "BLOCK node can only be connected to INITIAL or DECISION node"
            );
            return;
          }
          break;

        case NODE_VARIANTS.EVENT:
          if (
            sourceNodeInfo.nodeVariant !== NODE_VARIANTS.BUSINESS_ACTIVITY &&
            sourceNodeInfo.nodeVariant !== NODE_VARIANTS.ACTIVITY &&
            sourceNodeInfo.nodeVariant !== NODE_VARIANTS.MERGE
          ) {
            toast.warning(
              "EVENT node can only be connected to BUSINESS_ACTIVITY, ACTIVITY or MERGE node"
            );
            return;
          }
          break;

        default:
          break;
      }

      setPendingConnection(connection);
    },
    [nodes]
  );

  const onConnectionEnd: OnConnectEnd = useCallback(
    (event) => {
      if (flowRef.current) {
        const pane = flowRef.current.getBoundingClientRect();
        let clientX = 0;
        let clientY = 0;

        if (event instanceof MouseEvent) {
          clientX = event.clientX;
          clientY = event.clientY;
        } else if (event instanceof TouchEvent) {
          if (event.touches.length > 0) {
            const touch = event.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
          }
        }

        const newPosition = {
          top: clientY < pane.height - 200 ? clientY : undefined,
          left: clientX < pane.width - 200 ? clientX : undefined,
          right: clientX >= pane.width - 200 ? pane.width - clientX : undefined,
          bottom:
            clientY >= pane.height - 200 ? pane.height - clientY : undefined,
        };

        setMenuPosition(newPosition);
        setVisible(true);
      }
    },
    [flowRef, setMenuPosition, setVisible]
  );
  const onPaneClick = useCallback(() => setVisible(false), []);

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

      const newNodeType =
        NODE_VARIANTS[data.variant.toUpperCase() as keyof typeof NODE_VARIANTS];

      if (
        newNodeType === NODE_VARIANTS.INITIAL &&
        nodes.some((node) => node.type === NODE_VARIANTS.INITIAL)
      ) {
        toast.warning("Only one INITIAL node is allowed");
        return;
      }

      const newNode = {
        position,
        id: getId(),
        type: NODE_VARIANTS[
          data.variant.toUpperCase() as keyof typeof NODE_VARIANTS
        ],
        data: { label: "new Node" },
        origin: [0.4, 0.4],
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, nodes]
  );

  const isValidConnection = (connection: Connection | Edge) => {
    const { source } = connection;
    const srcNodeVariant = getNodeVariantInfo(source, nodes).nodeVariant;

    if (
      srcNodeVariant === NODE_VARIANTS.ACTIVITY ||
      srcNodeVariant === NODE_VARIANTS.BUSINESS_ACTIVITY ||
      srcNodeVariant === NODE_VARIANTS.INITIAL ||
      srcNodeVariant === NODE_VARIANTS.MERGE
    ) {
      const outgoingCount = edges.filter(
        (edge) => edge.source === source
      ).length;

      if (outgoingCount > 0) {
        if (!toastActive) {
          toast.warning(
            `Only one outgoing flow allowed from ${srcNodeVariant.toLocaleUpperCase()} Node`
          );
          toastActive = true;
          setTimeout(() => (toastActive = false), 2000);
        }
        return false;
      }

      return true;
    }

    return true;
  };

  useEffect(() => {
    setGlobalValidationState(globalValidation(nodes, edges));
  }, [nodes, edges]);

  const handleExport = ()=>{
    const data = {
      nodes: nodes,
      edges: edges,
    };
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export Successful");
  }

  return (
    <div className="w-screen h-screen">
      {/* <TestComponent/> */}
      <ReactFlow
        ref={flowRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectionEnd}
        onConnectStart={onConnectStart}
        nodeTypes={nodeTypes}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        fitView
        onPaneClick={onPaneClick}
        isValidConnection={isValidConnection}
      >
        {visible && pendingConnection ? (
          <ContextMenu
            menuClose={onPaneClick}
            position={menuPosition}
            connection={pendingConnection}
            setEdges={setEdges}
          />
        ) : null}
        <Toaster />
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
          <div className="flex gap-1 flex-col">
            <button
              className={`h-14 w-44 rounded-md text-white disabled:cursor-not-allowed ${
                globalValidationState.length == 0
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
              disabled={globalValidationState.length > 0}
              onClick={handleExport}
            >
              Export
            </button>
            {globalValidationState.length > 0 ? (
              <div className="pl-5 bg-gray-200 w-44">
                <ul className="flex flex-col gap-1 p-2 list-disc w-full">
                  {globalValidationState.map((err) => (
                    <li
                      className="text-red-700 w-full text-xs"
                      key={err}
                      title={err}
                    >
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
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
