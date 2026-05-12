// Component Layout
export interface ComponentLayout {
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
}

// Action Spec
export interface ActionSpec {
  type:
  | "navigate"
  | "open_modal"
  | "close_modal"
  | "set_value"
  | "filter_data"
  | "submit_form"
  | "show_toast"
  | "external_link";
  target?: string;
  params?: Record<string, any>;
}

// Component Spec
export interface ComponentSpec {
  id: string;
  type:
  | "text"
  | "input"
  | "textarea"
  | "select"
  | "button"
  | "icon_button"
  | "checkbox"
  | "radio"
  | "card"
  | "list"
  | "grid"
  | "image_placeholder"
  | "empty_state"
  | "bottom_nav";
  label?: string;
  value?: string;
  placeholder?: string;
  icon?: string;
  options?: string[];
  dataSource?: string;
  fields?: string[];
  layout: ComponentLayout;
  action?: ActionSpec;
  behavior?: Record<string, any>;
  props?: Record<string, any>;
}

// Screen Spec
export interface ScreenSpec {
  id: string;
  name: string;
  type: "screen" | "form" | "modal" | "external";
  description?: string;
  nodePosition: {
    x: number;
    y: number;
  };
  canvas: {
    device: "mobile" | "desktop";
    columns: number;
    rows: number;
    rowHeight: number;
  };
  components: ComponentSpec[];
}

// Flow Connection
export interface FlowConnection {
  id: string;
  sourceScreenId: string;
  targetScreenId: string;
  label?: string;
  triggerComponentId?: string;
}

// Modal Spec
export interface ModalSpec {
  id: string;
  name: string;
  components: ComponentSpec[];
}

// Business Rule
export interface BusinessRule {
  id: string;
  title: string;
  description: string;
  relatedScreens?: string[];
  relatedComponents?: string[];
}

// Change Log Item
export interface ChangeLogItem {
  version: string;
  summary: string;
  createdAt: string;
}

// App Flow Spec
export interface AppFlowSpec {
  id: string;
  name: string;
  version: string;
  description?: string;
  screens: ScreenSpec[];
  flows: FlowConnection[];
  modals?: ModalSpec[];
  mockData?: Record<string, any[]>;
  businessRules?: BusinessRule[];
  changeLog?: ChangeLogItem[];
}
