import { create } from "zustand";
import type {
  AppFlowSpec,
  ScreenSpec,
  ComponentSpec,
  ActionSpec,
  BusinessRule,
  FlowConnection,
} from "../lib/spec";
import { defaultSpec } from "../lib/spec";
import {
  createDefaultScreen,
  duplicateScreenWithNewIds,
  removeScreenConnections,
  getNextScreenPosition,
} from "../lib/spec/screenUtils";

interface AppFlowStore {
  spec: AppFlowSpec;
  selectedScreenId: string | null;
  previewScreenId: string | null;
  logicScreenId: string | null;
  selectedComponentId: string | null;
  isPreviewOpen: boolean;
  isLogicOpen: boolean;
  isMarkdownOpen: boolean;
  editablePreview: boolean;

  // Navigation
  selectScreen: (id: string | null) => void;
  openPreview: (screenId: string) => void;
  closePreview: () => void;
  openLogic: (screenId: string) => void;
  closeLogic: () => void;
  toggleMarkdown: () => void;
  toggleEditablePreview: () => void;
  selectComponent: (id: string | null) => void;

  // Project meta
  updateProjectMeta: (
    patch: Partial<Pick<AppFlowSpec, "name" | "description" | "version">>
  ) => void;

  // Screen CRUD
  addScreen: (input: {
    name: string;
    type: ScreenSpec["type"];
    description?: string;
  }) => string | null;
  duplicateScreen: (screenId: string) => void;
  deleteScreen: (screenId: string) => boolean;

  // Flow connections
  addFlow: (sourceScreenId: string, targetScreenId: string, label?: string) => void;
  removeFlow: (flowId: string) => void;
  updateFlow: (flowId: string, patch: Partial<Omit<FlowConnection, "id">>) => void;

  // Screen editing
  updateScreen: (
    screenId: string,
    patch: Partial<Omit<ScreenSpec, "id" | "components">>
  ) => void;

  // Component editing
  updateComponent: (
    screenId: string,
    componentId: string,
    patch: Partial<ComponentSpec>
  ) => void;
  updateComponentLayout: (
    screenId: string,
    componentId: string,
    layout: ComponentSpec["layout"]
  ) => void;
  updateComponentProps: (
    screenId: string,
    componentId: string,
    patch: Record<string, any>
  ) => void;
  updateComponentBehavior: (
    screenId: string,
    componentId: string,
    patch: Record<string, any>
  ) => void;
  updateComponentAction: (
    screenId: string,
    componentId: string,
    action: ActionSpec | undefined
  ) => void;

  // Component CRUD
  addComponent: (screenId: string, component: ComponentSpec) => void;
  removeComponent: (screenId: string, componentId: string) => void;
  duplicateComponent: (screenId: string, componentId: string) => void;

  // Business rules
  updateBusinessRule: (ruleId: string, patch: Partial<BusinessRule>) => void;
  addBusinessRule: (rule: BusinessRule) => void;
  removeBusinessRule: (ruleId: string) => void;

  // Mock data
  updateMockData: (dataSource: string, rows: any[]) => void;

  // Getters
  getSelectedScreen: () => ScreenSpec | null;
  getScreen: (screenId: string) => ScreenSpec | null;
  getSelectedComponent: () => ComponentSpec | null;
}

export const useAppFlowStore = create<AppFlowStore>((set, get) => ({
  spec: defaultSpec,
  selectedScreenId: null,
  previewScreenId: null,
  logicScreenId: null,
  selectedComponentId: null,
  isPreviewOpen: false,
  isLogicOpen: false,
  isMarkdownOpen: false,
  editablePreview: false,

  // --- Navigation ---

  selectScreen: (id) => set({ selectedScreenId: id, selectedComponentId: null }),

  openPreview: (screenId) =>
    set({ previewScreenId: screenId, isPreviewOpen: true }),

  closePreview: () =>
    set({
      isPreviewOpen: false,
      previewScreenId: null,
      editablePreview: false,
      selectedComponentId: null,
    }),

  openLogic: (screenId) =>
    set({ logicScreenId: screenId, isLogicOpen: true }),

  closeLogic: () => set({ isLogicOpen: false, logicScreenId: null }),

  toggleMarkdown: () =>
    set((state) => ({ isMarkdownOpen: !state.isMarkdownOpen })),

  toggleEditablePreview: () =>
    set((state) => ({
      editablePreview: !state.editablePreview,
      selectedComponentId: null,
    })),

  selectComponent: (id) => set({ selectedComponentId: id }),

  // --- Screen CRUD ---

  addScreen: (input) => {
    const state = get();
    if (!input.name.trim()) return null;

    const position = getNextScreenPosition(state.spec.screens);
    const newScreen = createDefaultScreen({
      name: input.name.trim(),
      type: input.type,
      description: input.description,
      position,
    });

    set({
      spec: {
        ...state.spec,
        screens: [...state.spec.screens, newScreen],
      },
      selectedScreenId: newScreen.id,
      selectedComponentId: null,
    });

    return newScreen.id;
  },

  duplicateScreen: (screenId) => {
    const state = get();
    const screen = state.spec.screens.find((s) => s.id === screenId);
    if (!screen) return;

    const newScreen = duplicateScreenWithNewIds(screen);

    set({
      spec: {
        ...state.spec,
        screens: [...state.spec.screens, newScreen],
      },
      selectedScreenId: newScreen.id,
      selectedComponentId: null,
    });
  },

  deleteScreen: (screenId) => {
    const state = get();
    // Don't allow deleting the last screen
    if (state.spec.screens.length <= 1) return false;

    // Remove connections referencing this screen
    const cleanedSpec = removeScreenConnections(state.spec, screenId);

    // Remove the screen itself
    const newScreens = cleanedSpec.screens.filter((s) => s.id !== screenId);

    // Select another screen if the deleted one was selected
    const newSelectedId =
      state.selectedScreenId === screenId
        ? newScreens[0]?.id || null
        : state.selectedScreenId;

    set({
      spec: {
        ...cleanedSpec,
        screens: newScreens,
      },
      selectedScreenId: newSelectedId,
      selectedComponentId:
        state.selectedScreenId === screenId
          ? null
          : state.selectedComponentId,
    });

    return true;
  },

  // --- Flow connections ---

  addFlow: (sourceScreenId, targetScreenId, label) => {
    const state = get();
    // Don't allow self-connections
    if (sourceScreenId === targetScreenId) return;
    // Don't allow duplicate connections between same source/target
    const exists = state.spec.flows.some(
      (f) => f.sourceScreenId === sourceScreenId && f.targetScreenId === targetScreenId
    );
    if (exists) return;

    const suffix = Date.now().toString(36).slice(-6);
    const newFlow: FlowConnection = {
      id: `flow_${suffix}`,
      sourceScreenId,
      targetScreenId,
      label,
    };

    set({
      spec: {
        ...state.spec,
        flows: [...state.spec.flows, newFlow],
      },
    });
  },

  removeFlow: (flowId) =>
    set((state) => ({
      spec: {
        ...state.spec,
        flows: state.spec.flows.filter((f) => f.id !== flowId),
      },
    })),

  updateFlow: (flowId, patch) =>
    set((state) => ({
      spec: {
        ...state.spec,
        flows: state.spec.flows.map((f) =>
          f.id === flowId ? { ...f, ...patch } : f
        ),
      },
    })),

  // --- Project meta ---

  updateProjectMeta: (patch) =>
    set((state) => ({
      spec: { ...state.spec, ...patch },
    })),

  // --- Screen editing ---

  updateScreen: (screenId, patch) =>
    set((state) => ({
      spec: {
        ...state.spec,
        screens: state.spec.screens.map((screen) =>
          screen.id === screenId ? { ...screen, ...patch } : screen
        ),
      },
    })),

  // --- Component editing ---

  updateComponent: (screenId, componentId, patch) =>
    set((state) => ({
      spec: {
        ...state.spec,
        screens: state.spec.screens.map((screen) =>
          screen.id === screenId
            ? {
                ...screen,
                components: screen.components.map((comp) =>
                  comp.id === componentId ? { ...comp, ...patch } : comp
                ),
              }
            : screen
        ),
      },
    })),

  updateComponentLayout: (screenId, componentId, layout) =>
    set((state) => ({
      spec: {
        ...state.spec,
        screens: state.spec.screens.map((screen) =>
          screen.id === screenId
            ? {
                ...screen,
                components: screen.components.map((comp) =>
                  comp.id === componentId ? { ...comp, layout } : comp
                ),
              }
            : screen
        ),
      },
    })),

  updateComponentProps: (screenId, componentId, patch) =>
    set((state) => ({
      spec: {
        ...state.spec,
        screens: state.spec.screens.map((screen) =>
          screen.id === screenId
            ? {
                ...screen,
                components: screen.components.map((comp) =>
                  comp.id === componentId
                    ? { ...comp, props: { ...comp.props, ...patch } }
                    : comp
                ),
              }
            : screen
        ),
      },
    })),

  updateComponentBehavior: (screenId, componentId, patch) =>
    set((state) => ({
      spec: {
        ...state.spec,
        screens: state.spec.screens.map((screen) =>
          screen.id === screenId
            ? {
                ...screen,
                components: screen.components.map((comp) =>
                  comp.id === componentId
                    ? { ...comp, behavior: { ...comp.behavior, ...patch } }
                    : comp
                ),
              }
            : screen
        ),
      },
    })),

  updateComponentAction: (screenId, componentId, action) =>
    set((state) => ({
      spec: {
        ...state.spec,
        screens: state.spec.screens.map((screen) =>
          screen.id === screenId
            ? {
                ...screen,
                components: screen.components.map((comp) =>
                  comp.id === componentId ? { ...comp, action } : comp
                ),
              }
            : screen
        ),
      },
    })),

  // --- Component CRUD ---

  addComponent: (screenId, component) =>
    set((state) => ({
      spec: {
        ...state.spec,
        screens: state.spec.screens.map((screen) =>
          screen.id === screenId
            ? { ...screen, components: [...screen.components, component] }
            : screen
        ),
      },
    })),

  removeComponent: (screenId, componentId) =>
    set((state) => ({
      spec: {
        ...state.spec,
        screens: state.spec.screens.map((screen) =>
          screen.id === screenId
            ? {
                ...screen,
                components: screen.components.filter(
                  (c) => c.id !== componentId
                ),
              }
            : screen
        ),
      },
      selectedComponentId:
        state.selectedComponentId === componentId
          ? null
          : state.selectedComponentId,
    })),

  duplicateComponent: (screenId, componentId) =>
    set((state) => {
      const screen = state.spec.screens.find((s) => s.id === screenId);
      if (!screen) return state;
      const comp = screen.components.find((c) => c.id === componentId);
      if (!comp) return state;

      const suffix = Date.now().toString(36).slice(-4);
      const newComp: ComponentSpec = {
        ...comp,
        id: `${comp.type}_${suffix}`,
        layout: {
          ...comp.layout,
          rowStart: comp.layout.rowStart + comp.layout.rowSpan,
        },
      };

      return {
        spec: {
          ...state.spec,
          screens: state.spec.screens.map((s) =>
            s.id === screenId
              ? { ...s, components: [...s.components, newComp] }
              : s
          ),
        },
      };
    }),

  // --- Business rules ---

  updateBusinessRule: (ruleId, patch) =>
    set((state) => ({
      spec: {
        ...state.spec,
        businessRules: (state.spec.businessRules || []).map((rule) =>
          rule.id === ruleId ? { ...rule, ...patch } : rule
        ),
      },
    })),

  addBusinessRule: (rule) =>
    set((state) => ({
      spec: {
        ...state.spec,
        businessRules: [...(state.spec.businessRules || []), rule],
      },
    })),

  removeBusinessRule: (ruleId) =>
    set((state) => ({
      spec: {
        ...state.spec,
        businessRules: (state.spec.businessRules || []).filter(
          (r) => r.id !== ruleId
        ),
      },
    })),

  // --- Mock data ---

  updateMockData: (dataSource, rows) =>
    set((state) => ({
      spec: {
        ...state.spec,
        mockData: {
          ...state.spec.mockData,
          [dataSource]: rows,
        },
      },
    })),

  // --- Getters ---

  getSelectedScreen: () => {
    const state = get();
    if (!state.selectedScreenId) return null;
    return (
      state.spec.screens.find((s) => s.id === state.selectedScreenId) || null
    );
  },

  getScreen: (screenId) => {
    const state = get();
    return state.spec.screens.find((s) => s.id === screenId) || null;
  },

  getSelectedComponent: () => {
    const state = get();
    if (!state.selectedComponentId) return null;
    // Look in preview screen first, then selected screen
    const screenId = state.previewScreenId || state.selectedScreenId;
    if (!screenId) return null;
    const screen = state.spec.screens.find((s) => s.id === screenId);
    if (!screen) return null;
    return (
      screen.components.find((c) => c.id === state.selectedComponentId) || null
    );
  },
}));
