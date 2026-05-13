import { X, Edit, Eye } from "lucide-react";
import { ScreenPreview } from "../preview/ScreenPreview";
import { useAppFlowStore } from "../../store/useAppFlowStore";
import { Button } from "../common/Button";
import { ComponentPropertiesEditor } from "./ComponentPropertiesEditor";

export function ScreenPreviewModal() {
  const isOpen = useAppFlowStore((state) => state.isPreviewOpen);
  const previewScreenId = useAppFlowStore((state) => state.previewScreenId);
  const closePreview = useAppFlowStore((state) => state.closePreview);
  const getScreen = useAppFlowStore((state) => state.getScreen);
  const spec = useAppFlowStore((state) => state.spec);
  const editablePreview = useAppFlowStore((state) => state.editablePreview);
  const toggleEditablePreview = useAppFlowStore(
    (state) => state.toggleEditablePreview
  );
  const selectedComponentId = useAppFlowStore(
    (state) => state.selectedComponentId
  );
  const selectComponent = useAppFlowStore((state) => state.selectComponent);

  if (!isOpen || !previewScreenId) return null;

  const screen = getScreen(previewScreenId);
  if (!screen) return null;

  const selectedComponent = selectedComponentId
    ? screen.components.find((c) => c.id === selectedComponentId)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={closePreview} />

      {/* Modal */}
      <div className="relative flex flex-col w-full h-full max-w-[95vw] max-h-[95vh] m-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-200 bg-white flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900">{screen.name}</h2>
            <p className="text-xs text-neutral-500">
              {screen.type}
              {screen.description && ` · ${screen.description}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleEditablePreview}
              variant={editablePreview ? "primary" : "secondary"}
              size="sm"
              className="flex items-center gap-1.5"
            >
              {editablePreview ? <Eye size={14} /> : <Edit size={14} />}
              {editablePreview ? "Preview" : "Editar"}
            </Button>
            <button
              onClick={closePreview}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X size={18} className="text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Preview area — wireframe studio background */}
          <div
            className="flex-1 overflow-auto flex items-start justify-center"
            style={{ backgroundColor: "#e8e4df" }}
            onClick={() => selectComponent(null)}
          >
            <ScreenPreview
              screen={screen}
              mockData={spec.mockData}
              editable={editablePreview}
            />
          </div>

          {/* Side panel for component editing */}
          {selectedComponent && (
            <div className="w-72 border-l border-neutral-200 bg-white overflow-auto flex-shrink-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                  Propiedades
                </h3>
                <button
                  onClick={() => selectComponent(null)}
                  className="p-1 hover:bg-neutral-100 rounded"
                >
                  <X size={14} className="text-neutral-500" />
                </button>
              </div>
              <div className="p-4">
                <ComponentPropertiesEditor
                  screenId={screen.id}
                  component={selectedComponent}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-6 py-2 border-t border-neutral-100 bg-neutral-50 text-center flex-shrink-0">
          <span className="text-[10px] text-neutral-400">
            Haz clic en un componente para editarlo
            {editablePreview && " · Arrastra o redimensiona para cambiar layout"}
          </span>
        </div>
      </div>
    </div>
  );
}
