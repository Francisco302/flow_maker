export function snapToColumn(x: number, containerWidth: number): number {
    const columnWidth = containerWidth / 12;
    return Math.round(x / columnWidth) * columnWidth;
}

export function snapToRow(y: number, rowHeight: number): number {
    return Math.round(y / rowHeight) * rowHeight;
}

export function snapPosition(
    x: number,
    y: number,
    containerWidth: number,
    rowHeight: number
) {
    return {
        x: snapToColumn(x, containerWidth),
        y: snapToRow(y, rowHeight),
    };
}

export function snapSize(
    width: number,
    height: number,
    containerWidth: number,
    rowHeight: number
) {
    const columnWidth = containerWidth / 12;
    return {
        width: Math.max(columnWidth, Math.round(width / columnWidth) * columnWidth),
        height: Math.max(rowHeight, Math.round(height / rowHeight) * rowHeight),
    };
}
