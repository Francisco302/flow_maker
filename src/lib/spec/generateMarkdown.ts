import type { AppFlowSpec } from "./types";

export function generateMarkdown(spec: AppFlowSpec): string {
    let md = `# ${spec.name}\n\n`;
    md += `**Versión:** ${spec.version}\n\n`;

    if (spec.description) {
        md += `## Descripción\n\n${spec.description}\n\n`;
    }

    // Flujo general
    md += `## Flujo general\n\n`;
    spec.flows.forEach((flow) => {
        const source = spec.screens.find((s) => s.id === flow.sourceScreenId);
        const target = spec.screens.find((s) => s.id === flow.targetScreenId);
        if (source && target) {
            md += `- ${source.name} → ${target.name}`;
            if (flow.label) {
                md += ` (${flow.label})`;
            }
            md += `\n`;
        }
    });
    md += `\n`;

    // Pantallas
    md += `## Pantallas\n\n`;
    spec.screens.forEach((screen) => {
        md += `### ${screen.name}\n\n`;
        if (screen.description) {
            md += `${screen.description}\n\n`;
        }
        md += `**Tipo:** ${screen.type}\n\n`;

        // Componentes
        if (screen.components.length > 0) {
            md += `#### Componentes\n\n`;
            md += `| ID | Tipo | Label | Acción |\n`;
            md += `|---|---|---|---|\n`;
            screen.components.forEach((comp) => {
                const action = comp.action ? comp.action.type : "-";
                md += `| ${comp.id} | ${comp.type} | ${comp.label || comp.placeholder || "-"} | ${action} |\n`;
            });
            md += `\n`;
        }

        // Reglas relacionadas
        const relatedRules = spec.businessRules?.filter((rule) =>
            rule.relatedScreens?.includes(screen.id)
        );
        if (relatedRules && relatedRules.length > 0) {
            md += `#### Reglas relacionadas\n\n`;
            relatedRules.forEach((rule) => {
                md += `- **${rule.id}**: ${rule.title}\n`;
            });
            md += `\n`;
        }

        // Conexiones
        const incomingFlows = spec.flows.filter((f) => f.targetScreenId === screen.id);
        const outgoingFlows = spec.flows.filter((f) => f.sourceScreenId === screen.id);

        if (incomingFlows.length > 0 || outgoingFlows.length > 0) {
            md += `#### Conexiones\n\n`;
            if (incomingFlows.length > 0) {
                md += `**Entrantes:**\n`;
                incomingFlows.forEach((flow) => {
                    const source = spec.screens.find((s) => s.id === flow.sourceScreenId);
                    if (source) {
                        md += `- Desde ${source.name}\n`;
                    }
                });
            }
            if (outgoingFlows.length > 0) {
                md += `**Salientes:**\n`;
                outgoingFlows.forEach((flow) => {
                    const target = spec.screens.find((s) => s.id === flow.targetScreenId);
                    if (target) {
                        md += `- Hacia ${target.name}\n`;
                    }
                });
            }
            md += `\n`;
        }
    });

    // Reglas de negocio
    if (spec.businessRules && spec.businessRules.length > 0) {
        md += `## Reglas de negocio\n\n`;
        spec.businessRules.forEach((rule) => {
            md += `### ${rule.id}: ${rule.title}\n\n`;
            md += `${rule.description}\n\n`;
            if (rule.relatedScreens && rule.relatedScreens.length > 0) {
                md += `**Pantallas relacionadas:** ${rule.relatedScreens.join(", ")}\n\n`;
            }
        });
    }

    // Changelog
    if (spec.changeLog && spec.changeLog.length > 0) {
        md += `## Changelog\n\n`;
        spec.changeLog.forEach((change) => {
            md += `### ${change.version} - ${change.createdAt}\n\n`;
            md += `${change.summary}\n\n`;
        });
    }

    return md;
}
