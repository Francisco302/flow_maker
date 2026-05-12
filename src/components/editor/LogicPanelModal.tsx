import React from "react";
import { Modal } from "../common/Modal";
import { useAppFlowStore } from "../../store/useAppFlowStore";

export function LogicPanelModal() {
    const isOpen = useAppFlowStore((state) => state.isLogicOpen);
    const logicScreenId = useAppFlowStore((state) => state.logicScreenId);
    const closeLogic = useAppFlowStore((state) => state.closeLogic);
    const getScreen = useAppFlowStore((state) => state.getScreen);
    const spec = useAppFlowStore((state) => state.spec);

    if (!logicScreenId) return null;

    const screen = getScreen(logicScreenId);
    if (!screen) return null;

    const incomingFlows = spec.flows.filter((f) => f.targetScreenId === screen.id);
    const outgoingFlows = spec.flows.filter((f) => f.sourceScreenId === screen.id);
    const relatedRules = spec.businessRules?.filter((rule) =>
        rule.relatedScreens?.includes(screen.id)
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeLogic}
            title={`Lógica: ${screen.name}`}
            size="xl"
        >
            <div className="prose max-w-none">
                <h2 className="text-xl font-bold text-gray-800">{screen.name}</h2>
                <p className="text-gray-600 mb-4">
                    <strong>Tipo:</strong> {screen.type}
                </p>

                {screen.description && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Objetivo
                        </h3>
                        <p className="text-gray-700">{screen.description}</p>
                    </div>
                )}

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Componentes
                    </h3>
                    <div className="space-y-3">
                        {screen.components.map((comp) => (
                            <div
                                key={comp.id}
                                className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-800">
                                            {comp.id}
                                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {comp.type}
                                            </span>
                                        </div>
                                        {comp.label && (
                                            <div className="text-sm text-gray-600 mt-1">
                                                Label: {comp.label}
                                            </div>
                                        )}
                                        {comp.placeholder && (
                                            <div className="text-sm text-gray-600 mt-1">
                                                Placeholder: {comp.placeholder}
                                            </div>
                                        )}
                                        {comp.dataSource && (
                                            <div className="text-sm text-gray-600 mt-1">
                                                Data source: {comp.dataSource}
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500 mt-1">
                                            Layout: col {comp.layout.colStart}-
                                            {comp.layout.colStart + comp.layout.colSpan - 1}, row{" "}
                                            {comp.layout.rowStart}-
                                            {comp.layout.rowStart + comp.layout.rowSpan - 1}
                                        </div>
                                    </div>
                                </div>
                                {comp.action && (
                                    <div className="mt-2 pt-2 border-t border-gray-300">
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-700">Acción:</span>{" "}
                                            <span className="text-blue-600">{comp.action.type}</span>
                                            {comp.action.target && (
                                                <span className="text-gray-600">
                                                    {" "}
                                                    → {comp.action.target}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {relatedRules && relatedRules.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Reglas de negocio
                        </h3>
                        <div className="space-y-2">
                            {relatedRules.map((rule) => (
                                <div
                                    key={rule.id}
                                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                                >
                                    <div className="font-medium text-gray-800">{rule.id}</div>
                                    <div className="text-sm text-gray-700 mt-1">{rule.title}</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {rule.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Conexiones
                    </h3>

                    {incomingFlows.length > 0 && (
                        <div className="mb-3">
                            <h4 className="font-medium text-gray-700 mb-2">Entrantes:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {incomingFlows.map((flow) => {
                                    const source = spec.screens.find(
                                        (s) => s.id === flow.sourceScreenId
                                    );
                                    return (
                                        <li key={flow.id} className="text-sm text-gray-600">
                                            Desde <strong>{source?.name}</strong>
                                            {flow.label && <span> ({flow.label})</span>}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {outgoingFlows.length > 0 && (
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Salientes:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {outgoingFlows.map((flow) => {
                                    const target = spec.screens.find(
                                        (s) => s.id === flow.targetScreenId
                                    );
                                    return (
                                        <li key={flow.id} className="text-sm text-gray-600">
                                            Hacia <strong>{target?.name}</strong>
                                            {flow.label && <span> ({flow.label})</span>}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {incomingFlows.length === 0 && outgoingFlows.length === 0 && (
                        <p className="text-sm text-gray-500">Sin conexiones</p>
                    )}
                </div>
            </div>
        </Modal>
    );
}
