import React from "react";
import { Download, FileText } from "lucide-react";
import { FlowCanvas } from "./FlowCanvas";
import { ScreensSidebar } from "./ScreensSidebar";
import { InspectorPanel } from "./InspectorPanel";
import { ScreenPreviewModal } from "./ScreenPreviewModal";
import { LogicPanelModal } from "./LogicPanelModal";
import { MarkdownModal } from "./MarkdownModal";
import { useAppFlowStore } from "../../store/useAppFlowStore";
import { Button } from "../common/Button";
import { exportJSON } from "../../lib/spec";

export function AppFlowEditor() {
    const spec = useAppFlowStore((state) => state.spec);
    const selectedScreenId = useAppFlowStore((state) => state.selectedScreenId);
    const getSelectedScreen = useAppFlowStore((state) => state.getSelectedScreen);
    const toggleMarkdown = useAppFlowStore((state) => state.toggleMarkdown);

    const selectedScreen = getSelectedScreen();

    const handleExportJSON = () => {
        const filename = `${spec.name.toLowerCase().replace(/\s+/g, "-")}-flow-spec-v${spec.version}.json`;
        exportJSON(spec, filename);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{spec.name}</h1>
                        <p className="text-sm text-gray-500">Versión {spec.version}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleExportJSON}
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Download size={16} />
                        Exportar JSON
                    </Button>
                    <Button
                        onClick={toggleMarkdown}
                        variant="primary"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <FileText size={16} />
                        Generar Markdown
                    </Button>
                </div>
            </header>

            {/* Main content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <ScreensSidebar screens={spec.screens} />

                {/* Canvas */}
                <div className="flex-1">
                    <FlowCanvas spec={spec} />
                </div>

                {/* Inspector */}
                <InspectorPanel spec={spec} selectedScreen={selectedScreen} />
            </div>

            {/* Modals */}
            <ScreenPreviewModal />
            <LogicPanelModal />
            <MarkdownModal />
        </div>
    );
}
