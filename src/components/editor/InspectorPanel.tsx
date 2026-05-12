import React from "react";
import { Eye, FileText, ArrowRight, ArrowLeft } from "lucide-react";
import type { AppFlowSpec, ScreenSpec } from "../../lib/spec";
import { useAppFlowStore } from "../../store/useAppFlowStore";
import { Button } from "../common/Button";

interface InspectorPanelProps {
    spec: AppFlowSpec;
    selectedScreen: ScreenSpec | null;
}

export function InspectorPanel({ spec, selectedScreen }: InspectorPanelProps) {
    const openPreview = useAppFlowStore((state) => state.openPreview);
    const openLogic = useAppFlowStore((state) => state.openLogic);

    if (!selectedScreen) {
        return (
            <div className="w-80 bg-white border-l border-gray-200 overflow-auto p-4">
                <h2 className="font-semibold text-gray-800 mb-4">Resumen del proyecto</h2>

                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-gray-800">
                            {spec.screens.length}
                        </div>
                        <div className="text-sm text-gray-600">Pantallas</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-gray-800">
                            {spec.flows.length}
                        </div>
                        <div className="text-sm text-gray-600">Flujos</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-gray-800">
                            {spec.businessRules?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Reglas de negocio</div>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="font-medium text-gray-800 mb-2">Información</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                        <div>
                            <span className="font-medium">Nombre:</span> {spec.name}
                        </div>
                        <div>
                            <span className="font-medium">Versión:</span> {spec.version}
                        </div>
                        {spec.description && (
                            <div className="mt-2">
                                <span className="font-medium">Descripción:</span>
                                <p className="mt-1">{spec.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Get related data
    const incomingFlows = spec.flows.filter(
        (f) => f.targetScreenId === selectedScreen.id
    );
    const outgoingFlows = spec.flows.filter(
        (f) => f.sourceScreenId === selectedScreen.id
    );
    const relatedRules = spec.businessRules?.filter((rule) =>
        rule.relatedScreens?.includes(selectedScreen.id)
    );
    const componentsWithActions = selectedScreen.components.filter(
        (c) => c.action
    );

    return (
        <div className="w-80 bg-white border-l border-gray-200 overflow-auto">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">{selectedScreen.name}</h2>
                <p className="text-xs text-gray-500 mt-1">{selectedScreen.type}</p>
            </div>

            <div className="p-4 space-y-4">
                {selectedScreen.description && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </h3>
                        <p className="text-sm text-gray-600">{selectedScreen.description}</p>
                    </div>
                )}

                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Componentes
                    </h3>
                    <div className="text-sm text-gray-600">
                        {selectedScreen.components.length} componentes
                    </div>
                    <div className="mt-2 space-y-1">
                        {selectedScreen.components.slice(0, 5).map((comp) => (
                            <div
                                key={comp.id}
                                className="text-xs bg-gray-50 px-2 py-1 rounded"
                            >
                                <span className="font-medium">{comp.type}</span>
                                {comp.label && <span className="text-gray-500"> • {comp.label}</span>}
                            </div>
                        ))}
                        {selectedScreen.components.length > 5 && (
                            <div className="text-xs text-gray-500">
                                +{selectedScreen.components.length - 5} más
                            </div>
                        )}
                    </div>
                </div>

                {componentsWithActions.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Acciones</h3>
                        <div className="space-y-1">
                            {componentsWithActions.map((comp) => (
                                <div
                                    key={comp.id}
                                    className="text-xs bg-blue-50 px-2 py-1 rounded"
                                >
                                    <span className="font-medium">{comp.id}</span>
                                    <span className="text-gray-600"> → {comp.action?.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {relatedRules && relatedRules.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                            Reglas relacionadas
                        </h3>
                        <div className="space-y-1">
                            {relatedRules.map((rule) => (
                                <div
                                    key={rule.id}
                                    className="text-xs bg-yellow-50 px-2 py-1 rounded"
                                >
                                    <div className="font-medium">{rule.id}</div>
                                    <div className="text-gray-600">{rule.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Conexiones</h3>
                    {incomingFlows.length > 0 && (
                        <div className="mb-2">
                            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <ArrowLeft size={12} />
                                Entrantes
                            </div>
                            {incomingFlows.map((flow) => {
                                const source = spec.screens.find(
                                    (s) => s.id === flow.sourceScreenId
                                );
                                return (
                                    <div
                                        key={flow.id}
                                        className="text-xs bg-gray-50 px-2 py-1 rounded mb-1"
                                    >
                                        {source?.name}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {outgoingFlows.length > 0 && (
                        <div>
                            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <ArrowRight size={12} />
                                Salientes
                            </div>
                            {outgoingFlows.map((flow) => {
                                const target = spec.screens.find(
                                    (s) => s.id === flow.targetScreenId
                                );
                                return (
                                    <div
                                        key={flow.id}
                                        className="text-xs bg-gray-50 px-2 py-1 rounded mb-1"
                                    >
                                        {target?.name}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {incomingFlows.length === 0 && outgoingFlows.length === 0 && (
                        <div className="text-xs text-gray-500">Sin conexiones</div>
                    )}
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
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
            </div>
        </div>
    );
}
