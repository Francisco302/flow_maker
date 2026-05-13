import React, { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import type { Node, Edge, Connection, EdgeMouseHandler } from "@xyflow/react";
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
  const addFlow = useAppFlowStore((state) => state.addFlow);
  const removeFlow = useAppFlowStore((state) => state.removeFlow);
  const updateFlow = useAppFlowStore((state) => state.updateFlow);

  const [editingEdge, setEditingEdge] = useState<string | null>(null);
  const [edgeLabel, setEdgeLabel] = useState("");

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
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
        style: { strokeWidth: 2 },
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

  // Handle new connection (drag from source handle to target handle)
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        addFlow(connection.source, connection.target);
      }
    },
    [addFlow]
  );

  // Handle edge double-click to edit label
  const onEdgeDoubleClick: EdgeMouseHandler = useCallback(
    (_event, edge) => {
      const flow = spec.flows.find((f) => f.id === edge.id);
      setEdgeLabel(flow?.label || "");
      setEditingEdge(edge.id);
    },
    [spec.flows]
  );

  // Handle edge right-click to delete
  const onEdgeContextMenu: EdgeMouseHandler = useCallback(
    (event, edge) => {
      event.preventDefault();
      if (confirm("¿Eliminar esta conexión?")) {
        removeFlow(edge.id);
      }
    },
    [removeFlow]
  );

  const handleSaveEdgeLabel = () => {
    if (editingEdge) {
      updateFlow(editingEdge, { label: edgeLabel.trim() || undefined });
      setEditingEdge(null);
      setEdgeLabel("");
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 relative">
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onConnect={onConnect}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onEdgeContextMenu={onEdgeContextMenu}
        nodeTypes={nodeTypes}
        fitView
        connectionLineStyle={{ strokeWidth: 2, stroke: "#6b7280" }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {/* Connection hint */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 pointer-events-none">
        Arrastra entre nodos para conectar • Doble clic en conexión para editar • Clic derecho para eliminar
      </div>

      {/* Edge label editor modal */}
      {editingEdge && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setEditingEdge(null)}
          />
          <div className="relative bg-white rounded-lg shadow-xl p-5 w-80">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Etiqueta de conexión
            </h3>
            <input
              type="text"
              value={edgeLabel}
              onChange={(e) => setEdgeLabel(e.target.value)}
              placeholder="Ej: Navegar, Enviar formulario..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdgeLabel();
                if (e.key === "Escape") setEditingEdge(null);
              }}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingEdge(null)}
                className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdgeLabel}
                className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
