import React, { useCallback } from "react";
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

    // Convert screens to nodes
    const initialNodes: Node[] = spec.screens.map((screen) => ({
        id: screen.id,
        type: "screenNode",
        position: screen.nodePosition,
        data: {
            screen,
            onPreview: openPreview,
            onViewLogic: openLogic,
        },
    }));

    // Convert flows to edges
    const initialEdges: Edge[] = spec.flows.map((flow) => ({
        id: flow.id,
        source: flow.sourceScreenId,
        target: flow.targetScreenId,
        label: flow.label,
        animated: true,
    }));

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onNodeClick = useCallback(
        (event: React.MouseEvent, node: Node) => {
            selectScreen(node.id);
        },
        [selectScreen]
    );

    return (
        <div className="w-full h-full bg-gray-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
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
