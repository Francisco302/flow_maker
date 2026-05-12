import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Eye, FileText, Monitor, Square } from "lucide-react";
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
                return <Monitor size={16} />;
            case "form":
                return <FileText size={16} />;
            case "modal":
                return <Square size={16} />;
            default:
                return <Monitor size={16} />;
        }
    };

    const getTypeColor = () => {
        switch (screen.type) {
            case "screen":
                return "bg-blue-50 border-blue-300";
            case "form":
                return "bg-green-50 border-green-300";
            case "modal":
                return "bg-purple-50 border-purple-300";
            default:
                return "bg-gray-50 border-gray-300";
        }
    };

    return (
        <div
            className={`px-4 py-3 rounded-lg border-2 shadow-md min-w-[200px] ${getTypeColor()}`}
        >
            <Handle type="target" position={Position.Top} />

            <div className="flex items-center gap-2 mb-2">
                {getIcon()}
                <div className="font-semibold text-sm text-gray-800">{screen.name}</div>
            </div>

            <div className="text-xs text-gray-600 mb-2">
                {screen.type} • {screen.components.length} componentes
            </div>

            {screen.description && (
                <div className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {screen.description}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={() => onPreview(screen.id)}
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                >
                    <Eye size={12} />
                    Preview
                </button>
                <button
                    onClick={() => onViewLogic(screen.id)}
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                >
                    <FileText size={12} />
                    Lógica
                </button>
            </div>

            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
