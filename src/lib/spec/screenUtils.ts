import type { ScreenSpec, AppFlowSpec, ComponentSpec } from "./types";
import { createComponentId } from "./editorUtils";

/**
 * Generate a unique screen ID from a name.
 */
export function createScreenId(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  const suffix = Date.now().toString(36).slice(-4);
  return `${base}_${suffix}`;
}

/**
 * Screen types available for creation.
 */
export const SCREEN_TYPES = [
  "screen",
  "form",
  "modal",
  "external",
] as const;

/**
 * Suggested screen type labels for the UI.
 */
export const SCREEN_TYPE_LABELS: Record<string, string> = {
  screen: "Pantalla",
  form: "Formulario",
  modal: "Modal",
  external: "Externo",
};

/**
 * Calculate the next available position for a new screen on the canvas.
 * Places it to the right of the rightmost existing screen.
 */
export function getNextScreenPosition(screens: ScreenSpec[]): { x: number; y: number } {
  if (screens.length === 0) return { x: 100, y: 100 };

  let maxX = -Infinity;
  let yAtMaxX = 100;

  for (const screen of screens) {
    if (screen.nodePosition.x > maxX) {
      maxX = screen.nodePosition.x;
      yAtMaxX = screen.nodePosition.y;
    }
  }

  return { x: maxX + 300, y: yAtMaxX };
}

/**
 * Create a new default screen with the given input.
 */
export function createDefaultScreen(input: {
  name: string;
  type: ScreenSpec["type"];
  description?: string;
  position?: { x: number; y: number };
}): ScreenSpec {
  const id = createScreenId(input.name);
  const position = input.position || { x: 100, y: 100 };

  return {
    id,
    name: input.name,
    type: input.type,
    description: input.description || "",
    nodePosition: position,
    canvas: {
      device: "mobile",
      columns: 12,
      rows: 20,
      rowHeight: 40,
    },
    components: [],
  };
}

/**
 * Duplicate a screen with new IDs for the screen and all its components.
 * Offsets the position slightly from the original.
 */
export function duplicateScreenWithNewIds(
  screen: ScreenSpec,
  nameSuffix = " (copia)"
): ScreenSpec {
  const newName = `${screen.name}${nameSuffix}`;
  const newId = createScreenId(newName);

  const newComponents: ComponentSpec[] = screen.components.map((comp) => ({
    ...comp,
    id: createComponentId(comp.type),
    // Deep clone action if present
    action: comp.action ? { ...comp.action } : undefined,
    // Deep clone props/behavior if present
    props: comp.props ? { ...comp.props } : undefined,
    behavior: comp.behavior ? { ...comp.behavior } : undefined,
  }));

  return {
    ...screen,
    id: newId,
    name: newName,
    nodePosition: {
      x: screen.nodePosition.x + 50,
      y: screen.nodePosition.y + 80,
    },
    canvas: { ...screen.canvas },
    components: newComponents,
  };
}

/**
 * Remove all flow connections that reference a given screen ID.
 */
export function removeScreenConnections(
  spec: AppFlowSpec,
  screenId: string
): AppFlowSpec {
  return {
    ...spec,
    flows: spec.flows.filter(
      (flow) =>
        flow.sourceScreenId !== screenId && flow.targetScreenId !== screenId
    ),
    // Also clean up business rules that reference this screen
    businessRules: (spec.businessRules || []).map((rule) => ({
      ...rule,
      relatedScreens: (rule.relatedScreens || []).filter(
        (id) => id !== screenId
      ),
    })),
  };
}

/**
 * Check if a screen name already exists in the spec.
 */
export function screenNameExists(screens: ScreenSpec[], name: string): boolean {
  return screens.some(
    (s) => s.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
}
