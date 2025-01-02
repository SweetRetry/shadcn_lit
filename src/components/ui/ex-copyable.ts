import { createLucideIcon } from "@/utils/icon";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Copy } from "lucide";
import TailwindElement from "../tailwind-element";

const CopyIcon = createLucideIcon(Copy);

@customElement("ex-copyable")
export class ExCopyable extends TailwindElement {
  @property()
  str = "";
  handleCopy = () => {
    window.navigator.clipboard.writeText(this.str);
  };
  render() {
    return html` <div
      class="flex cursor-pointer items-center hover:text-primary"
      @click=${this.handleCopy}
    >
      <div class="text-sm">
        <p>${this.str}</p>
      </div>
      <div class="ml-2">${CopyIcon}</div>
    </div>`;
  }
}
