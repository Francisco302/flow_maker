import { Modal } from "../common/Modal";
import { ScreenPreview } from "../preview/ScreenPreview";
import { useAppFlowStore } from "../../store/useAppFlowStore";
import { Button } from "../common/Button";
import { Edit, Eye, X } from "lucide-react";
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

  if (!previewScreenId) return null;

  const screen = getScreen(previewScreenId);
  if (!screen) return null;

  const selectedComponent = selectedComponentId
    ? screen.components.find((c) => c.id === selectedComponentId)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closePreview}
      title={`Preview: ${screen.name}`}
      size="full"
    >
      <div className="flex gap-4">
        {/* Preview area */}
        <div className="flex-1 flex flex-col items-center">
          <div className="mb-4 flex gap-2 items-center">
            <Button
              onClick={toggleEditablePreview}
              variant={editablePreview ? "primary" : "secondary"}
              size="sm"
              className="flex items-center gap-2"
            >
              {editablePreview ? <Eye size={16} /> : <Edit size={16} />}
              {editablePreview ? "Ver preview" : "Editar layout"}
            </Button>
          </div>

          {editablePreview && (
            <p className="text-xs text-gray-500 mb-2 text-center">
              Haz clic sobre un componente para editarlo · Arrastra o
              redimensiona para cambiar layout
            </p>
          )}

          <ScreenPreview
            screen={screen}
            mockData={spec.mockData}
            editable={editablePreview}
          />
        </div>

        {/* Side panel for component editing */}
        {selectedComponent && (
          <div className="w-72 border-l border-gray-200 pl-4 overflow-auto max-h-[70vh]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">
                Propiedades
              </h3>
              <button
                onClick={() => selectComponent(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={16} />
              </button>
            </div>
            <ComponentPropertiesEditor
              screenId={screen.id}
              component={selectedComponent}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
