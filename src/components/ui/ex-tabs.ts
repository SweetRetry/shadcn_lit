import { cn } from "@/utils/style";
import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import TailwindElement from "../tailwind-element";

export interface ExTabItem {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: TemplateResult;
}
@customElement("ex-tabs")
export class ExTabs extends TailwindElement {
  @property()
  tabs: ExTabItem[] = [];

  @property()
  value = "";

  protected render() {
    return html`
      <ul class="flex items-center gap-x-3 text-sm font-medium">
        ${repeat(
          this.tabs,
          (tab) => tab.value,
          (tab: ExTabItem) => html`
            <li
              @click=${() =>
                this.dispatchEvent(
                  new CustomEvent("tab-change", { detail: tab }),
                )}
              class=${cn(
                " border-transparent cursor-pointer border-b-2  pb-2 ",
                tab.value === this.value
                  ? "text-primary border-primary"
                  : "hover:border-muted",
              )}
            >
              ${tab.label}
            </li>
          `,
        )}
      </ul>
    `;
  }
}
