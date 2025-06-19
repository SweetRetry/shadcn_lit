import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";
import "./button";

@customElement("shadcn-lit-modal")
export class ShadcnLitModal extends TailwindElement {
  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  title = "";

  @property({ type: Boolean })
  closeOnMaskClick = true;

  @query("dialog")
  private dialog!: HTMLDialogElement;

  firstUpdated() {
    this.dialog.addEventListener("close", () => {
      this.open = false;
      this.dispatchEvent(new CustomEvent("close"));
    });
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("open")) {
      if (this.open) {
        this.dialog.showModal();
      } else {
        this.dialog.close();
      }
    }
  }

  private _handleMaskClick(e: MouseEvent) {
    if (this.closeOnMaskClick && e.target === this.dialog) {
      this.open = false;
    }
  }

  render() {
    return html`
      <dialog
        @click=${this._handleMaskClick}
        class="bg-transparent p-0 backdrop:bg-background/80"
      >
        <div
          class="relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg"
        >
          <header class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">${this.title}</h2>
            <button @click=${() => (this.open = false)} class="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span class="sr-only">Close</span>
            </button>
          </header>
          <div>
            <slot></slot>
          </div>
          <footer class="mt-4">
            <slot name="footer"></slot>
          </footer>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shadcn-lit-modal": ShadcnLitModal;
  }
}
