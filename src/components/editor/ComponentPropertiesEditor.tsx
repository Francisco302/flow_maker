import React, { useState } from "react";
import { X } from "lucide-react";
import type { ComponentSpec, ActionSpec } from "../../lib/spec";
import { useAppFlowStore } from "../../store/useAppFlowStore";
import {
  parseCommaList,
  stringifyCommaList,
  safeParseJson,
} from "../../lib/spec/editorUtils";

interface ComponentPropertiesEditorProps {
  screenId: string;
  component: ComponentSpec;
  onClose?: () => void;
}

const ACTION_TYPES = [
  "none",
  "navigate",
  "open_modal",
  "close_modal",
  "set_value",
  "filter_data",
  "submit_form",
  "show_toast",
  "external_link",
] as const;

export function ComponentPropertiesEditor({
  screenId,
  component,
  onClose,
}: ComponentPropertiesEditorProps) {
  const updateComponent = useAppFlowStore((state) => state.updateComponent);
  const updateComponentLayout = useAppFlowStore(
    (state) => state.updateComponentLayout
  );
  const updateComponentAction = useAppFlowStore(
    (state) => state.updateComponentAction
  );

  const [propsText, setPropsText] = useState(
    component.props ? JSON.stringify(component.props, null, 2) : "{}"
  );
  const [behaviorText, setBehaviorText] = useState(
    component.behavior ? JSON.stringify(component.behavior, null, 2) : "{}"
  );
  const [propsError, setPropsError] = useState("");
  const [behaviorError, setBehaviorError] = useState("");
  const [paramsText, setParamsText] = useState(
    component.action?.params
      ? JSON.stringify(component.action.params, null, 2)
      : "{}"
  );
  const [paramsError, setParamsError] = useState("");

  const handleUpdate = (patch: Partial<ComponentSpec>) => {
    updateComponent(screenId, component.id, patch);
  };

  const handleLayoutUpdate = (
    key: keyof ComponentSpec["layout"],
    value: number
  ) => {
    updateComponentLayout(screenId, component.id, {
      ...component.layout,
      [key]: value,
    });
  };

  const handleFieldsChange = (value: string) => {
    handleUpdate({ fields: parseCommaList(value) });
  };

  const handleOptionsChange = (value: string) => {
    handleUpdate({ options: parseCommaList(value) });
  };

  const handlePropsBlur = () => {
    const result = safeParseJson(propsText);
    if (result.ok) {
      handleUpdate({ props: result.data });
      setPropsError("");
    } else {
      setPropsError(result.error);
    }
  };

  const handleBehaviorBlur = () => {
    const result = safeParseJson(behaviorText);
    if (result.ok) {
      handleUpdate({ behavior: result.data });
      setBehaviorError("");
    } else {
      setBehaviorError(result.error);
    }
  };

  const handleActionTypeChange = (type: string) => {
    if (type === "none") {
      updateComponentAction(screenId, component.id, undefined);
    } else {
      const newAction: ActionSpec = {
        type: type as ActionSpec["type"],
        target: component.action?.target || "",
        params: component.action?.params,
      };
      updateComponentAction(screenId, component.id, newAction);
    }
  };

  const handleActionTargetChange = (target: string) => {
    if (!component.action) return;
    updateComponentAction(screenId, component.id, {
      ...component.action,
      target,
    });
  };

  const handleActionParamsBlur = () => {
    if (!component.action) return;
    const result = safeParseJson(paramsText);
    if (result.ok) {
      updateComponentAction(screenId, component.id, {
        ...component.action,
        params: result.data,
      });
      setParamsError("");
    } else {
      setParamsError(result.error);
    }
  };

  return (
    <div className="space-y-3">
      {onClose && (
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-800">
            Editar componente
          </h4>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ID (readonly) */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          ID
        </label>
        <input
          type="text"
          value={component.id}
          readOnly
          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600"
        />
      </div>

      {/* Type (readonly) */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          Tipo
        </label>
        <div className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
          {component.type}
        </div>
      </div>

      {/* Label */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          Label
        </label>
        <input
          type="text"
          value={component.label || ""}
          onChange={(e) => handleUpdate({ label: e.target.value })}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Sin label"
        />
      </div>

      {/* Value */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          Value
        </label>
        <input
          type="text"
          value={component.value || ""}
          onChange={(e) => handleUpdate({ value: e.target.value })}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Sin valor"
        />
      </div>

      {/* Placeholder */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          Placeholder
        </label>
        <input
          type="text"
          value={component.placeholder || ""}
          onChange={(e) => handleUpdate({ placeholder: e.target.value })}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Sin placeholder"
        />
      </div>

      {/* Icon */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          Icono
        </label>
        <input
          type="text"
          value={component.icon || ""}
          onChange={(e) => handleUpdate({ icon: e.target.value })}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="ej: filter, search, home"
        />
      </div>

      {/* DataSource */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          Data Source
        </label>
        <input
          type="text"
          value={component.dataSource || ""}
          onChange={(e) => handleUpdate({ dataSource: e.target.value })}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="ej: workers, cities"
        />
      </div>

      {/* Fields */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          Fields (separados por coma)
        </label>
        <input
          type="text"
          value={stringifyCommaList(component.fields)}
          onChange={(e) => handleFieldsChange(e.target.value)}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="name, category, city"
        />
      </div>

      {/* Options */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          Options (separadas por coma)
        </label>
        <input
          type="text"
          value={stringifyCommaList(component.options)}
          onChange={(e) => handleOptionsChange(e.target.value)}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Opción 1, Opción 2"
        />
      </div>

      {/* Props JSON */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          Props (JSON)
        </label>
        <textarea
          value={propsText}
          onChange={(e) => setPropsText(e.target.value)}
          onBlur={handlePropsBlur}
          rows={3}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
        {propsError && (
          <p className="text-xs text-red-500 mt-0.5">{propsError}</p>
        )}
      </div>

      {/* Behavior JSON */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          Behavior (JSON)
        </label>
        <textarea
          value={behaviorText}
          onChange={(e) => setBehaviorText(e.target.value)}
          onBlur={handleBehaviorBlur}
          rows={3}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
        {behaviorError && (
          <p className="text-xs text-red-500 mt-0.5">{behaviorError}</p>
        )}
      </div>

      {/* Layout */}
      <div className="pt-2 border-t border-gray-200">
        <div className="text-xs font-semibold text-gray-700 mb-2">Layout</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600 mb-0.5 block">
              Col start
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={component.layout.colStart}
              onChange={(e) =>
                handleLayoutUpdate("colStart", parseInt(e.target.value) || 1)
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-0.5 block">
              Col span
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={component.layout.colSpan}
              onChange={(e) =>
                handleLayoutUpdate("colSpan", parseInt(e.target.value) || 1)
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-0.5 block">
              Row start
            </label>
            <input
              type="number"
              min={1}
              value={component.layout.rowStart}
              onChange={(e) =>
                handleLayoutUpdate("rowStart", parseInt(e.target.value) || 1)
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-0.5 block">
              Row span
            </label>
            <input
              type="number"
              min={1}
              value={component.layout.rowSpan}
              onChange={(e) =>
                handleLayoutUpdate("rowSpan", parseInt(e.target.value) || 1)
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="pt-2 border-t border-gray-200">
        <div className="text-xs font-semibold text-gray-700 mb-2">Acción</div>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-600 mb-0.5 block">Tipo</label>
            <select
              value={component.action?.type || "none"}
              onChange={(e) => handleActionTypeChange(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {ACTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {component.action && (
            <>
              <div>
                <label className="text-xs text-gray-600 mb-0.5 block">
                  Target
                </label>
                <input
                  type="text"
                  value={component.action.target || ""}
                  onChange={(e) => handleActionTargetChange(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="ej: screen_id o URL"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-0.5 block">
                  Params (JSON)
                </label>
                <textarea
                  value={paramsText}
                  onChange={(e) => setParamsText(e.target.value)}
                  onBlur={handleActionParamsBlur}
                  rows={2}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
                {paramsError && (
                  <p className="text-xs text-red-500 mt-0.5">{paramsError}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
