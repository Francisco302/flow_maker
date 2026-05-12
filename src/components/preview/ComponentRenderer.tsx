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
  Plus,
  Settings,
  Heart,
  Bell,
  Mail,
  MapPin,
  Calendar,
  Camera,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react";

interface ComponentRendererProps {
  component: ComponentSpec;
  mockData?: Record<string, any[]>;
  onClick?: () => void;
  skipGridStyle?: boolean;
}

/** Map icon name strings to lucide components */
function getIconComponent(iconName?: string) {
  const icons: Record<string, React.ElementType> = {
    filter: Filter,
    search: Search,
    home: Home,
    user: User,
    plus: Plus,
    settings: Settings,
    heart: Heart,
    bell: Bell,
    mail: Mail,
    "map-pin": MapPin,
    calendar: Calendar,
    camera: Camera,
    edit: Edit,
    trash: Trash2,
    check: Check,
    x: X,
    star: Star,
  };
  return icons[iconName || ""] || Home;
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
            className={`${sizeMap[fontSize] || "text-base"} ${
              weightMap[fontWeight] || "font-normal"
            } text-gray-800 w-full`}
          >
            {component.value || component.label || "Sin texto"}
          </div>
        );
      }

      case "input":
        return (
          <input
            type="text"
            placeholder={component.placeholder || "Sin placeholder"}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        );

      case "textarea":
        return (
          <textarea
            placeholder={component.placeholder || "Sin placeholder"}
            className="w-full h-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            readOnly
          />
        );

      case "select":
        return (
          <div className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white flex items-center justify-between cursor-pointer">
            <span className="text-gray-700">
              {component.label || component.value || "Seleccionar"}
            </span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        );

      case "button":
        return (
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {component.label || "Botón"}
          </button>
        );

      case "icon_button": {
        const IconComp = getIconComponent(component.icon);
        return (
          <button className="w-full h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <IconComp size={20} className="text-gray-700" />
          </button>
        );
      }

      case "checkbox":
        return (
          <label className="flex items-center gap-2 w-full cursor-pointer">
            <input type="checkbox" className="rounded" readOnly />
            <span className="text-sm text-gray-700">
              {component.label || "Opción"}
            </span>
          </label>
        );

      case "radio":
        return (
          <label className="flex items-center gap-2 w-full cursor-pointer">
            <input type="radio" readOnly />
            <span className="text-sm text-gray-700">
              {component.label || "Opción"}
            </span>
          </label>
        );

      case "grid": {
        const data = getDataForComponent(component, mockData);
        const columns = component.props?.columns || 1;
        const fields = component.fields || [];

        if (data.length === 0) {
          return (
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              Grid: {component.dataSource || "sin data source"}
            </div>
          );
        }

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
                {fields.length > 0 ? (
                  fields.map((field, fIdx) => (
                    <div
                      key={field}
                      className={
                        fIdx === 0
                          ? "font-semibold text-sm text-gray-800"
                          : "text-xs text-gray-600 mt-1"
                      }
                    >
                      {item[field] !== undefined ? String(item[field]) : ""}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-800">
                    {item.name || item.title || JSON.stringify(item).slice(0, 40)}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }

      case "list": {
        const listData = getDataForComponent(component, mockData);
        const fields = component.fields || [];

        if (listData.length === 0) {
          return (
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              List: {component.dataSource || "sin data source"}
            </div>
          );
        }

        return (
          <div className="w-full h-full overflow-auto">
            {listData.map((item: any, idx: number) => (
              <div
                key={idx}
                className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={onClick}
              >
                {fields.length > 0 ? (
                  fields.map((field, fIdx) => (
                    <div
                      key={field}
                      className={
                        fIdx === 0
                          ? "text-sm text-gray-800"
                          : "text-xs text-gray-500"
                      }
                    >
                      {item[field] !== undefined ? String(item[field]) : ""}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-800">
                    {item.name || item.title || JSON.stringify(item).slice(0, 40)}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }

      case "card":
        return (
          <div className="w-full h-full bg-white border border-gray-200 rounded-lg p-3">
            <div className="font-medium text-sm">
              {component.label || "Card"}
            </div>
            {component.value && (
              <div className="text-xs text-gray-500 mt-1">{component.value}</div>
            )}
          </div>
        );

      case "image_placeholder":
        return (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
            {component.label || "Imagen"}
          </div>
        );

      case "empty_state":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <div className="text-4xl mb-2">📭</div>
            <div className="text-sm">
              {component.label || component.value || "Sin resultados"}
            </div>
          </div>
        );

      case "bottom_nav": {
        const options = component.options || ["Inicio", "Buscar", "Perfil"];
        const defaultIcons = ["home", "search", "user"];
        return (
          <div className="w-full h-full bg-white border-t border-gray-200 flex items-center justify-around">
            {options.map((opt, idx) => {
              const IconComp = getIconComponent(defaultIcons[idx % defaultIcons.length]);
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-1 text-gray-600 cursor-pointer"
                >
                  <IconComp size={20} />
                  <span className="text-xs">{opt}</span>
                </div>
              );
            })}
          </div>
        );
      }

      default:
        return (
          <div className="w-full h-full border border-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
            Componente no soportado: {component.type}
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

/** Get data for a component from mockData using its dataSource */
function getDataForComponent(
  component: ComponentSpec,
  mockData?: Record<string, any[]>
): any[] {
  if (!component.dataSource || !mockData) return [];
  return mockData[component.dataSource] || [];
}
