# Flow Maker — Estado del Proyecto

## Qué es

Editor visual de flujos de aplicación basado en un schema JSON como fuente de verdad. Permite diseñar, documentar y previsualizar pantallas en modo wireframe de baja fidelidad.

## Stack

- React 18 + TypeScript
- Vite
- Zustand (estado global)
- Tailwind CSS
- React Flow (@xyflow/react) para el canvas de nodos
- react-rnd para drag & resize en el preview
- Zod para validación del schema
- lucide-react para iconografía

## Arquitectura

```
src/
├── store/              → Zustand store (única fuente de verdad)
├── lib/spec/           → Tipos, validadores, default data, markdown, export, utilidades de edición
├── lib/layout/         → Helpers de grid (pixels ↔ grid layout, snap)
├── components/
│   ├── common/         → Button, Modal, Panel
│   ├── editor/         → AppFlowEditor, FlowCanvas, FlowNode, InspectorPanel,
│   │                     ScreensSidebar, ScreenPreviewModal, LogicPanelModal,
│   │                     MarkdownModal, ComponentPropertiesEditor,
│   │                     BusinessRulesEditor, MockDataEditor
│   └── preview/        → ScreenPreview, ComponentRenderer, MobileFrame,
│                         wireframeStyles, iconMap
```

## Funcionalidades implementadas

### Editor completo basado en schema

- Edición de metadatos del proyecto (nombre, versión, descripción)
- Edición de pantallas (nombre, tipo, descripción, posición, canvas)
- Edición completa de componentes (label, value, placeholder, icon, options, fields, dataSource, props, behavior, action, layout)
- Agregar, duplicar y eliminar componentes
- Editor de reglas de negocio (CRUD)
- Editor de mock data (JSON por data source)

### Preview wireframe

- Mobile frame con estética de dispositivo real (status bar, home indicator)
- Renderer de componentes 100% guiado por schema
- Estilo wireframe profesional en escala de grises
- Skeletons automáticos cuando faltan datos
- Soporte de variantes visuales desde `component.props`
- Selección de componentes por clic (con highlight visual)
- Modo edición con drag & resize (react-rnd)

### Flow canvas

- Nodos reactivos que reflejan cambios del schema en tiempo real
- Edges animados entre pantallas
- Click en nodo selecciona pantalla en el inspector

### Exportación

- Export JSON del schema completo actualizado
- Generación de Markdown con pantallas, componentes, conexiones, reglas, mock data y changelog

## Principios de diseño

1. **Schema = fuente de verdad** — No hay textos hardcodeados en renderers
2. **Edición desde la interfaz** — Todo lo editable se modifica desde el panel o modales
3. **Tiempo real** — Cualquier cambio en Zustand se refleja inmediatamente en preview, nodos y markdown
4. **Wireframe, no UI final** — El preview simula maquetas de baja fidelidad, no una app terminada

## Lo que NO tiene (por diseño)

- Backend / base de datos
- Autenticación
- IA
- Persistencia más allá de la sesión (se exporta manualmente a JSON)
- Edición colaborativa

## Próximos pasos posibles

- Importar JSON para cargar un spec existente
- Undo/redo
- Agregar/eliminar pantallas desde la interfaz
- Agregar/eliminar flujos (edges) desde la interfaz
- Persistencia en localStorage
- Galería de pantallas en miniatura
- Temas de wireframe (light/dark/color)
