import React from "react";
import { Monitor, FileText, Square } from "lucide-react";
import type { ScreenSpec } from "../../lib/spec";
import { useAppFlowStore } from "../../store/useAppFlowStore";

interface ScreensSidebarProps {
    screens: ScreenSpec[];
}

export function ScreensSidebar({ screens }: ScreensSidebarProps) {
    const selectedScreenId = useAppFlowStore((state) => state.selectedScreenId);
    const selectScreen = useAppFlowStore((state) => state.selectScreen);

    const getIcon = (type: string) => {
        switch (type) {
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

    return (
        <div className="w-64 bg-white border-r border-gray-200 overflow-auto">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">Pantallas</h2>
                <p className="text-xs text-gray-500 mt-1">{screens.length} pantallas</p>
            </div>

            <div className="p-2">
                {screens.map((screen) => (
                    <button
                        key={screen.id}
                        onClick={() => selectScreen(screen.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${selectedScreenId === screen.id
                            ? "bg-blue-100 border border-blue-300"
                            : "hover:bg-gray-100"
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            {getIcon(screen.type)}
                            <span className="font-medium text-sm text-gray-800">
                                {screen.name}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">
                            {screen.type} • {screen.components.length} comp.
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
