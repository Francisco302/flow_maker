import { Modal } from "../common/Modal";
import { ScreenPreview } from "../preview/ScreenPreview";
import { useAppFlowStore } from "../../store/useAppFlowStore";
import { Button } from "../common/Button";
import { Edit, Eye } from "lucide-react";
import { ComponentEditPanel } from "./ComponentEditPanel";

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

    if (!previewScreenId) return null;

    const screen = getScreen(previewScreenId);
    if (!screen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closePreview}
            title={`Preview: ${screen.name}`}
            size="full"
        >
            <div className="relative">
                <div className="flex flex-col items-center">
                    <div className="mb-4 flex gap-2 items-center">
                        <Button
                            onClick={toggleEditablePreview}
                            variant={editablePreview ? "primary" : "secondary"}
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            {editablePreview ? <Eye size={16} /> : <Edit size={16} />}
                            {editablePreview ? "Ver preview" : "Editar"}
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

                {editablePreview && selectedComponentId && <ComponentEditPanel />}
            </div>
        </Modal>
    );
}
