import { create } from "zustand";
import type { AppFlowSpec, ScreenSpec, ComponentSpec } from "../lib/spec";
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

    // Actions
    selectScreen: (id: string | null) => void;
    openPreview: (screenId: string) => void;
    closePreview: () => void;
    openLogic: (screenId: string) => void;
    closeLogic: () => void;
    toggleMarkdown: () => void;
    toggleEditablePreview: () => void;
    selectComponent: (id: string | null) => void;
    updateComponentLayout: (
        screenId: string,
        componentId: string,
        layout: ComponentSpec["layout"]
    ) => void;
    updateComponentProps: (
        screenId: string,
        componentId: string,
        updates: Partial<ComponentSpec>
    ) => void;
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

    selectScreen: (id) => set({ selectedScreenId: id }),

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

    updateComponentProps: (screenId, componentId, updates) =>
        set((state) => ({
            spec: {
                ...state.spec,
                screens: state.spec.screens.map((screen) =>
                    screen.id === screenId
                        ? {
                            ...screen,
                            components: screen.components.map((comp) =>
                                comp.id === componentId ? { ...comp, ...updates } : comp
                            ),
                        }
                        : screen
                ),
            },
        })),

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
        if (!state.selectedComponentId || !state.previewScreenId) return null;
        const screen = state.spec.screens.find(
            (s) => s.id === state.previewScreenId
        );
        if (!screen) return null;
        return (
            screen.components.find((c) => c.id === state.selectedComponentId) || null
        );
    },
}));
