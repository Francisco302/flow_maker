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
      md += `| ID | Tipo | Label | DataSource | Fields | Acción |\n`;
      md += `|---|---|---|---|---|---|\n`;
      screen.components.forEach((comp) => {
        const action = comp.action
          ? `${comp.action.type}${comp.action.target ? ` → ${comp.action.target}` : ""}`
          : "-";
        const label = comp.label || comp.placeholder || comp.value || "-";
        const dataSource = comp.dataSource || "-";
        const fields = comp.fields?.join(", ") || "-";
        md += `| ${comp.id} | ${comp.type} | ${label} | ${dataSource} | ${fields} | ${action} |\n`;
      });
      md += `\n`;

      // Detail components with options
      const withOptions = screen.components.filter(
        (c) => c.options && c.options.length > 0
      );
      if (withOptions.length > 0) {
        md += `**Opciones de componentes:**\n\n`;
        withOptions.forEach((comp) => {
          md += `- **${comp.id}**: ${comp.options!.join(", ")}\n`;
        });
        md += `\n`;
      }
    }

    // Reglas relacionadas
    const relatedRules = spec.businessRules?.filter((rule) =>
      rule.relatedScreens?.includes(screen.id)
    );
    if (relatedRules && relatedRules.length > 0) {
      md += `#### Reglas relacionadas\n\n`;
      relatedRules.forEach((rule) => {
        md += `- **${rule.id}**: ${rule.title}\n`;
        if (rule.description) {
          md += `  ${rule.description}\n`;
        }
      });
      md += `\n`;
    }

    // Conexiones
    const incomingFlows = spec.flows.filter(
      (f) => f.targetScreenId === screen.id
    );
    const outgoingFlows = spec.flows.filter(
      (f) => f.sourceScreenId === screen.id
    );

    if (incomingFlows.length > 0 || outgoingFlows.length > 0) {
      md += `#### Conexiones\n\n`;
      if (incomingFlows.length > 0) {
        md += `**Entrantes:**\n`;
        incomingFlows.forEach((flow) => {
          const source = spec.screens.find(
            (s) => s.id === flow.sourceScreenId
          );
          if (source) {
            md += `- Desde ${source.name}`;
            if (flow.label) md += ` (${flow.label})`;
            md += `\n`;
          }
        });
      }
      if (outgoingFlows.length > 0) {
        md += `**Salientes:**\n`;
        outgoingFlows.forEach((flow) => {
          const target = spec.screens.find(
            (s) => s.id === flow.targetScreenId
          );
          if (target) {
            md += `- Hacia ${target.name}`;
            if (flow.label) md += ` (${flow.label})`;
            md += `\n`;
          }
        });
      }
      md += `\n`;
    }
  });

  // Mock Data summary
  if (spec.mockData && Object.keys(spec.mockData).length > 0) {
    md += `## Mock Data\n\n`;
    for (const [source, rows] of Object.entries(spec.mockData)) {
      md += `### ${source}\n\n`;
      md += `${rows.length} registros\n\n`;
      if (rows.length > 0) {
        const keys = Object.keys(rows[0]);
        md += `| ${keys.join(" | ")} |\n`;
        md += `|${keys.map(() => "---").join("|")}|\n`;
        rows.slice(0, 5).forEach((row) => {
          md += `| ${keys.map((k) => String(row[k] ?? "")).join(" | ")} |\n`;
        });
        if (rows.length > 5) {
          md += `\n_...y ${rows.length - 5} más_\n`;
        }
        md += `\n`;
      }
    }
  }

  // Reglas de negocio
  if (spec.businessRules && spec.businessRules.length > 0) {
    md += `## Reglas de negocio\n\n`;
    spec.businessRules.forEach((rule) => {
      md += `### ${rule.id}: ${rule.title}\n\n`;
      md += `${rule.description}\n\n`;
      if (rule.relatedScreens && rule.relatedScreens.length > 0) {
        md += `**Pantallas relacionadas:** ${rule.relatedScreens.join(", ")}\n\n`;
      }
      if (rule.relatedComponents && rule.relatedComponents.length > 0) {
        md += `**Componentes relacionados:** ${rule.relatedComponents.join(", ")}\n\n`;
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
