import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Copy, Download, Check } from "lucide-react";
import { useAppFlowStore } from "../../store/useAppFlowStore";
import { generateMarkdown, exportMarkdown } from "../../lib/spec";

export function MarkdownModal() {
    const isOpen = useAppFlowStore((state) => state.isMarkdownOpen);
    const toggleMarkdown = useAppFlowStore((state) => state.toggleMarkdown);
    const spec = useAppFlowStore((state) => state.spec);
    const [copied, setCopied] = useState(false);

    const markdown = generateMarkdown(spec);

    const handleCopy = () => {
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const filename = `${spec.name.toLowerCase().replace(/\s+/g, "-")}-v${spec.version}.md`;
        exportMarkdown(markdown, filename);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={toggleMarkdown}
            title="Documentación Markdown"
            size="xl"
        >
            <div className="space-y-4">
                <div className="flex gap-2">
                    <Button
                        onClick={handleCopy}
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? "Copiado" : "Copiar"}
                    </Button>
                    <Button
                        onClick={handleDownload}
                        variant="primary"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Download size={16} />
                        Descargar .md
                    </Button>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-[60vh]">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                        {markdown}
                    </pre>
                </div>
            </div>
        </Modal>
    );
}
