import React, { useState } from "react";
import { useAppFlowStore } from "../../store/useAppFlowStore";
import { safeParseJson } from "../../lib/spec/editorUtils";

interface MockDataEditorProps {
  /** Optional: pre-select a specific data source */
  dataSource?: string;
}

export function MockDataEditor({ dataSource }: MockDataEditorProps) {
  const spec = useAppFlowStore((state) => state.spec);
  const updateMockData = useAppFlowStore((state) => state.updateMockData);

  const dataSources = Object.keys(spec.mockData || {});
  const [selected, setSelected] = useState<string>(
    dataSource || dataSources[0] || ""
  );
  const [jsonText, setJsonText] = useState<string>(() => {
    const ds = dataSource || dataSources[0] || "";
    const data = spec.mockData?.[ds];
    return data ? JSON.stringify(data, null, 2) : "[]";
  });
  const [error, setError] = useState("");
  const [newSourceName, setNewSourceName] = useState("");

  const handleSelectSource = (source: string) => {
    setSelected(source);
    const data = spec.mockData?.[source];
    setJsonText(data ? JSON.stringify(data, null, 2) : "[]");
    setError("");
  };

  const handleSave = () => {
    if (!selected) return;
    const result = safeParseJson(jsonText);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (!Array.isArray(result.data)) {
      setError("El valor debe ser un array");
      return;
    }
    updateMockData(selected, result.data);
    setError("");
  };

  const handleAddSource = () => {
    const name = newSourceName.trim();
    if (!name) return;
    updateMockData(name, []);
    setNewSourceName("");
    handleSelectSource(name);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-gray-700">Mock Data</h4>

      {/* Source selector */}
      <div className="flex gap-1 flex-wrap">
        {dataSources.map((ds) => (
          <button
            key={ds}
            onClick={() => handleSelectSource(ds)}
            className={`px-2 py-0.5 rounded text-xs border ${
              selected === ds
                ? "bg-blue-100 border-blue-300 text-blue-800"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {ds}
          </button>
        ))}
      </div>

      {/* Add new source */}
      <div className="flex gap-1">
        <input
          type="text"
          value={newSourceName}
          onChange={(e) => setNewSourceName(e.target.value)}
          placeholder="Nuevo data source"
          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleAddSource}
          disabled={!newSourceName.trim()}
          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* JSON editor */}
      {selected && (
        <div>
          <label className="text-xs text-gray-600 mb-0.5 block">
            {selected} (JSON array)
          </label>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={8}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
          />
          {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
          <button
            onClick={handleSave}
            className="mt-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
}
