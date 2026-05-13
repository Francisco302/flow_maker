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
  const statusBarHeight = 44;
  const homeIndicatorHeight = 20;
  const frameHeight = contentHeight + statusBarHeight + homeIndicatorHeight;

  return (
    <div className="flex justify-center items-start py-4">
      <div
        className="bg-white rounded-[2.5rem] shadow-xl border border-neutral-200 overflow-hidden relative"
        style={{
          width: "390px",
          height: `${frameHeight}px`,
        }}
      >
        {/* Status bar */}
        <div
          className="bg-white flex items-center justify-between px-7 relative z-10"
          style={{ height: `${statusBarHeight}px` }}
        >
          <span className="text-[11px] font-semibold text-neutral-900">09:10</span>
          <div className="flex items-center gap-1">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>

        {/* Content area */}
        <div
          className="bg-white"
          style={{ height: `${contentHeight}px` }}
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

        {/* Home indicator */}
        <div
          className="bg-white flex items-center justify-center"
          style={{ height: `${homeIndicatorHeight}px` }}
        >
          <div className="w-28 h-1 rounded-full bg-neutral-900" />
        </div>
      </div>
    </div>
  );
}

// ─── Minimal status bar icons ───

function SignalIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="text-neutral-900">
      <rect x="0" y="7" width="2" height="3" rx="0.5" fill="currentColor" />
      <rect x="3" y="5" width="2" height="5" rx="0.5" fill="currentColor" />
      <rect x="6" y="3" width="2" height="7" rx="0.5" fill="currentColor" />
      <rect x="9" y="0" width="2" height="10" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="text-neutral-900">
      <path d="M7 9a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" />
      <path d="M4.5 6.5a3.5 3.5 0 015 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M2.5 4.5a6 6 0 019 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="22" height="10" viewBox="0 0 22 10" fill="none" className="text-neutral-900">
      <rect x="0.5" y="0.5" width="19" height="9" rx="2" stroke="currentColor" strokeWidth="1" />
      <rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor" />
      <rect x="20.5" y="3" width="1.5" height="4" rx="0.5" fill="currentColor" />
    </svg>
  );
}
