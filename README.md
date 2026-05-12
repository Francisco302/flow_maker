# Chauchita Flow - MVP

Herramienta open source para documentar, visualizar y versionar la lógica de flujo de una app.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Instalar dependencias específicas del proyecto
npm install @xyflow/react zustand zod react-rnd lucide-react mermaid jsondiffpatch tailwindcss postcss autoprefixer

# Inicializar Tailwind (si es necesario)
npx tailwindcss init -p
```

## 🏃 Ejecutar

```bash
npm run dev
```

## 📦 Tecnologías

- **Vite** - Build tool
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **@xyflow/react** - Flow visualization
- **zustand** - State management
- **zod** - Schema validation
- **react-rnd** - Drag & resize components
- **lucide-react** - Icons
- **mermaid** - Diagram generation (preparado)
- **jsondiffpatch** - Version comparison (preparado)

## 🎯 Características

### ✅ Implementado en este MVP

- ✅ Visualización de flujo completo con nodos conectados
- ✅ Sidebar con lista de pantallas
- ✅ Inspector con información detallada
- ✅ Preview de pantallas como wireframes mobile
- ✅ Modo edición con drag & resize de componentes
- ✅ Vista de lógica de negocio por pantalla
- ✅ Exportación a JSON
- ✅ Generación de documentación Markdown
- ✅ Data quemada (mock data)
- ✅ Validación con Zod

### 🔜 Próximas versiones

- ⏳ IA para generar/actualizar schema
- ⏳ Supabase para persistencia
- ⏳ Gestión de versiones con diff
- ⏳ API keys cifradas
- ⏳ Exportación avanzada (Mermaid, etc.)
- ⏳ Autenticación de usuarios

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── common/          # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── Panel.tsx
│   ├── editor/          # Componentes del editor principal
│   │   ├── AppFlowEditor.tsx
│   │   ├── FlowCanvas.tsx
│   │   ├── FlowNode.tsx
│   │   ├── ScreensSidebar.tsx
│   │   ├── InspectorPanel.tsx
│   │   ├── ScreenPreviewModal.tsx
│   │   ├── LogicPanelModal.tsx
│   │   └── MarkdownModal.tsx
│   └── preview/         # Componentes de preview
│       ├── ScreenPreview.tsx
│       ├── ComponentRenderer.tsx
│       └── MobileFrame.tsx
├── lib/
│   ├── spec/            # Tipos y lógica del schema
│   │   ├── types.ts
│   │   ├── defaultSpec.ts
│   │   ├── validators.ts
│   │   ├── generateMarkdown.ts
│   │   └── exportFile.ts
│   └── layout/          # Helpers de layout
│       ├── gridToStyle.ts
│       └── snapToGrid.ts
├── store/
│   └── useAppFlowStore.ts  # Estado global con Zustand
├── App.tsx
└── main.tsx
```

## 🎨 Concepto

La herramienta permite documentar una app desde un **schema JSON** que actúa como fuente de verdad.

### Schema principal: AppFlowSpec

```typescript
{
  id: string;
  name: string;
  version: string;
  screens: ScreenSpec[];      // Pantallas/formularios
  flows: FlowConnection[];    // Conexiones entre pantallas
  mockData: Record<string, any[]>;  // Datos de prueba
  businessRules: BusinessRule[];    // Reglas de negocio
}
```

### Cada pantalla tiene:

- **Componentes** con layout en grilla de 12 columnas
- **Acciones** (navegación, modales, filtros, etc.)
- **Posición** en el canvas del flujo
- **Reglas de negocio** relacionadas

## 🔧 Uso

### 1. Visualizar el flujo

Al abrir la app verás el flujo completo de "Chauchita" (app de ejemplo) con todas las pantallas conectadas.

### 2. Seleccionar pantalla

Haz clic en cualquier pantalla del sidebar o del canvas para ver sus detalles en el inspector.

### 3. Previsualizar

Presiona "Previsualizar" para ver el wireframe mobile de la pantalla.

### 4. Modo edición

Dentro del preview, activa "Modo edición" para mover y redimensionar componentes. Los cambios se actualizan en el schema en memoria.

### 5. Ver lógica

Presiona "Ver lógica" para ver la documentación completa de la pantalla: componentes, acciones, reglas y conexiones.

### 6. Exportar

- **Exportar JSON**: Descarga el schema completo
- **Generar Markdown**: Genera y descarga documentación en formato Markdown

## 📝 Ejemplo de uso

El proyecto incluye "Chauchita", una app de ejemplo con:

- **8 pantallas**: Home, Onboarding, Lista de trabajadores, Perfil, etc.
- **7 flujos** conectando las pantallas
- **4 reglas de negocio**
- **Mock data** de trabajadores y ciudades

### Pantalla destacada: Lista de trabajadores

Incluye:
- Selector de ciudad (abre modal)
- Buscador (10 columnas)
- Botón de filtro (2 columnas)
- Grid de trabajadores (2 columnas)
- Bottom navigation

## 🎯 Criterios de aceptación

- [x] Editor se carga correctamente
- [x] Flujo completo visible con nodos conectados
- [x] Sidebar muestra todas las pantallas
- [x] Inspector muestra información detallada
- [x] Preview muestra wireframe mobile correcto
- [x] Modo edición permite mover/redimensionar
- [x] Exportar JSON funciona
- [x] Generar Markdown funciona
- [x] Sin backend, sin Supabase, sin IA
- [x] Código preparado para extensiones futuras

## 🚧 Notas de desarrollo

### Arquitectura preparada para:

1. **IA**: Los tipos y validadores están listos para recibir schemas generados por IA
2. **Supabase**: El store de Zustand puede extenderse fácilmente para sincronizar con Supabase
3. **Versionado**: jsondiffpatch está instalado para comparar versiones
4. **Exportación avanzada**: mermaid está listo para generar diagramas

### Limitaciones del MVP:

- No hay persistencia (todo en memoria)
- No hay autenticación
- No hay colaboración
- Edición visual básica (no es Figma)
- Un solo proyecto a la vez

## 📄 Licencia

Open source - MIT License
