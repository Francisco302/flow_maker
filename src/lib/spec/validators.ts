import { z } from "zod";

const ComponentLayoutSchema = z.object({
    colStart: z.number().min(1).max(12),
    colSpan: z.number().min(1).max(12),
    rowStart: z.number().min(1),
    rowSpan: z.number().min(1),
});

const ActionSpecSchema = z.object({
    type: z.enum([
        "navigate",
        "open_modal",
        "close_modal",
        "set_value",
        "filter_data",
        "submit_form",
        "show_toast",
        "external_link",
    ]),
    target: z.string().optional(),
    params: z.record(z.any()).optional(),
});

const ComponentSpecSchema = z.object({
    id: z.string(),
    type: z.enum([
        "text",
        "input",
        "textarea",
        "select",
        "button",
        "icon_button",
        "checkbox",
        "radio",
        "card",
        "list",
        "grid",
        "image_placeholder",
        "empty_state",
        "bottom_nav",
    ]),
    label: z.string().optional(),
    value: z.string().optional(),
    placeholder: z.string().optional(),
    icon: z.string().optional(),
    options: z.array(z.string()).optional(),
    dataSource: z.string().optional(),
    fields: z.array(z.string()).optional(),
    layout: ComponentLayoutSchema,
    action: ActionSpecSchema.optional(),
    behavior: z.record(z.any()).optional(),
    props: z.record(z.any()).optional(),
});

const ScreenSpecSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["screen", "form", "modal", "external"]),
    description: z.string().optional(),
    nodePosition: z.object({
        x: z.number(),
        y: z.number(),
    }),
    canvas: z.object({
        device: z.enum(["mobile", "desktop"]),
        columns: z.number(),
        rows: z.number(),
        rowHeight: z.number(),
    }),
    components: z.array(ComponentSpecSchema),
});

const FlowConnectionSchema = z.object({
    id: z.string(),
    sourceScreenId: z.string(),
    targetScreenId: z.string(),
    label: z.string().optional(),
    triggerComponentId: z.string().optional(),
});

const ModalSpecSchema = z.object({
    id: z.string(),
    name: z.string(),
    components: z.array(ComponentSpecSchema),
});

const BusinessRuleSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    relatedScreens: z.array(z.string()).optional(),
    relatedComponents: z.array(z.string()).optional(),
});

const ChangeLogItemSchema = z.object({
    version: z.string(),
    summary: z.string(),
    createdAt: z.string(),
});

export const AppFlowSpecSchema = z.object({
    id: z.string(),
    name: z.string(),
    version: z.string(),
    description: z.string().optional(),
    screens: z.array(ScreenSpecSchema),
    flows: z.array(FlowConnectionSchema),
    modals: z.array(ModalSpecSchema).optional(),
    mockData: z.record(z.array(z.any())).optional(),
    businessRules: z.array(BusinessRuleSchema).optional(),
    changeLog: z.array(ChangeLogItemSchema).optional(),
});

export function validateAppFlowSpec(spec: unknown) {
    try {
        AppFlowSpecSchema.parse(spec);
        console.log("✅ AppFlowSpec es válido");
        return { valid: true, errors: null };
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("❌ AppFlowSpec tiene errores:", error.errors);
            return { valid: false, errors: error.errors };
        }
        return { valid: false, errors: [error] };
    }
}
