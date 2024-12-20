import TailwindElement from "@/components/tailwind-element";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ex-spinner")
export class ExSpinner extends TailwindElement {
  @property({ type: Boolean })
  loading = false;

  render() {
    return this.loading
      ? html` <div class="flex justify-center">
          <div
            class="h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          ></div>
        </div>`
      : html`<slot></slot>`;
  }
}
