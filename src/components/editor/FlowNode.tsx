import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Eye, FileText, Monitor, Square, ExternalLink } from "lucide-react";
import type { ScreenSpec } from "../../lib/spec";

interface FlowNodeProps {
  data: {
    screen: ScreenSpec;
    onPreview: (screenId: string) => void;
    onViewLogic: (screenId: string) => void;
  };
}

export function FlowNode({ data }: FlowNodeProps) {
  const { screen, onPreview, onViewLogic } = data;

  const getIcon = () => {
    switch (screen.type) {
      case "screen":
        return <Monitor size={14} />;
      case "form":
        return <FileText size={14} />;
      case "modal":
        return <Square size={14} />;
      case "external":
        return <ExternalLink size={14} />;
      default:
        return <Monitor size={14} />;
    }
  };

  const getTypeColor = () => {
    switch (screen.type) {
      case "screen":
        return "bg-white border-neutral-300";
      case "form":
        return "bg-white border-neutral-300";
      case "modal":
        return "bg-neutral-50 border-neutral-300";
      case "external":
        return "bg-neutral-50 border-neutral-300";
      default:
        return "bg-white border-neutral-300";
    }
  };

  return (
    <div
      className={`px-4 py-3 rounded-xl border shadow-sm min-w-[180px] max-w-[220px] ${getTypeColor()}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-neutral-400 !w-2 !h-2" />

      <div className="flex items-center gap-2 mb-1.5">
        <div className="text-neutral-500">{getIcon()}</div>
        <div className="font-bold text-xs text-neutral-900 truncate flex-1">
          {screen.name || "Sin título"}
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-[9px] font-medium text-neutral-500 uppercase">
          {screen.type}
        </span>
        <span className="text-[10px] text-neutral-400">
          {screen.components.length} comp.
        </span>
      </div>

      {screen.description && (
        <div className="text-[10px] text-neutral-400 mb-2.5 line-clamp-2 break-words overflow-hidden leading-relaxed">
          {screen.description}
        </div>
      )}

      <div className="flex gap-1.5">
        <button
          onClick={() => onPreview(screen.id)}
          className="flex-1 px-2 py-1.5 bg-neutral-900 text-white rounded-md text-[10px] font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1"
        >
          <Eye size={10} />
          Preview
        </button>
        <button
          onClick={() => onViewLogic(screen.id)}
          className="flex-1 px-2 py-1.5 bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-md text-[10px] font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1"
        >
          <FileText size={10} />
          Lógica
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-neutral-400 !w-2 !h-2" />
    </div>
  );
}
