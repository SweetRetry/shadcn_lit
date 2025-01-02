import "@/components/ui/ex-button";
import { createLucideIcon } from "@/utils/icon";
import { EX_MODULE_ENUM, handleModuleChange } from "@/utils/module";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ArrowLeft } from "lucide";
import TailwindElement from "../tailwind-element";

const ArrorLeftIcon = createLucideIcon(ArrowLeft, { width: 20, height: 20 });

@customElement("app-link")
export class ModuleLink extends TailwindElement {
  @property()
  class?: string;
  @property()
  module?: EX_MODULE_ENUM;
  render() {
    return html`<ex-button
      variant="link"
      @click="${() => {
        this.module && handleModuleChange(this.module);
      }}"
    >
      ${ArrorLeftIcon}
      <slot></slot>
    </ex-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-link": ModuleLink;
  }
}
