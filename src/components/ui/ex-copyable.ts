import { createLucideIcon } from "@/utils/icon";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Check, Copy } from "lucide";
import TailwindElement from "../tailwind-element";

@customElement("ex-copyable")
export class ExCopyable extends TailwindElement {
  @property()
  str = "";

  @state()
  isCopied = false;

  handleCopy = () => {
    navigator.clipboard.writeText(this.str);
    this.isCopied = true;
  };
  render() {
    const CopyIcon = createLucideIcon(Copy);
    const CheckIcon = createLucideIcon(Check);

    return html` <div
      class="flex cursor-pointer items-center hover:text-primary"
      @click=${this.handleCopy}
    >
      <div class="text-sm">
        <p>${this.str}</p>
      </div>
      <div class="ml-2">${this.isCopied ? CheckIcon : CopyIcon}</div>
    </div>`;
  }
}
