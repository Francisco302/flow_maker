import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { SCREEN_TYPES, SCREEN_TYPE_LABELS } from "../../lib/spec/screenUtils";
import type { ScreenSpec } from "../../lib/spec";

interface NewScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: {
    name: string;
    type: ScreenSpec["type"];
    description?: string;
  }) => void;
}

export function NewScreenModal({ isOpen, onClose, onSubmit }: NewScreenModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ScreenSpec["type"]>("screen");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    setError("");
    onSubmit({ name: name.trim(), type, description: description.trim() || undefined });

    // Reset form
    setName("");
    setType("screen");
    setDescription("");
    onClose();
  };

  const handleClose = () => {
    setError("");
    setName("");
    setType("screen");
    setDescription("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nueva pantalla" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            placeholder="Ej: Lista de productos"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ScreenSpec["type"])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SCREEN_TYPES.map((t) => (
              <option key={t} value={t}>
                {SCREEN_TYPE_LABELS[t] || t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción opcional de la pantalla"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}>
            Crear pantalla
          </Button>
        </div>
      </form>
    </Modal>
  );
}
