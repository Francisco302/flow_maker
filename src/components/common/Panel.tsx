import React from "react";

interface PanelProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

export function Panel({ children, title, className = "" }: PanelProps) {
    return (
        <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
            {title && (
                <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
            )}
            <div className="p-4">{children}</div>
        </div>
    );
}
