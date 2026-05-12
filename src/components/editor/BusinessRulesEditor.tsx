import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAppFlowStore } from "../../store/useAppFlowStore";
import {
  parseCommaList,
  stringifyCommaList,
  createDefaultBusinessRule,
} from "../../lib/spec/editorUtils";

interface BusinessRulesEditorProps {
  /** Optional filter: only show rules related to this screen */
  screenId?: string;
}

export function BusinessRulesEditor({ screenId }: BusinessRulesEditorProps) {
  const spec = useAppFlowStore((state) => state.spec);
  const updateBusinessRule = useAppFlowStore(
    (state) => state.updateBusinessRule
  );
  const addBusinessRule = useAppFlowStore((state) => state.addBusinessRule);
  const removeBusinessRule = useAppFlowStore(
    (state) => state.removeBusinessRule
  );

  const rules = screenId
    ? (spec.businessRules || []).filter((r) =>
        r.relatedScreens?.includes(screenId)
      )
    : spec.businessRules || [];

  const handleAdd = () => {
    const rule = createDefaultBusinessRule();
    if (screenId) {
      rule.relatedScreens = [screenId];
    }
    addBusinessRule(rule);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-gray-700">
          Reglas de negocio ({rules.length})
        </h4>
        <button
          onClick={handleAdd}
          className="p-1 hover:bg-gray-100 rounded text-blue-600"
          title="Agregar regla"
        >
          <Plus size={14} />
        </button>
      </div>

      {rules.length === 0 && (
        <p className="text-xs text-gray-400">Sin reglas</p>
      )}

      {rules.map((rule) => (
        <div
          key={rule.id}
          className="border border-gray-200 rounded p-2 space-y-2"
        >
          <div className="flex items-start justify-between gap-1">
            <span className="text-xs font-mono text-gray-500">{rule.id}</span>
            <button
              onClick={() => removeBusinessRule(rule.id)}
              className="p-0.5 hover:bg-red-50 rounded text-red-500"
              title="Eliminar"
            >
              <Trash2 size={12} />
            </button>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-0.5 block">Título</label>
            <input
              type="text"
              value={rule.title}
              onChange={(e) =>
                updateBusinessRule(rule.id, { title: e.target.value })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-0.5 block">
              Descripción
            </label>
            <textarea
              value={rule.description}
              onChange={(e) =>
                updateBusinessRule(rule.id, { description: e.target.value })
              }
              rows={2}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-0.5 block">
              Pantallas (separadas por coma)
            </label>
            <input
              type="text"
              value={stringifyCommaList(rule.relatedScreens)}
              onChange={(e) =>
                updateBusinessRule(rule.id, {
                  relatedScreens: parseCommaList(e.target.value),
                })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-0.5 block">
              Componentes (separados por coma)
            </label>
            <input
              type="text"
              value={stringifyCommaList(rule.relatedComponents)}
              onChange={(e) =>
                updateBusinessRule(rule.id, {
                  relatedComponents: parseCommaList(e.target.value),
                })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
