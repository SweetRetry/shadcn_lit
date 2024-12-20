import TailwindElement from "@/components/tailwind-element";
import { html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("ex-menu")
export class ExMenu extends TailwindElement {
  render() {
    return html`
      <div class="space-y-3">
        <slot></slot>
      </div>
    `;
  }
}

@customElement("ex-menu-item")
export class ExMenuItem extends TailwindElement {
  render() {
    return html` <div
      class="flex cursor-pointer items-center whitespace-nowrap px-3 py-1 text-sm transition-all hover:bg-secondary"
    >
      <slot></slot>
    </div>`;
  }
}
