import { create } from "zustand";
import type {
  AppFlowSpec,
  ScreenSpec,
  ComponentSpec,
  ActionSpec,
  BusinessRule,
} from "../lib/spec";
import { defaultSpec } from "../lib/spec";

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
