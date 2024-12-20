import "@/components/ui/ex-button";
import { EX_MODULE_ENUM, handleModuleChange } from "@/utils/module";
import { cn } from "@/utils/style";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

@customElement("ex-link")
export class ExLink extends TailwindElement {
  @property()
  class?: string;
  @property()
  module?: EX_MODULE_ENUM;
  render() {
    return html`<ex-button
      variant="link"
      class=${cn(this.class,'text-base')}
      @click="${() => {
        this.module && handleModuleChange(this.module);
      }}"
    >
      <slot></slot>
    </ex-button>`;
  }
}
