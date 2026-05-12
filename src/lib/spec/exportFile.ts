export function exportFile(
    filename: string,
    content: string,
    mimeType: string
) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function exportJSON(data: any, filename: string) {
    const content = JSON.stringify(data, null, 2);
    exportFile(filename, content, "application/json");
}

export function exportMarkdown(content: string, filename: string) {
    exportFile(filename, content, "text/markdown");
}
