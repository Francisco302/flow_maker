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
  const statusBarHeight = 40;
  const frameHeight = contentHeight + statusBarHeight;

  return (
    <div className="flex justify-center items-start py-4">
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{
          width: "390px",
          height: `${frameHeight}px`,
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

        {/* Contenido — sin scroll, muestra todo */}
        <div
          className="bg-white"
          style={{
            height: `${contentHeight}px`,
          }}
        >
          {editable ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: `${contentHeight}px`,
              }}
            >
              {children}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, ${rowHeight}px)`,
                gap: "0px",
                width: "100%",
                height: `${contentHeight}px`,
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
