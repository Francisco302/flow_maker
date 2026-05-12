import type { ComponentSpec } from "../spec/types";

export function gridLayoutToCss(layout: ComponentSpec["layout"]) {
    return {
        gridColumnStart: layout.colStart,
        gridColumnEnd: layout.colStart + layout.colSpan,
        gridRowStart: layout.rowStart,
        gridRowEnd: layout.rowStart + layout.rowSpan,
    };
}

export function gridLayoutToPixels(
    layout: ComponentSpec["layout"],
    containerWidth: number,
    rowHeight: number
) {
    const columnWidth = containerWidth / 12;
    return {
        x: (layout.colStart - 1) * columnWidth,
        y: (layout.rowStart - 1) * rowHeight,
        width: layout.colSpan * columnWidth,
        height: layout.rowSpan * rowHeight,
    };
}

export function pixelsToGridLayout(
    x: number,
    y: number,
    width: number,
    height: number,
    containerWidth: number,
    rowHeight: number
): ComponentSpec["layout"] {
    const columnWidth = containerWidth / 12;

    let colStart = Math.max(1, Math.round(x / columnWidth) + 1);
    let colSpan = Math.max(1, Math.round(width / columnWidth));
    let rowStart = Math.max(1, Math.round(y / rowHeight) + 1);
    let rowSpan = Math.max(1, Math.round(height / rowHeight));

    // Ensure we don't exceed 12 columns
    if (colStart + colSpan > 13) {
        colSpan = 13 - colStart;
    }

    return {
        colStart,
        colSpan,
        rowStart,
        rowSpan,
    };
}
