import type { ComponentSpec, ScreenSpec, BusinessRule } from "./types";

/**
 * Parse a comma-separated string into an array of trimmed strings.
 */
export function parseCommaList(value: string): string[] {
  if (!value.trim()) return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

/**
 * Convert a string array to a comma-separated string.
 */
export function stringifyCommaList(value?: string[]): string {
  if (!value || value.length === 0) return "";
  return value.join(", ");
}

/**
 * Safely parse a JSON string. Returns ok/error result.
 */
export function safeParseJson(value: string): { ok: true; data: any } | { ok: false; error: string } {
  try {
    const data = JSON.parse(value);
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, error: e.message || "JSON inválido" };
  }
}

/**
 * Create a unique component ID based on type and timestamp.
 */
export function createComponentId(type: string): string {
  const suffix = Date.now().toString(36).slice(-4);
  return `${type}_${suffix}`;
}

/**
 * Get the next available row in a screen (after the last component).
 */
export function getNextAvailableRow(screen: ScreenSpec): number {
  if (screen.components.length === 0) return 1;
  let maxRow = 0;
  for (const comp of screen.components) {
    const end = comp.layout.rowStart + comp.layout.rowSpan;
    if (end > maxRow) maxRow = end;
  }
  return maxRow;
}

/**
 * Create a default component of the given type for a screen.
 */
export function createDefaultComponent(
  type: ComponentSpec["type"],
  screen: ScreenSpec
): ComponentSpec {
  const id = createComponentId(type);
  const rowStart = getNextAvailableRow(screen);

  const base: ComponentSpec = {
    id,
    type,
    layout: {
      colStart: 1,
      colSpan: 12,
      rowStart,
      rowSpan: 1,
    },
  };

  switch (type) {
    case "text":
      return { ...base, label: "Texto" };
    case "input":
      return { ...base, placeholder: "Ingrese texto" };
    case "textarea":
      return { ...base, placeholder: "Ingrese texto", layout: { ...base.layout, rowSpan: 2 } };
    case "select":
      return { ...base, label: "Seleccionar", options: ["Opción 1", "Opción 2"] };
    case "button":
      return { ...base, label: "Botón" };
    case "icon_button":
      return { ...base, icon: "home" };
    case "checkbox":
      return { ...base, label: "Opción" };
    case "radio":
      return { ...base, label: "Opción" };
    case "card":
      return { ...base, label: "Card" };
    case "list":
      return { ...base, layout: { ...base.layout, rowSpan: 4 } };
    case "grid":
      return { ...base, layout: { ...base.layout, rowSpan: 6 }, props: { columns: 2 } };
    case "image_placeholder":
      return { ...base, layout: { ...base.layout, rowSpan: 3 } };
    case "empty_state":
      return { ...base, label: "Sin resultados", layout: { ...base.layout, rowSpan: 3 } };
    case "bottom_nav":
      return { ...base, options: ["Inicio", "Buscar", "Perfil"], layout: { ...base.layout, rowSpan: 2 } };
    default:
      return base;
  }
}

/**
 * Create a default business rule.
 */
export function createDefaultBusinessRule(): BusinessRule {
  const suffix = Date.now().toString(36).slice(-4);
  return {
    id: `RULE_${suffix.toUpperCase()}`,
    title: "Nueva regla",
    description: "Descripción de la regla",
    relatedScreens: [],
    relatedComponents: [],
  };
}
