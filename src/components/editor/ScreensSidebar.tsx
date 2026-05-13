import React, { useState } from "react";
import { Monitor, FileText, Square, Plus, Copy, Trash2 } from "lucide-react";
import type { ScreenSpec } from "../../lib/spec";
import { useAppFlowStore } from "../../store/useAppFlowStore";
import { NewScreenModal } from "./NewScreenModal";

interface ScreensSidebarProps {
  screens: ScreenSpec[];
}

export function ScreensSidebar({ screens }: ScreensSidebarProps) {
  const selectedScreenId = useAppFlowStore((state) => state.selectedScreenId);
  const selectScreen = useAppFlowStore((state) => state.selectScreen);
  const addScreen = useAppFlowStore((state) => state.addScreen);
  const duplicateScreen = useAppFlowStore((state) => state.duplicateScreen);
  const deleteScreen = useAppFlowStore((state) => state.deleteScreen);

  const [isNewScreenOpen, setIsNewScreenOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case "screen":
        return <Monitor size={16} />;
      case "form":
        return <FileText size={16} />;
      case "modal":
        return <Square size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  const handleDelete = (screenId: string) => {
    if (screens.length <= 1) return;
    setDeleteConfirmId(screenId);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteScreen(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <>
      <div className="w-64 bg-white border-r border-gray-200 overflow-auto flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">Pantallas</h2>
            <p className="text-xs text-gray-500 mt-1">
              {screens.length} pantallas
            </p>
          </div>
          <button
            onClick={() => setIsNewScreenOpen(true)}
            className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Nueva pantalla"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="p-2 flex-1 overflow-auto">
          {screens.map((screen) => (
            <div
              key={screen.id}
              className={`group relative w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors cursor-pointer ${
                selectedScreenId === screen.id
                  ? "bg-blue-100 border border-blue-300"
                  : "hover:bg-gray-100 border border-transparent"
              }`}
              onClick={() => selectScreen(screen.id)}
            >
              <div className="flex items-center gap-2 mb-1">
                {getIcon(screen.type)}
                <span className="font-medium text-sm text-gray-800 flex-1 truncate">
                  {screen.name}
                </span>
                {/* Quick actions — visible on hover */}
                <div className="hidden group-hover:flex items-center gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateScreen(screen.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-blue-600"
                    title="Duplicar pantalla"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(screen.id);
                    }}
                    className={`p-1 hover:bg-red-50 rounded ${
                      screens.length <= 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:text-red-600"
                    }`}
                    title={
                      screens.length <= 1
                        ? "No se puede eliminar la última pantalla"
                        : "Eliminar pantalla"
                    }
                    disabled={screens.length <= 1}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {screen.type} • {screen.components.length} comp.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Screen Modal */}
      <NewScreenModal
        isOpen={isNewScreenOpen}
        onClose={() => setIsNewScreenOpen(false)}
        onSubmit={(input) => {
          addScreen(input);
        }}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setDeleteConfirmId(null)}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Eliminar pantalla
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              ¿Estás seguro de que deseas eliminar la pantalla{" "}
              <strong>
                {screens.find((s) => s.id === deleteConfirmId)?.name}
              </strong>
              ? Se eliminarán también las conexiones asociadas. Esta acción no se
              puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
