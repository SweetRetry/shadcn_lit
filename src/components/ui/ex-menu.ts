import TailwindElement from "@/components/tailwind-element";
import { cn } from "@/utils/style";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ex-menu")
export class ExMenu extends TailwindElement {
  render() {
    return html`
      <ul class="space-y-3">
        <slot></slot>
      </ul>
    `;
  }
}

@customElement("ex-menu-item")
export class ExMenuItem extends TailwindElement {
  @property({ type: Boolean })
  selected = false;
  render() {
    return html` <li
      class=${cn(
        "flex cursor-pointer my-1 items-center whitespace-nowrap rounded px-3 py-1 text-sm transition-colors hover:bg-secondary hover:text-primary",
        {
          "bg-secondary text-primary": this.selected,
        },
      )}
    >
      <slot></slot>
    </li>`;
  }
}
