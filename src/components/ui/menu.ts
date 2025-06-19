import { html } from "lit";
import { customElement } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

@customElement("shadcn-lit-menu")
export class ShadcnLitMenu extends TailwindElement {
  render() {
    return html`
      <div
        class="flex flex-col gap-1 p-2 min-w-[200px] bg-background border rounded-md"
      >
        <slot></slot>
      </div>
    `;
  }
}

@customElement("shadcn-lit-menu-item")
export class ShadcnLitMenuItem extends TailwindElement {
  render() {
    return html`
      <div
        class="px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent"
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shadcn-lit-menu": ShadcnLitMenu;
    "shadcn-lit-menu-item": ShadcnLitMenuItem;
  }
}
