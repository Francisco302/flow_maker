/** Shared wireframe style constants for consistent visual language */
export const wf = {
  // Containers
  panel: "bg-white border border-neutral-200 rounded-xl shadow-sm",
  card: "rounded-lg border border-neutral-200 bg-white overflow-hidden",
  cardInner: "p-3",

  // Skeletons
  skeletonDark: "rounded-full bg-neutral-800",
  skeletonMedium: "rounded-full bg-neutral-400",
  skeletonLight: "rounded-full bg-neutral-200",

  // Inputs
  input: "h-9 rounded-full bg-neutral-100 border border-neutral-200 px-4 flex items-center",
  textarea: "rounded-xl bg-neutral-100 border border-neutral-200 px-4 py-3",
  select: "h-9 rounded-full bg-neutral-100 border border-neutral-200 px-4 flex items-center justify-between",

  // Buttons
  buttonPrimary: "h-10 rounded-full bg-neutral-900 flex items-center justify-center px-6",
  buttonSecondary: "h-10 rounded-full bg-neutral-200 flex items-center justify-center px-6",
  iconButton: "w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center",

  // Image
  imagePlaceholder: "rounded-lg bg-neutral-200 flex items-center justify-center",

  // List
  listItem: "flex items-center gap-3 px-3 py-3 border-b border-neutral-100 last:border-0",

  // Bottom nav
  bottomNav: "bg-white border-t border-neutral-200 flex items-center justify-around px-2",
  navItemActive: "flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-neutral-900",
  navItemInactive: "flex flex-col items-center gap-0.5 p-1.5",

  // Typography
  textTitle: "text-sm font-bold text-neutral-900 leading-tight",
  textSubtitle: "text-xs font-semibold text-neutral-700 leading-tight",
  textBody: "text-xs text-neutral-600 leading-relaxed",
  textCaption: "text-[10px] text-neutral-400 leading-tight",
} as const;
