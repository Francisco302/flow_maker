import { Rnd } from "react-rnd";
import type { ScreenSpec, ComponentSpec } from "../../lib/spec";
import { ComponentRenderer } from "./ComponentRenderer";
import { MobileFrame } from "./MobileFrame";
import {
  gridLayoutToPixels,
  pixelsToGridLayout,
} from "../../lib/layout/gridToStyle";
import { useAppFlowStore } from "../../store/useAppFlowStore";

interface ScreenPreviewProps {
  screen: ScreenSpec;
  mockData?: Record<string, any[]>;
  editable?: boolean;
}

export function ScreenPreview({
  screen,
  mockData,
  editable = false,
}: ScreenPreviewProps) {
  const updateComponentLayout = useAppFlowStore(
    (state) => state.updateComponentLayout
  );
  const selectedComponentId = useAppFlowStore(
    (state) => state.selectedComponentId
  );
  const selectComponent = useAppFlowStore((state) => state.selectComponent);

  const containerWidth = 390;
  const rowHeight = screen.canvas.rowHeight;
  const columnWidth = containerWidth / screen.canvas.columns;

  // Non-editable mode: allow selection via click with hover effects
  if (!editable) {
    return (
      <MobileFrame
        columns={screen.canvas.columns}
        rows={screen.canvas.rows}
        rowHeight={rowHeight}
        editable={false}
      >
        {screen.components.map((component) => {
          const isSelected = selectedComponentId === component.id;
          return (
            <div
              key={component.id}
              onClick={(e) => {
                e.stopPropagation();
                selectComponent(component.id);
              }}
              className={`cursor-pointer transition-all relative ${
                isSelected
                  ? "ring-2 ring-neutral-900 ring-offset-1 rounded-lg z-10 bg-blue-50/30"
                  : "hover:ring-1 hover:ring-neutral-300 hover:shadow-sm rounded-lg"
              }`}
              style={gridStyleForComponent(component)}
            >
              <ComponentRenderer
                component={component}
                mockData={mockData}
                skipGridStyle={true}
              />
            </div>
          );
        })}
      </MobileFrame>
    );
  }

  // Editable mode: drag & resize with react-rnd
  return (
    <MobileFrame
      columns={screen.canvas.columns}
      rows={screen.canvas.rows}
      rowHeight={rowHeight}
      editable={true}
    >
      {screen.components.map((component) => {
        const pixels = gridLayoutToPixels(
          component.layout,
          containerWidth,
          rowHeight
        );
        const isSelected = selectedComponentId === component.id;

        return (
          <Rnd
            key={component.id}
            position={{ x: pixels.x, y: pixels.y }}
            size={{ width: pixels.width, height: pixels.height }}
            onDragStop={(_e, d) => {
              const newLayout = pixelsToGridLayout(
                d.x,
                d.y,
                pixels.width,
                pixels.height,
                containerWidth,
                rowHeight
              );
              updateComponentLayout(screen.id, component.id, {
                ...component.layout,
                colStart: newLayout.colStart,
                rowStart: newLayout.rowStart,
              });
              selectComponent(component.id);
            }}
            onResizeStop={(_e, _direction, ref, _delta, position) => {
              const newWidth = parseInt(ref.style.width);
              const newHeight = parseInt(ref.style.height);
              const newLayout = pixelsToGridLayout(
                position.x,
                position.y,
                newWidth,
                newHeight,
                containerWidth,
                rowHeight
              );
              updateComponentLayout(screen.id, component.id, newLayout);
              selectComponent(component.id);
            }}
            bounds="parent"
            dragGrid={[columnWidth, rowHeight]}
            resizeGrid={[columnWidth, rowHeight]}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              selectComponent(component.id);
            }}
            style={{
              border: isSelected
                ? "2px solid #171717"
                : "1px dashed #d4d4d4",
              borderRadius: "8px",
              backgroundColor: isSelected
                ? "rgba(23, 23, 23, 0.03)"
                : "transparent",
              zIndex: isSelected ? 10 : 1,
              cursor: "move",
              transition: "border-color 0.15s, background-color 0.15s",
            }}
          >
            <div
              className="w-full h-full"
              style={{ pointerEvents: "none" }}
            >
              <div className="w-full h-full p-1 flex items-center justify-center overflow-hidden">
                <ComponentRenderer
                  component={component}
                  mockData={mockData}
                  skipGridStyle={true}
                />
              </div>
            </div>
          </Rnd>
        );
      })}
    </MobileFrame>
  );
}

/** Generate inline grid placement style for non-editable mode */
function gridStyleForComponent(component: ComponentSpec): React.CSSProperties {
  return {
    gridColumnStart: component.layout.colStart,
    gridColumnEnd: component.layout.colStart + component.layout.colSpan,
    gridRowStart: component.layout.rowStart,
    gridRowEnd: component.layout.rowStart + component.layout.rowSpan,
  };
}
