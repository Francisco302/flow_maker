# 👁️ Guía Visual - Qué esperar al ejecutar

Esta guía describe visualmente lo que deberías ver al ejecutar la aplicación.

---

## 🖥️ Pantalla principal

### Layout general
```
┌─────────────────────────────────────────────────────────────────┐
│ Header: Chauchita | v1.0.0    [Exportar JSON] [Generar Markdown]│
├──────────┬──────────────────────────────────────┬────────────────┤
│          │                                      │                │
│ Sidebar  │         Canvas (Flow)                │   Inspector    │
│          │                                      │                │
│ 8        │    ┌──────┐                          │   Resumen o    │
│ pantallas│    │ Home │                          │   Detalles     │
│          │    └──┬───┘                          │   de pantalla  │
│ - Home   │       │                              │                │
│ - Onb... │    ┌──▼────────┐                     │   [Preview]    │
│ - Work...│    │ Onboarding│                     │   [Lógica]     │
│ - City...│    └──┬────────┘                     │                │
│ - Work...│       │                              │                │
│ - Publ...│    ┌──▼──────────────┐               │                │
│ - Publ...│    │ Lista trabajad. │               │                │
│ - Profi..│    └─┬─┬─┬──────────┘               │                │
│          │      │ │ │                           │                │
│          │   ┌──┘ │ └──┐                        │                │
│          │   │    │    │                        │                │
│          │ [Perfil][Modal][Publicar]            │                │
│          │                                      │                │
└──────────┴──────────────────────────────────────┴────────────────┘
```

---

## 📱 Componentes visuales

### 1. Header (arriba)
```
┌─────────────────────────────────────────────────────────────┐
│  Chauchita                    [Exportar JSON] [Generar MD]  │
│  Versión 1.0.0                                              │
└─────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Título del proyecto: "Chauchita"
- Versión: "1.0.0"
- Botón gris: "Exportar JSON"
- Botón azul: "Generar Markdown"

---

### 2. Sidebar (izquierda)
```
┌──────────────┐
│ Pantallas    │
│ 8 pantallas  │
├──────────────┤
│ 📱 Home      │
│   screen • 2 │
├──────────────┤
│ 📱 Onboarding│
│   screen • 2 │
├──────────────┤
│ 📱 Lista de  │
│   trabajador │
│   screen • 6 │
├──────────────┤
│ ⬜ Selector  │
│   de ciudad  │
│   modal • 2  │
├──────────────┤
│ 📱 Perfil del│
│   trabajador │
│   screen • 5 │
├──────────────┤
│ 📄 Publicar  │
│   trabajo    │
│   form • 6   │
├──────────────┤
│ 📱 Publicac. │
│   exitosa    │
│   screen • 2 │
├──────────────┤
│ 📱 Config.   │
│   de perfil  │
│   screen • 4 │
└──────────────┘
```

**Características:**
- Lista de 8 pantallas
- Iconos según tipo (📱 screen, 📄 form, ⬜ modal)
- Contador de componentes
- Selección visual (fondo azul claro)

---

### 3. Canvas (centro)
```
┌────────────────────────────────────────────────────┐
│                                                    │
│     ┌─────────────┐                               │
│     │    Home     │                               │
│     │   screen    │                               │
│     │ 2 componentes│                              │
│     │ [👁️][📄]    │                               │
│     └──────┬──────┘                               │
│            │                                       │
│            ▼                                       │
│     ┌─────────────┐                               │
│     │ Onboarding  │                               │
│     │   screen    │                               │
│     │ 2 componentes│                              │
│     │ [👁️][📄]    │                               │
│     └──────┬──────┘                               │
│            │                                       │
│            ▼                                       │
│     ┌──────────────────┐                          │
│     │ Lista trabajad.  │                          │
│     │     screen       │                          │
│     │  6 componentes   │                          │
│     │   [👁️][📄]       │                          │
│     └─┬──┬──┬─────────┘                          │
│       │  │  │                                     │
│       ▼  ▼  ▼                                     │
│    [Perfil][Modal][Publicar]                     │
│                                                    │
│  [Zoom controls]  [Minimap]                       │
└────────────────────────────────────────────────────┘
```

**Características:**
- Nodos conectados con flechas animadas
- Cada nodo muestra:
  - Nombre de la pantalla
  - Tipo (screen/form/modal)
  - Cantidad de componentes
  - Botones: 👁️ Preview y 📄 Lógica
- Colores según tipo:
  - Screen: azul claro
  - Form: verde claro
  - Modal: morado claro
- Controles de zoom
- Minimap en esquina

---

### 4. Inspector (derecha)

#### Sin selección:
```
┌────────────────────┐
│ Resumen del        │
│ proyecto           │
├────────────────────┤
│                    │
│      8             │
│   Pantallas        │
│                    │
│      7             │
│    Flujos          │
│                    │
│      4             │
│ Reglas de negocio  │
│                    │
├────────────────────┤
│ Información        │
│                    │
│ Nombre: Chauchita  │
│ Versión: 1.0.0     │
│                    │
│ Descripción:       │
│ Plataforma para... │
└────────────────────┘
```

#### Con selección (ej: Lista de trabajadores):
```
┌────────────────────┐
│ Lista de           │
│ trabajadores       │
│ screen             │
├────────────────────┤
│ Descripción        │
│ Pantalla principal │
│ con lista de...    │
├────────────────────┤
│ Componentes        │
│ 6 componentes      │
│                    │
│ • text             │
│ • select           │
│ • input            │
│ • icon_button      │
│ • grid             │
│ • bottom_nav       │
├────────────────────┤
│ Acciones           │
│                    │
│ city_selector →    │
│   open_modal       │
│ search_input →     │
│   filter_data      │
│ filter_button →    │
│   open_modal       │
│ workers_grid →     │
│   navigate         │
├────────────────────┤
│ Reglas relacionadas│
│                    │
│ • WORKERS_FILTER   │
│ • WORKERS_SEARCH   │
│ • WORKERS_EMPTY    │
├────────────────────┤
│ Conexiones         │
│                    │
│ ← Entrantes        │
│ • Desde Onboarding │
│                    │
│ → Salientes        │
│ • Hacia Perfil     │
│ • Hacia Modal      │
│ • Hacia Publicar   │
│ • Hacia Config     │
├────────────────────┤
│ [Previsualizar]    │
│ [Ver lógica]       │
└────────────────────┘
```

---

## 📱 Modal de Preview

### Vista normal:
```
┌──────────────────────────────────────────────────┐
│ Preview: Lista de trabajadores            [X]    │
├──────────────────────────────────────────────────┤
│                                                  │
│         [Activar modo edición]                   │
│                                                  │
│         ┌────────────────┐                       │
│         │  9:41  📶📡🔋  │  ← Status bar         │
│         ├────────────────┤                       │
│         │                │                       │
│         │ Trabajadores   │  ← Título             │
│         │                │                       │
│         │ Ciudad: Quito ▼│  ← Selector           │
│         │                │                       │
│         │ [Buscar...] 🔍 │  ← Input + botón      │
│         │                │                       │
│         │ ┌────┐ ┌────┐ │  ← Grid 2 cols        │
│         │ │Card│ │Card│ │                       │
│         │ │ 1  │ │ 2  │ │                       │
│         │ └────┘ └────┘ │                       │
│         │ ┌────┐ ┌────┐ │                       │
│         │ │Card│ │Card│ │                       │
│         │ │ 3  │ │ 4  │ │                       │
│         │ └────┘ └────┘ │                       │
│         │                │                       │
│         │ [🏠] [🔍] [👤] │  ← Bottom nav         │
│         └────────────────┘                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Modo edición:
```
┌──────────────────────────────────────────────────┐
│ Preview: Lista de trabajadores            [X]    │
├──────────────────────────────────────────────────┤
│                                                  │
│         [Modo edición activo]                    │
│         Arrastra y redimensiona los componentes  │
│                                                  │
│         ┌────────────────┐                       │
│         │  9:41  📶📡🔋  │                       │
│         ├────────────────┤                       │
│         │┌──────────────┐│  ← Borde azul        │
│         ││Trabajadores  ││     punteado         │
│         │└──────────────┘│                       │
│         │┌──────────────┐│                       │
│         ││Ciudad: Quito▼││                       │
│         │└──────────────┘│                       │
│         │┌─────────┐┌──┐│                       │
│         ││Buscar...││🔍││  ← Redimensionable    │
│         │└─────────┘└──┘│                       │
│         │┌──────────────┐│                       │
│         ││   Grid       ││                       │
│         ││              ││                       │
│         │└──────────────┘│                       │
│         └────────────────┘                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 📄 Modal de Lógica

```
┌──────────────────────────────────────────────────┐
│ Lógica: Lista de trabajadores            [X]    │
├──────────────────────────────────────────────────┤
│                                                  │
│ Lista de trabajadores                            │
│ Tipo: screen                                     │
│                                                  │
│ Objetivo                                         │
│ Pantalla principal con lista de trabajadores    │
│ disponibles                                      │
│                                                  │
│ Componentes                                      │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ workers_title                              │  │
│ │ text                                       │  │
│ │ Label: Trabajadores                        │  │
│ │ Layout: col 1-12, row 1-1                  │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ city_selector                              │  │
│ │ select                                     │  │
│ │ Label: Ciudad: Quito                       │  │
│ │ Layout: col 1-12, row 2-2                  │  │
│ │ ─────────────────────────────────────────  │  │
│ │ Acción: open_modal → city_modal            │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ [... más componentes ...]                        │
│                                                  │
│ Reglas de negocio                                │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ WORKERS_FILTER_001                         │  │
│ │ Filtro por ciudad                          │  │
│ │ Si el usuario selecciona una ciudad...     │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ Conexiones                                       │
│                                                  │
│ Entrantes:                                       │
│ • Desde Onboarding                               │
│                                                  │
│ Salientes:                                       │
│ • Hacia Perfil del trabajador                    │
│ • Hacia Selector de ciudad                       │
│ • Hacia Publicar trabajo                         │
│ • Hacia Configuración de perfil                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 📝 Modal de Markdown

```
┌──────────────────────────────────────────────────┐
│ Documentación Markdown                    [X]    │
├──────────────────────────────────────────────────┤
│                                                  │
│ [Copiar] [Descargar .md]                         │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ # Chauchita                                │  │
│ │                                            │  │
│ │ **Versión:** 1.0.0                         │  │
│ │                                            │  │
│ │ ## Descripción                             │  │
│ │                                            │  │
│ │ Plataforma para conectar trabajadores...   │  │
│ │                                            │  │
│ │ ## Flujo general                           │  │
│ │                                            │  │
│ │ - Home → Onboarding                        │  │
│ │ - Onboarding → Lista de trabajadores       │  │
│ │ - Lista de trabajadores → Perfil...        │  │
│ │                                            │  │
│ │ ## Pantallas                               │  │
│ │                                            │  │
│ │ ### Home                                   │  │
│ │                                            │  │
│ │ Pantalla de inicio                         │  │
│ │                                            │  │
│ │ **Tipo:** screen                           │  │
│ │                                            │  │
│ │ [... más contenido ...]                    │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🎨 Paleta de colores

### Fondo y paneles
- Fondo general: `#f9fafb` (gris muy claro)
- Paneles: `#ffffff` (blanco)
- Bordes: `#e5e7eb` (gris claro)

### Texto
- Título: `#1f2937` (gris oscuro)
- Texto normal: `#6b7280` (gris medio)
- Texto secundario: `#9ca3af` (gris claro)

### Botones
- Primario: `#2563eb` (azul)
- Secundario: `#e5e7eb` (gris)
- Hover primario: `#1d4ed8` (azul oscuro)

### Nodos
- Screen: `#dbeafe` (azul claro) con borde `#93c5fd`
- Form: `#d1fae5` (verde claro) con borde `#6ee7b7`
- Modal: `#e9d5ff` (morado claro) con borde `#c084fc`

### Estados
- Seleccionado: `#dbeafe` (azul claro)
- Hover: `#f3f4f6` (gris muy claro)
- Activo: `#2563eb` (azul)

---

## ✅ Checklist visual

Al ejecutar la app, deberías ver:

- [ ] Header con título "Chauchita" y botones
- [ ] Sidebar con 8 pantallas listadas
- [ ] Canvas con nodos conectados
- [ ] Nodos con colores según tipo
- [ ] Flechas animadas entre nodos
- [ ] Inspector mostrando resumen
- [ ] Controles de zoom en el canvas
- [ ] Minimap en esquina del canvas

Al hacer clic en una pantalla:
- [ ] Nodo se resalta
- [ ] Inspector muestra detalles
- [ ] Se ven componentes listados
- [ ] Se ven acciones configuradas
- [ ] Se ven reglas relacionadas
- [ ] Botones "Previsualizar" y "Ver lógica"

Al previsualizar:
- [ ] Modal se abre
- [ ] Se ve marco mobile (390x760px)
- [ ] Status bar simulado
- [ ] Componentes renderizados
- [ ] Botón "Modo edición"

En modo edición:
- [ ] Componentes con borde azul punteado
- [ ] Se pueden arrastrar
- [ ] Se pueden redimensionar
- [ ] Snap a grilla funciona

Al exportar JSON:
- [ ] Se descarga archivo
- [ ] Nombre: `chauchita-flow-spec-v1.0.0.json`
- [ ] Contiene schema completo

Al generar Markdown:
- [ ] Modal se abre
- [ ] Se ve markdown formateado
- [ ] Botón "Copiar" funciona
- [ ] Botón "Descargar" funciona

---

## 🎉 ¡Listo!

Si ves todo esto, la aplicación está funcionando correctamente.

¡Disfruta explorando Chauchita Flow! 🚀
