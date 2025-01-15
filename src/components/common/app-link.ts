import "@/components/ui/ex-button";
import { EX_MODULE_ENUM, handleModuleChange } from "@/utils/module";
import { cn } from "@/utils/style";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

@customElement("app-link")
export class ModuleLink extends TailwindElement {
  @property()
  module?: EX_MODULE_ENUM;

  @property()
  props?: Record<string, any>;

  @property({ type: Boolean })
  block?: boolean;

  render() {
    return html` <a
      class=${cn(
        "inline-flex items-center font-semibold cursor-pointer hover:text-primary",
        this.block && "w-full",
      )}
      @click="${() => {
        this.module && handleModuleChange(this.module, this.props);
      }}"
    >
      <slot></slot>
    </a>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-link": ModuleLink;
  }
}
