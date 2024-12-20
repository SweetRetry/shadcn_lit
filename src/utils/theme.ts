import { TemplateResult, html } from "lit";
import { cn } from "./style";

export const renderThemeContainer = (
  theme: "light" | "dark",
  content: TemplateResult,
  className?: string,
) => html` <section class=${cn(theme, className)}>${content}</section> `;
