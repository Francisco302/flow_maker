import React, { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FlowNode } from "./FlowNode";
import type { AppFlowSpec } from "../../lib/spec";
import { useAppFlowStore } from "../../store/useAppFlowStore";

interface FlowCanvasProps {
  spec: AppFlowSpec;
}

const nodeTypes = {
  screenNode: FlowNode,
};

export function FlowCanvas({ spec }: FlowCanvasProps) {
  const openPreview = useAppFlowStore((state) => state.openPreview);
  const openLogic = useAppFlowStore((state) => state.openLogic);
  const selectScreen = useAppFlowStore((state) => state.selectScreen);

  // Rebuild nodes/edges from spec on every render to reflect live changes
  const nodes: Node[] = useMemo(
    () =>
      spec.screens.map((screen) => ({
        id: screen.id,
        type: "screenNode",
        position: screen.nodePosition,
        data: {
          screen,
          onPreview: openPreview,
          onViewLogic: openLogic,
        },
      })),
    [spec.screens, openPreview, openLogic]
  );

  const edges: Edge[] = useMemo(
    () =>
      spec.flows.map((flow) => ({
        id: flow.id,
        source: flow.sourceScreenId,
        target: flow.targetScreenId,
        label: flow.label,
        animated: true,
      })),
    [spec.flows]
  );

  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges);

  // Sync when spec changes
  React.useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes, setLocalNodes]);

  React.useEffect(() => {
    setLocalEdges(edges);
  }, [edges, setLocalEdges]);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      selectScreen(node.id);
    },
    [selectScreen]
  );

  return (
    <div className="w-full h-full bg-gray-50">
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
