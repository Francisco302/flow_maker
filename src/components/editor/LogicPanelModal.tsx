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
      <div className="space-y-6">
        {/* Header info */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-neutral-900">{screen.name}</h2>
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] font-medium text-neutral-600 uppercase">
              {screen.type}
            </span>
          </div>
          {screen.description && (
            <p className="text-sm text-neutral-600">{screen.description}</p>
          )}
        </div>

        {/* Components */}
        <section>
          <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wide mb-3">
            Componentes ({screen.components.length})
          </h3>
          <div className="space-y-2">
            {screen.components.map((comp) => (
              <div
                key={comp.id}
                className="bg-neutral-50 border border-neutral-200 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-neutral-800">
                    {comp.id}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-neutral-200 text-[10px] font-medium text-neutral-600">
                    {comp.type}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-neutral-500">
                  {comp.label && <span>Label: {comp.label}</span>}
                  {comp.placeholder && <span>Placeholder: {comp.placeholder}</span>}
                  {comp.dataSource && <span>Data: {comp.dataSource}</span>}
                  {comp.fields && <span>Fields: {comp.fields.join(", ")}</span>}
                  <span>
                    Layout: col {comp.layout.colStart}–
                    {comp.layout.colStart + comp.layout.colSpan - 1}, row{" "}
                    {comp.layout.rowStart}–
                    {comp.layout.rowStart + comp.layout.rowSpan - 1}
                  </span>
                </div>
                {comp.action && (
                  <div className="mt-2 pt-2 border-t border-neutral-200 flex items-center gap-2">
                    <span className="text-[10px] font-medium text-neutral-500 uppercase">Acción:</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[10px] font-medium text-blue-700">
                      {comp.action.type}
                    </span>
                    {comp.action.target && (
                      <span className="text-[11px] text-neutral-600">→ {comp.action.target}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Business rules */}
        {relatedRules && relatedRules.length > 0 && (
          <section>
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wide mb-3">
              Reglas de negocio
            </h3>
            <div className="space-y-2">
              {relatedRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-amber-200 text-[10px] font-bold text-amber-800">
                      {rule.id}
                    </span>
                    <span className="text-xs font-semibold text-neutral-800">
                      {rule.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600">{rule.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Connections */}
        <section>
          <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wide mb-3">
            Conexiones
          </h3>

          {incomingFlows.length === 0 && outgoingFlows.length === 0 && (
            <p className="text-xs text-neutral-400">Sin conexiones</p>
          )}

          {incomingFlows.length > 0 && (
            <div className="mb-3">
              <h4 className="text-[11px] font-medium text-neutral-500 mb-1.5">Entrantes:</h4>
              <div className="space-y-1">
                {incomingFlows.map((flow) => {
                  const source = spec.screens.find((s) => s.id === flow.sourceScreenId);
                  return (
                    <div key={flow.id} className="text-xs text-neutral-700 flex items-center gap-1">
                      <span className="text-neutral-400">←</span>
                      <span className="font-medium">{source?.name || flow.sourceScreenId}</span>
                      {flow.label && <span className="text-neutral-400">({flow.label})</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {outgoingFlows.length > 0 && (
            <div>
              <h4 className="text-[11px] font-medium text-neutral-500 mb-1.5">Salientes:</h4>
              <div className="space-y-1">
                {outgoingFlows.map((flow) => {
                  const target = spec.screens.find((s) => s.id === flow.targetScreenId);
                  return (
                    <div key={flow.id} className="text-xs text-neutral-700 flex items-center gap-1">
                      <span className="text-neutral-400">→</span>
                      <span className="font-medium">{target?.name || flow.targetScreenId}</span>
                      {flow.label && <span className="text-neutral-400">({flow.label})</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
}
