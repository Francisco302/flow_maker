import React from "react";
import type { ComponentSpec } from "../../lib/spec";
import { gridLayoutToCss } from "../../lib/layout/gridToStyle";
import {
    Filter,
    Home,
    Search,
    User,
    ChevronDown,
    Star,
} from "lucide-react";

interface ComponentRendererProps {
    component: ComponentSpec;
    mockData?: Record<string, any[]>;
    onClick?: () => void;
    skipGridStyle?: boolean;
}

export function ComponentRenderer({
    component,
    mockData,
    onClick,
    skipGridStyle = false,
}: ComponentRendererProps) {
    const style = skipGridStyle ? {} : gridLayoutToCss(component.layout);

    const baseClasses = skipGridStyle
        ? "w-full h-full flex items-center justify-center"
        : "p-2 flex items-center justify-center overflow-hidden";

    const renderContent = () => {
        switch (component.type) {
            case "text": {
                const fontSize = component.props?.fontSize || "base";
                const fontWeight = component.props?.fontWeight || "normal";
                const sizeMap: Record<string, string> = {
                    xs: "text-xs",
                    sm: "text-sm",
                    base: "text-base",
                    lg: "text-lg",
                    xl: "text-xl",
                    "2xl": "text-2xl",
                };
                const weightMap: Record<string, string> = {
                    normal: "font-normal",
                    medium: "font-medium",
                    semibold: "font-semibold",
                    bold: "font-bold",
                };
                return (
                    <div
                        className={`${sizeMap[fontSize] || "text-base"} ${weightMap[fontWeight] || "font-normal"
                            } text-gray-800 w-full`}
                    >
                        {component.label}
                    </div>
                );
            }

            case "input":
                return (
                    <input
                        type="text"
                        placeholder={component.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                    />
                );

            case "textarea":
                return (
                    <textarea
                        placeholder={component.placeholder}
                        className="w-full h-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        readOnly
                    />
                );

            case "select":
                return (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white flex items-center justify-between cursor-pointer">
                        <span className="text-gray-700">{component.label}</span>
                        <ChevronDown size={16} className="text-gray-500" />
                    </div>
                );

            case "button":
                return (
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        {component.label}
                    </button>
                );

            case "icon_button": {
                const IconComponent =
                    component.icon === "filter"
                        ? Filter
                        : component.icon === "search"
                            ? Search
                            : Home;
                return (
                    <button className="w-full h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        <IconComponent size={20} className="text-gray-700" />
                    </button>
                );
            }

            case "grid": {
                if (!component.dataSource || !mockData) {
                    return (
                        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                            Grid: {component.dataSource}
                        </div>
                    );
                }

                const data = mockData[component.dataSource] || [];
                const columns = component.props?.columns || 1;

                return (
                    <div
                        className="w-full h-full overflow-auto"
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${columns}, 1fr)`,
                            gap: "12px",
                            padding: "8px",
                            alignContent: "start",
                        }}
                    >
                        {data.map((item: any, idx: number) => (
                            <div
                                key={idx}
                                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                                style={{ height: "fit-content" }}
                                onClick={onClick}
                            >
                                <div className="font-semibold text-sm text-gray-800">
                                    {item.name}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                    {item.category}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{item.city}</div>
                                {item.rating && (
                                    <div className="flex items-center gap-1 mt-2">
                                        <Star
                                            size={12}
                                            className="text-yellow-500 fill-yellow-500"
                                        />
                                        <span className="text-xs font-medium">{item.rating}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );
            }

            case "list": {
                if (!component.dataSource || !mockData) {
                    return (
                        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                            List: {component.dataSource}
                        </div>
                    );
                }

                const listData = mockData[component.dataSource] || [];

                return (
                    <div className="w-full h-full overflow-auto">
                        {listData.map((item: any, idx: number) => (
                            <div
                                key={idx}
                                className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                                onClick={onClick}
                            >
                                <div className="text-sm text-gray-800">{item.name}</div>
                            </div>
                        ))}
                    </div>
                );
            }

            case "image_placeholder":
                return (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                        Imagen
                    </div>
                );

            case "empty_state":
                return (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <div className="text-4xl mb-2">📭</div>
                        <div className="text-sm">{component.label || "Sin resultados"}</div>
                    </div>
                );

            case "bottom_nav":
                return (
                    <div className="w-full h-full bg-white border-t border-gray-200 flex items-center justify-around">
                        <div className="flex flex-col items-center gap-1 text-gray-600 cursor-pointer">
                            <Home size={20} />
                            <span className="text-xs">Inicio</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-gray-600 cursor-pointer">
                            <Search size={20} />
                            <span className="text-xs">Buscar</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-gray-600 cursor-pointer">
                            <User size={20} />
                            <span className="text-xs">Perfil</span>
                        </div>
                    </div>
                );

            case "card":
                return (
                    <div className="w-full h-full bg-white border border-gray-200 rounded-lg p-3">
                        <div className="font-medium text-sm">{component.label}</div>
                    </div>
                );

            default:
                return (
                    <div className="w-full h-full border border-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                        {component.type}
                    </div>
                );
        }
    };

    return (
        <div style={style} className={baseClasses}>
            {renderContent()}
        </div>
    );
}
