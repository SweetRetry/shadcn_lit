import { cn } from "@/utils/style";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

@customElement("shadcn-lit-checkbox")
export class ShadcnLitCheckbox extends TailwindElement {
  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  class?: string;

  private onCheckedChange() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent("checked-change", {
        detail: { value: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <button
        ?disabled=${this.disabled}
        @click=${this.onCheckedChange}
        class=${cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          this.checked && "bg-primary text-primary-foreground",
          this.class,
        )}
      >
        ${this.checked
          ? html` <svg
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 6 9 17l-5-5"></path>
            </svg>`
          : ""}
      </button>
    `;
  }
}
