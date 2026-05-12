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

    if (!editable) {
        return (
            <MobileFrame
                columns={screen.canvas.columns}
                rows={screen.canvas.rows}
                rowHeight={rowHeight}
                editable={false}
            >
                {screen.components.map((component) => (
                    <ComponentRenderer
                        key={component.id}
                        component={component}
                        mockData={mockData}
                    />
                ))}
            </MobileFrame>
        );
    }

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
                                ? "2px solid #2563eb"
                                : "2px dashed #60a5fa",
                            backgroundColor: isSelected
                                ? "rgba(37, 99, 235, 0.08)"
                                : "rgba(96, 165, 250, 0.05)",
                            zIndex: isSelected ? 10 : 1,
                            cursor: "move",
                        }}
                    >
                        <div
                            className="w-full h-full"
                            style={{ pointerEvents: "none" }}
                        >
                            <ComponentRendererEditable
                                component={component}
                                mockData={mockData}
                            />
                        </div>
                    </Rnd>
                );
            })}
        </MobileFrame>
    );
}

function ComponentRendererEditable({
    component,
    mockData,
}: {
    component: ComponentSpec;
    mockData?: Record<string, any[]>;
}) {
    return (
        <div className="w-full h-full p-2 flex items-center justify-center overflow-hidden">
            <ComponentRenderer
                component={component}
                mockData={mockData}
                skipGridStyle={true}
            />
        </div>
    );
}
