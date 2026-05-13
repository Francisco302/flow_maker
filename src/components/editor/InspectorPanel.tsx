import React, { useState } from "react";
import { Eye, FileText, Plus, Copy, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import type { AppFlowSpec, ScreenSpec, ComponentSpec } from "../../lib/spec";
import { useAppFlowStore } from "../../store/useAppFlowStore";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { ComponentPropertiesEditor } from "./ComponentPropertiesEditor";
import { BusinessRulesEditor } from "./BusinessRulesEditor";
import { MockDataEditor } from "./MockDataEditor";
import { createDefaultComponent } from "../../lib/spec/editorUtils";

interface InspectorPanelProps {
  spec: AppFlowSpec;
  selectedScreen: ScreenSpec | null;
}

const COMPONENT_TYPES: ComponentSpec["type"][] = [
  "text",
  "input",
  "textarea",
  "select",
  "button",
  "icon_button",
  "checkbox",
  "radio",
  "card",
  "list",
  "grid",
  "image_placeholder",
  "empty_state",
  "bottom_nav",
];

export function InspectorPanel({ spec, selectedScreen }: InspectorPanelProps) {
  const openPreview = useAppFlowStore((state) => state.openPreview);
  const openLogic = useAppFlowStore((state) => state.openLogic);
  const updateProjectMeta = useAppFlowStore((state) => state.updateProjectMeta);
  const updateScreen = useAppFlowStore((state) => state.updateScreen);
  const selectComponent = useAppFlowStore((state) => state.selectComponent);
  const selectedComponentId = useAppFlowStore(
    (state) => state.selectedComponentId
  );
  const addComponent = useAppFlowStore((state) => state.addComponent);
  const removeComponent = useAppFlowStore((state) => state.removeComponent);
  const duplicateComponent = useAppFlowStore(
    (state) => state.duplicateComponent
  );
  const duplicateScreen = useAppFlowStore((state) => state.duplicateScreen);
  const deleteScreen = useAppFlowStore((state) => state.deleteScreen);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    project: true,
    screen: true,
    components: true,
    rules: false,
    mockData: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddComponent = (type: ComponentSpec["type"]) => {
    if (!selectedScreen) return;
    const comp = createDefaultComponent(type, selectedScreen);
    addComponent(selectedScreen.id, comp);
    setShowAddMenu(false);
    selectComponent(comp.id);
  };

  // ─── No screen selected: Project editor ───
  if (!selectedScreen) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 overflow-auto p-4">
        <SectionHeader
          title="Proyecto"
          expanded={expandedSections.project}
          onToggle={() => toggleSection("project")}
        />
        {expandedSections.project && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Nombre
              </label>
              <input
                type="text"
                value={spec.name}
                onChange={(e) => updateProjectMeta({ name: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Versión
              </label>
              <input
                type="text"
                value={spec.version}
                onChange={(e) => updateProjectMeta({ version: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Descripción
              </label>
              <textarea
                value={spec.description || ""}
                onChange={(e) =>
                  updateProjectMeta({ description: e.target.value })
                }
                rows={3}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="space-y-2 mb-4">
          <div className="bg-gray-50 rounded p-2 flex justify-between items-center">
            <span className="text-xs text-gray-600">Pantallas</span>
            <span className="text-sm font-bold text-gray-800">
              {spec.screens.length}
            </span>
          </div>
          <div className="bg-gray-50 rounded p-2 flex justify-between items-center">
            <span className="text-xs text-gray-600">Flujos</span>
            <span className="text-sm font-bold text-gray-800">
              {spec.flows.length}
            </span>
          </div>
          <div className="bg-gray-50 rounded p-2 flex justify-between items-center">
            <span className="text-xs text-gray-600">Reglas</span>
            <span className="text-sm font-bold text-gray-800">
              {spec.businessRules?.length || 0}
            </span>
          </div>
        </div>

        {/* Business Rules */}
        <SectionHeader
          title="Reglas de negocio"
          expanded={expandedSections.rules}
          onToggle={() => toggleSection("rules")}
        />
        {expandedSections.rules && (
          <div className="mb-4">
            <BusinessRulesEditor />
          </div>
        )}

        {/* Mock Data */}
        <SectionHeader
          title="Mock Data"
          expanded={expandedSections.mockData}
          onToggle={() => toggleSection("mockData")}
        />
        {expandedSections.mockData && (
          <div className="mb-4">
            <MockDataEditor />
          </div>
        )}
      </div>
    );
  }

  // ─── Screen selected ───
  const selectedComponent = selectedComponentId
    ? selectedScreen.components.find((c) => c.id === selectedComponentId)
    : null;

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-auto">
      {/* Screen editor */}
      <div className="p-4 border-b border-gray-200">
        <SectionHeader
          title="Pantalla"
          expanded={expandedSections.screen}
          onToggle={() => toggleSection("screen")}
        />
        {expandedSections.screen && (
          <div className="space-y-2 mt-2">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-0.5 block">
                Nombre
              </label>
              <input
                type="text"
                value={selectedScreen.name}
                onChange={(e) =>
                  updateScreen(selectedScreen.id, { name: e.target.value })
                }
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-0.5 block">
                Tipo
              </label>
              <select
                value={selectedScreen.type}
                onChange={(e) =>
                  updateScreen(selectedScreen.id, {
                    type: e.target.value as ScreenSpec["type"],
                  })
                }
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="screen">screen</option>
                <option value="form">form</option>
                <option value="modal">modal</option>
                <option value="external">external</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-0.5 block">
                Descripción
              </label>
              <textarea
                value={selectedScreen.description || ""}
                onChange={(e) =>
                  updateScreen(selectedScreen.id, {
                    description: e.target.value,
                  })
                }
                rows={2}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600 mb-0.5 block">
                  Nodo X
                </label>
                <input
                  type="number"
                  value={selectedScreen.nodePosition.x}
                  onChange={(e) =>
                    updateScreen(selectedScreen.id, {
                      nodePosition: {
                        ...selectedScreen.nodePosition,
                        x: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-0.5 block">
                  Nodo Y
                </label>
                <input
                  type="number"
                  value={selectedScreen.nodePosition.y}
                  onChange={(e) =>
                    updateScreen(selectedScreen.id, {
                      nodePosition: {
                        ...selectedScreen.nodePosition,
                        y: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-0.5 block">
                  Rows
                </label>
                <input
                  type="number"
                  min={1}
                  value={selectedScreen.canvas.rows}
                  onChange={(e) =>
                    updateScreen(selectedScreen.id, {
                      canvas: {
                        ...selectedScreen.canvas,
                        rows: parseInt(e.target.value) || 20,
                      },
                    })
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-0.5 block">
                  Row height
                </label>
                <input
                  type="number"
                  min={10}
                  value={selectedScreen.canvas.rowHeight}
                  onChange={(e) =>
                    updateScreen(selectedScreen.id, {
                      canvas: {
                        ...selectedScreen.canvas,
                        rowHeight: parseInt(e.target.value) || 40,
                      },
                    })
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                />
              </div>
            </div>
            {/* Screen actions: duplicate & delete */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => duplicateScreen(selectedScreen.id)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Duplicar pantalla"
              >
                <Copy size={12} />
                Duplicar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={spec.screens.length <= 1}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                  spec.screens.length <= 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                }`}
                title={
                  spec.screens.length <= 1
                    ? "No se puede eliminar la última pantalla"
                    : "Eliminar pantalla"
                }
              >
                <Trash2 size={12} />
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Components list */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <SectionHeader
            title={`Componentes (${selectedScreen.components.length})`}
            expanded={expandedSections.components}
            onToggle={() => toggleSection("components")}
          />
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="p-1 hover:bg-gray-100 rounded text-blue-600"
              title="Agregar componente"
            >
              <Plus size={16} />
            </button>
            {showAddMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-44 max-h-60 overflow-auto">
                {COMPONENT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddComponent(type)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {expandedSections.components && (
          <div className="space-y-1 max-h-48 overflow-auto">
            {selectedScreen.components.map((comp) => (
              <div
                key={comp.id}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer ${
                  selectedComponentId === comp.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
                onClick={() => selectComponent(comp.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">
                    {comp.id}
                  </div>
                  <div className="text-gray-500 truncate">
                    {comp.type}
                    {comp.label && ` · ${comp.label}`}
                    {!comp.label && comp.placeholder && ` · ${comp.placeholder}`}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateComponent(selectedScreen.id, comp.id);
                  }}
                  className="p-0.5 hover:bg-gray-200 rounded text-gray-400"
                  title="Duplicar"
                >
                  <Copy size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeComponent(selectedScreen.id, comp.id);
                  }}
                  className="p-0.5 hover:bg-red-50 rounded text-red-400"
                  title="Eliminar"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Component properties editor — Modal */}
      <Modal
        isOpen={!!selectedComponent}
        onClose={() => selectComponent(null)}
        title={`Editar: ${selectedComponent?.id || ""}`}
        size="md"
      >
        {selectedComponent && (
          <ComponentPropertiesEditor
            screenId={selectedScreen.id}
            component={selectedComponent}
          />
        )}
      </Modal>

      {/* Business rules for this screen */}
      <div className="p-4 border-b border-gray-200">
        <BusinessRulesEditor screenId={selectedScreen.id} />
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2">
        <Button
          onClick={() => openPreview(selectedScreen.id)}
          variant="primary"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
        >
          <Eye size={16} />
          Previsualizar
        </Button>
        <Button
          onClick={() => openLogic(selectedScreen.id)}
          variant="secondary"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
        >
          <FileText size={16} />
          Ver lógica
        </Button>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Eliminar pantalla
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              ¿Estás seguro de que deseas eliminar{" "}
              <strong>{selectedScreen.name}</strong>? Se eliminarán también las
              conexiones asociadas.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteScreen(selectedScreen.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section header helper ───

function SectionHeader({
  title,
  expanded,
  onToggle,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900"
    >
      {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      {title}
    </button>
  );
}
