import React from "react";
import type { ComponentSpec } from "../../lib/spec";
import { gridLayoutToCss } from "../../lib/layout/gridToStyle";
import { getIcon, defaultNavIcons } from "./iconMap";
import { wf } from "./wireframeStyles";
import { ChevronDown, ChevronRight, Image as ImageIcon, Heart, Star } from "lucide-react";

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
    ? "w-full h-full"
    : "p-1 overflow-hidden";

  const renderContent = () => {
    switch (component.type) {
      case "text":
        return <WireText component={component} />;
      case "input":
        return <WireInput component={component} />;
      case "textarea":
        return <WireTextarea component={component} />;
      case "select":
        return <WireSelect component={component} />;
      case "button":
        return <WireButton component={component} />;
      case "icon_button":
        return <WireIconButton component={component} />;
      case "checkbox":
        return <WireCheckbox component={component} />;
      case "radio":
        return <WireRadio component={component} />;
      case "grid":
        return <WireGrid component={component} mockData={mockData} onClick={onClick} />;
      case "list":
        return <WireList component={component} mockData={mockData} onClick={onClick} />;
      case "card":
        return <WireCard component={component} />;
      case "image_placeholder":
        return <WireImagePlaceholder component={component} />;
      case "empty_state":
        return <WireEmptyState component={component} />;
      case "bottom_nav":
        return <WireBottomNav component={component} />;
      default:
        return (
          <div className="w-full h-full border border-dashed border-neutral-300 rounded-lg flex items-center justify-center text-[10px] text-neutral-400">
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

// ─────────────────────────────────────────────
// WIREFRAME PRIMITIVES
// ─────────────────────────────────────────────

function WireText({ component }: { component: ComponentSpec }) {
  const variant = component.props?.variant || component.props?.fontSize || "base";
  const align = component.props?.align || "left";
  const text = component.value || component.label;

  const alignClass = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  // If no text, show skeleton lines
  if (!text) {
    return (
      <div className={`w-full h-full flex flex-col justify-center gap-1.5 px-1 ${alignClass}`}>
        <div className={`${wf.skeletonDark} h-2.5 w-3/4`} />
        <div className={`${wf.skeletonLight} h-2 w-1/2`} />
      </div>
    );
  }

  // Map variant to visual style
  const variantMap: Record<string, string> = {
    title: "text-sm font-bold text-neutral-900",
    "2xl": "text-base font-bold text-neutral-900",
    xl: "text-sm font-bold text-neutral-900",
    lg: "text-sm font-semibold text-neutral-800",
    subtitle: "text-xs font-semibold text-neutral-700",
    base: "text-xs text-neutral-800",
    body: "text-xs text-neutral-600",
    sm: "text-[11px] text-neutral-600",
    caption: "text-[10px] text-neutral-400",
    xs: "text-[10px] text-neutral-400",
  };

  const fontWeight = component.props?.fontWeight;
  const weightClass = fontWeight === "bold" ? "font-bold" : fontWeight === "semibold" ? "font-semibold" : fontWeight === "medium" ? "font-medium" : "";

  const cls = variantMap[variant] || variantMap.base;

  return (
    <div className={`w-full h-full flex items-center px-1 ${alignClass}`}>
      <span className={`${cls} ${weightClass} leading-tight w-full`}>{text}</span>
    </div>
  );
}

function WireInput({ component }: { component: ComponentSpec }) {
  const withIcon = component.props?.withIcon;
  const placeholder = component.placeholder;
  const IconComp = getIcon(component.icon || (withIcon ? "search" : undefined));

  return (
    <div className={`w-full ${wf.input}`}>
      {withIcon && <IconComp size={14} className="text-neutral-400 mr-2 flex-shrink-0" />}
      {placeholder ? (
        <span className="text-[11px] text-neutral-400 truncate">{placeholder}</span>
      ) : (
        <div className={`${wf.skeletonLight} h-2 w-2/3`} />
      )}
    </div>
  );
}

function WireTextarea({ component }: { component: ComponentSpec }) {
  const placeholder = component.placeholder;
  return (
    <div className={`w-full h-full ${wf.textarea} flex flex-col`}>
      {placeholder ? (
        <span className="text-[11px] text-neutral-400">{placeholder}</span>
      ) : (
        <div className="space-y-1.5 pt-1">
          <div className={`${wf.skeletonLight} h-2 w-full`} />
          <div className={`${wf.skeletonLight} h-2 w-4/5`} />
          <div className={`${wf.skeletonLight} h-2 w-2/3`} />
        </div>
      )}
    </div>
  );
}

function WireSelect({ component }: { component: ComponentSpec }) {
  const label = component.label || component.value || "Seleccionar";
  return (
    <div className={`w-full ${wf.select}`}>
      <span className="text-[11px] text-neutral-600 truncate">{label}</span>
      <ChevronDown size={14} className="text-neutral-400 flex-shrink-0" />
    </div>
  );
}

function WireButton({ component }: { component: ComponentSpec }) {
  const variant = component.props?.variant || "primary";
  const label = component.label;
  const isPrimary = variant === "primary" || variant === "title";

  const cls = isPrimary ? wf.buttonPrimary : wf.buttonSecondary;
  const textCls = isPrimary ? "text-white" : "text-neutral-700";

  return (
    <div className={`w-full ${cls}`}>
      {label ? (
        <span className={`text-xs font-semibold ${textCls} uppercase tracking-wide`}>
          {label}
        </span>
      ) : (
        <div className={`${isPrimary ? "bg-neutral-600" : "bg-neutral-400"} h-2 w-16 rounded-full`} />
      )}
    </div>
  );
}

function WireIconButton({ component }: { component: ComponentSpec }) {
  const IconComp = getIcon(component.icon);
  return (
    <div className={`${wf.iconButton}`}>
      <IconComp size={16} className="text-neutral-600" />
    </div>
  );
}

function WireCheckbox({ component }: { component: ComponentSpec }) {
  return (
    <div className="w-full h-full flex items-center gap-2 px-1">
      <div className="w-4 h-4 rounded border-2 border-neutral-400 flex-shrink-0" />
      <span className="text-[11px] text-neutral-700">{component.label || "Opción"}</span>
    </div>
  );
}

function WireRadio({ component }: { component: ComponentSpec }) {
  return (
    <div className="w-full h-full flex items-center gap-2 px-1">
      <div className="w-4 h-4 rounded-full border-2 border-neutral-400 flex-shrink-0" />
      <span className="text-[11px] text-neutral-700">{component.label || "Opción"}</span>
    </div>
  );
}

function WireGrid({
  component,
  mockData,
  onClick,
}: {
  component: ComponentSpec;
  mockData?: Record<string, any[]>;
  onClick?: () => void;
}) {
  const data = getDataForComponent(component, mockData);
  const columns = component.props?.columns || 2;
  const fields = component.fields || [];
  const showFavorite = component.props?.showFavorite;

  // Skeleton grid if no data
  if (data.length === 0) {
    return (
      <div
        className="w-full h-full p-2"
        style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: "8px", alignContent: "start" }}
      >
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="w-full h-full overflow-hidden p-2"
      style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: "8px", alignContent: "start" }}
    >
      {data.map((item, idx) => (
        <div
          key={idx}
          className={`${wf.card} cursor-pointer hover:shadow-sm transition-shadow`}
          onClick={onClick}
        >
          {/* Mini image placeholder */}
          <div className="bg-neutral-200 w-full aspect-[4/3] flex items-center justify-center">
            <ImageIcon size={16} className="text-neutral-400" />
          </div>
          <div className="p-2 space-y-1">
            {/* Title: first field or name */}
            <div className="flex items-start justify-between gap-1">
              <span className={wf.textTitle + " truncate flex-1"}>
                {fields.length > 0 && item[fields[0]] !== undefined
                  ? String(item[fields[0]])
                  : item.name || item.title || "—"}
              </span>
              {showFavorite && <Heart size={12} className="text-neutral-400 flex-shrink-0 mt-0.5" />}
            </div>
            {/* Secondary fields */}
            {fields.slice(1).map((field) => {
              const val = item[field];
              if (val === undefined) return null;
              // Rating special render
              if (field === "rating" && typeof val === "number") {
                return (
                  <div key={field} className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={8}
                        className={i < Math.round(val) ? "text-neutral-700 fill-neutral-700" : "text-neutral-300"}
                      />
                    ))}
                  </div>
                );
              }
              return (
                <span key={field} className={wf.textCaption + " block truncate"}>
                  {String(val)}
                </span>
              );
            })}
            {/* Fallback if no fields defined */}
            {fields.length === 0 && (
              <>
                {item.category && <span className={wf.textBody + " block truncate"}>{item.category}</span>}
                {item.city && <span className={wf.textCaption + " block truncate"}>{item.city}</span>}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function WireList({
  component,
  mockData,
  onClick,
}: {
  component: ComponentSpec;
  mockData?: Record<string, any[]>;
  onClick?: () => void;
}) {
  const data = getDataForComponent(component, mockData);
  const fields = component.fields || [];

  // Skeleton list if no data
  if (data.length === 0) {
    return (
      <div className="w-full h-full p-1 space-y-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={wf.listItem}>
            <div className="w-8 h-8 rounded-lg bg-neutral-200 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className={`${wf.skeletonDark} h-2 w-3/4`} />
              <div className={`${wf.skeletonLight} h-1.5 w-1/2`} />
            </div>
            <ChevronRight size={14} className="text-neutral-300" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden">
      {data.map((item, idx) => (
        <div
          key={idx}
          className={`${wf.listItem} cursor-pointer hover:bg-neutral-50 transition-colors`}
          onClick={onClick}
        >
          {/* Mini avatar/image */}
          <div className="w-8 h-8 rounded-lg bg-neutral-200 flex items-center justify-center flex-shrink-0">
            <ImageIcon size={12} className="text-neutral-400" />
          </div>
          {/* Text block */}
          <div className="flex-1 min-w-0">
            <div className={wf.textSubtitle + " truncate"}>
              {fields.length > 0 && item[fields[0]] !== undefined
                ? String(item[fields[0]])
                : item.name || item.title || "—"}
            </div>
            {fields.slice(1, 3).map((field) => {
              const val = item[field];
              if (val === undefined) return null;
              return (
                <span key={field} className={wf.textCaption + " block truncate"}>
                  {String(val)}
                </span>
              );
            })}
          </div>
          {/* Action indicator */}
          <ChevronRight size={14} className="text-neutral-300 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

function WireCard({ component }: { component: ComponentSpec }) {
  const showFavorite = component.props?.showFavorite;
  const label = component.label;
  const value = component.value;

  return (
    <div className={`w-full h-full ${wf.card}`}>
      {/* Image area */}
      <div className="bg-neutral-200 w-full h-1/2 min-h-[40px] flex items-center justify-center">
        <ImageIcon size={16} className="text-neutral-400" />
      </div>
      <div className="p-2 space-y-1">
        <div className="flex items-start justify-between">
          <span className={wf.textTitle + " truncate flex-1"}>
            {label || "Card"}
          </span>
          {showFavorite && <Heart size={12} className="text-neutral-400 flex-shrink-0" />}
        </div>
        {value && <span className={wf.textCaption + " block truncate"}>{value}</span>}
      </div>
    </div>
  );
}

function WireImagePlaceholder({ component }: { component: ComponentSpec }) {
  const aspect = component.props?.imageAspectRatio || "landscape";
  const aspectClass =
    aspect === "square" ? "aspect-square" : aspect === "portrait" ? "aspect-[3/4]" : "aspect-[16/9]";

  return (
    <div className={`w-full h-full ${wf.imagePlaceholder} ${aspectClass} min-h-full`}>
      <ImageIcon size={24} className="text-neutral-400" />
    </div>
  );
}

function WireEmptyState({ component }: { component: ComponentSpec }) {
  const text = component.label || component.value || "Sin resultados";
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-4">
      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
        <ImageIcon size={20} className="text-neutral-300" />
      </div>
      <span className="text-[11px] text-neutral-400 text-center">{text}</span>
    </div>
  );
}

function WireBottomNav({ component }: { component: ComponentSpec }) {
  const options = component.options || ["Inicio", "Buscar", "Perfil"];
  const iconNames: string[] = component.props?.icons || defaultNavIcons;
  const activeIndex = component.props?.activeIndex ?? 0;

  return (
    <div className={`w-full h-full ${wf.bottomNav}`}>
      {options.map((opt, idx) => {
        const IconComp = getIcon(iconNames[idx % iconNames.length]);
        const isActive = idx === activeIndex;

        return (
          <div
            key={idx}
            className={isActive ? wf.navItemActive : wf.navItemInactive}
          >
            <IconComp
              size={18}
              className={isActive ? "text-white" : "text-neutral-500"}
            />
            {!isActive && (
              <span className="text-[9px] text-neutral-500 leading-none">{opt}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON HELPERS
// ─────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className={wf.card}>
      <div className="bg-neutral-200 w-full aspect-[4/3]" />
      <div className="p-2 space-y-1.5">
        <div className={`${wf.skeletonDark} h-2 w-3/4`} />
        <div className={`${wf.skeletonLight} h-1.5 w-1/2`} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────

function getDataForComponent(
  component: ComponentSpec,
  mockData?: Record<string, any[]>
): any[] {
  if (!component.dataSource || !mockData) return [];
  return mockData[component.dataSource] || [];
}
