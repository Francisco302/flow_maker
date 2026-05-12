import React from "react";

interface MobileFrameProps {
    children: React.ReactNode;
    columns?: number;
    rows?: number;
    rowHeight?: number;
    editable?: boolean;
}

export function MobileFrame({
    children,
    columns = 12,
    rows = 25,
    rowHeight = 40,
    editable = false,
}: MobileFrameProps) {
    const contentHeight = rows * rowHeight;

    return (
        <div className="flex justify-center items-start py-8">
            <div
                className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                style={{
                    width: "390px",
                    height: "760px",
                }}
            >
                {/* Status bar simulado */}
                <div className="bg-gray-50 h-10 flex items-center justify-between px-6 text-xs text-gray-600">
                    <span>9:41</span>
                    <div className="flex gap-1">
                        <span>📶</span>
                        <span>📡</span>
                        <span>🔋</span>
                    </div>
                </div>

                {/* Contenido */}
                <div
                    className="bg-white overflow-auto"
                    style={{
                        height: "calc(760px - 40px)",
                    }}
                >
                    {editable ? (
                        // Modo edición: contenedor relativo para posicionamiento absoluto de Rnd
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                minHeight: `${contentHeight}px`,
                            }}
                        >
                            {children}
                        </div>
                    ) : (
                        // Modo preview: CSS Grid
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                                gridTemplateRows: `repeat(${rows}, ${rowHeight}px)`,
                                gap: "0px",
                                width: "100%",
                            }}
                        >
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
