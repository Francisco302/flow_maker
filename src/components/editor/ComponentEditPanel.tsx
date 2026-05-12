import { X } from "lucide-react";
import { useAppFlowStore } from "../../store/useAppFlowStore";
import type { ComponentSpec } from "../../lib/spec";

export function ComponentEditPanel() {
    const selectedComponentId = useAppFlowStore(
        (state) => state.selectedComponentId
    );
    const previewScreenId = useAppFlowStore((state) => state.previewScreenId);
    const spec = useAppFlowStore((state) => state.spec);
    const selectComponent = useAppFlowStore((state) => state.selectComponent);
    const updateComponentProps = useAppFlowStore(
        (state) => state.updateComponentProps
    );
    const updateComponentLayout = useAppFlowStore(
        (state) => state.updateComponentLayout
    );

    if (!selectedComponentId || !previewScreenId) return null;

    const screen = spec.screens.find((s) => s.id === previewScreenId);
    const component = screen?.components.find((c) => c.id === selectedComponentId);

    if (!component || !screen) return null;

    const handleUpdate = (updates: Partial<ComponentSpec>) => {
        updateComponentProps(screen.id, component.id, updates);
    };

    const handleLayoutUpdate = (
        key: keyof ComponentSpec["layout"],
        value: number
    ) => {
        updateComponentLayout(screen.id, component.id, {
            ...component.layout,
            [key]: value,
        });
    };

    // Tipos de componentes que tienen label editable
    const hasLabel = [
        "text",
        "button",
        "select",
        "card",
        "empty_state",
    ].includes(component.type);

    // Tipos con placeholder
    const hasPlaceholder = ["input", "textarea"].includes(component.type);

    return (
        <div className="absolute top-0 right-0 w-80 h-full bg-white border-l border-gray-200 shadow-xl overflow-auto z-10">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div>
                    <div className="font-semibold text-gray-800">Editar componente</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                        {component.id}
                    </div>
                </div>
                <button
                    onClick={() => selectComponent(null)}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="p-4 space-y-4">
                <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                        Tipo
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                        {component.type}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                        ID
                    </label>
                    <input
                        type="text"
                        value={component.id}
                        onChange={(e) => handleUpdate({ id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {hasLabel && (
                    <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">
                            Label / Texto
                        </label>
                        <textarea
                            value={component.label || ""}
                            onChange={(e) => handleUpdate({ label: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                )}

                {hasPlaceholder && (
                    <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">
                            Placeholder
                        </label>
                        <input
                            type="text"
                            value={component.placeholder || ""}
                            onChange={(e) => handleUpdate({ placeholder: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {component.type === "icon_button" && (
                    <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">
                            Icono
                        </label>
                        <select
                            value={component.icon || ""}
                            onChange={(e) => handleUpdate({ icon: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="filter">filter</option>
                            <option value="search">search</option>
                            <option value="home">home</option>
                        </select>
                    </div>
                )}

                {(component.type === "grid" || component.type === "list") && (
                    <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">
                            Data source
                        </label>
                        <select
                            value={component.dataSource || ""}
                            onChange={(e) => handleUpdate({ dataSource: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- ninguno --</option>
                            {Object.keys(spec.mockData || {}).map((key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {component.type === "grid" && (
                    <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">
                            Columnas del grid
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={4}
                            value={component.props?.columns || 1}
                            onChange={(e) =>
                                handleUpdate({
                                    props: {
                                        ...component.props,
                                        columns: parseInt(e.target.value) || 1,
                                    },
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                    <div className="text-xs font-semibold text-gray-700 mb-2">
                        Layout (grilla 12 columnas)
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">
                                Col start
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={12}
                                value={component.layout.colStart}
                                onChange={(e) =>
                                    handleLayoutUpdate("colStart", parseInt(e.target.value) || 1)
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">
                                Col span
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={12}
                                value={component.layout.colSpan}
                                onChange={(e) =>
                                    handleLayoutUpdate("colSpan", parseInt(e.target.value) || 1)
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">
                                Row start
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={component.layout.rowStart}
                                onChange={(e) =>
                                    handleLayoutUpdate("rowStart", parseInt(e.target.value) || 1)
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">
                                Row span
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={component.layout.rowSpan}
                                onChange={(e) =>
                                    handleLayoutUpdate("rowSpan", parseInt(e.target.value) || 1)
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                        </div>
                    </div>
                </div>

                {(component.type === "text" || component.type === "button") && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="text-xs font-semibold text-gray-700 mb-2">
                            Estilo del texto
                        </div>
                        <div className="space-y-2">
                            <div>
                                <label className="text-xs text-gray-600 mb-1 block">
                                    Tamaño
                                </label>
                                <select
                                    value={component.props?.fontSize || "base"}
                                    onChange={(e) =>
                                        handleUpdate({
                                            props: {
                                                ...component.props,
                                                fontSize: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                >
                                    <option value="xs">xs</option>
                                    <option value="sm">sm</option>
                                    <option value="base">base</option>
                                    <option value="lg">lg</option>
                                    <option value="xl">xl</option>
                                    <option value="2xl">2xl</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-600 mb-1 block">
                                    Peso
                                </label>
                                <select
                                    value={component.props?.fontWeight || "normal"}
                                    onChange={(e) =>
                                        handleUpdate({
                                            props: {
                                                ...component.props,
                                                fontWeight: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                >
                                    <option value="normal">normal</option>
                                    <option value="medium">medium</option>
                                    <option value="semibold">semibold</option>
                                    <option value="bold">bold</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
